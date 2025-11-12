-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('candidate', 'mentor', 'admin');
create type mentor_level as enum ('bronze', 'silver', 'gold');
create type session_status as enum ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
create type payment_status as enum ('pending', 'held_in_escrow', 'completed', 'refunded', 'partial_refund');
create type interview_round as enum ('round_1', 'round_2', 'hr_round');

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role user_role not null,
  email text unique not null,
  full_name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Candidates table
create table public.candidates (
  id uuid references public.profiles on delete cascade primary key,
  linkedin_headline text,
  linkedin_skills text[],
  linkedin_experience jsonb,
  linkedin_education jsonb,
  resume_url text,
  target_profile text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mentors table
create table public.mentors (
  id uuid references public.profiles on delete cascade primary key,
  linkedin_data jsonb,
  bio text,
  expertise_profiles text[] not null default '{}',
  is_hr_mentor boolean default false,
  session_price_inr integer not null, -- Net price after platform cut
  total_sessions integer default 0,
  average_rating decimal(3,2) default 0.00,
  mentor_level mentor_level default 'bronze',
  is_approved boolean default false,
  kyc_verified boolean default false,
  kyc_document_url text,
  bank_details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mentor availability slots
create table public.mentor_availability (
  id uuid default uuid_generate_v4() primary key,
  mentor_id uuid references public.mentors on delete cascade not null,
  day_of_week integer not null check (day_of_week >= 0 and day_of_week <= 6), -- 0 = Sunday
  start_time time not null,
  end_time time not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Interview packages (3 sessions: 2 technical + 1 HR)
create table public.interview_packages (
  id uuid default uuid_generate_v4() primary key,
  candidate_id uuid references public.candidates on delete cascade not null,
  mentor_id uuid references public.mentors on delete cascade not null,
  target_profile text not null,
  total_amount_inr integer not null,
  platform_fee_inr integer not null,
  mentor_payout_inr integer not null,
  payment_status payment_status default 'pending',
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Interview sessions
create table public.interview_sessions (
  id uuid default uuid_generate_v4() primary key,
  package_id uuid references public.interview_packages on delete cascade not null,
  round interview_round not null,
  mentor_id uuid references public.mentors on delete cascade not null,
  candidate_id uuid references public.candidates on delete cascade not null,
  scheduled_at timestamp with time zone,
  duration_minutes integer default 45,
  status session_status default 'pending',
  meeting_link text,
  recording_url text,
  interview_guide_url text,
  reschedule_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_round_per_package unique (package_id, round)
);

-- Session evaluations (mentor feedback)
create table public.session_evaluations (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.interview_sessions on delete cascade unique not null,
  communication_score integer check (communication_score >= 1 and communication_score <= 5),
  problem_solving_score integer check (problem_solving_score >= 1 and problem_solving_score <= 5),
  technical_depth_score integer check (technical_depth_score >= 1 and technical_depth_score <= 5),
  overall_score integer check (overall_score >= 1 and overall_score <= 5),
  strengths text,
  areas_for_improvement text,
  detailed_feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Final compiled reports
create table public.final_reports (
  id uuid default uuid_generate_v4() primary key,
  package_id uuid references public.interview_packages on delete cascade unique not null,
  overall_assessment text,
  key_strengths text[],
  improvement_areas text[],
  recommendation text,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Candidate reviews (for mentors)
create table public.candidate_reviews (
  id uuid default uuid_generate_v4() primary key,
  package_id uuid references public.interview_packages on delete cascade unique not null,
  candidate_id uuid references public.candidates on delete cascade not null,
  mentor_id uuid references public.mentors on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  review_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  title text not null,
  message text not null,
  type text not null,
  is_read boolean default false,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Disputes
create table public.disputes (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.interview_sessions on delete cascade not null,
  raised_by uuid references public.profiles on delete cascade not null,
  dispute_type text not null,
  description text not null,
  status text default 'open',
  resolution text,
  resolved_by uuid references public.profiles on delete set null,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index idx_candidates_profile on public.candidates(target_profile);
create index idx_mentors_approved on public.mentors(is_approved) where is_approved = true;
create index idx_mentors_profiles on public.mentors using gin(expertise_profiles);
create index idx_mentor_availability_mentor on public.mentor_availability(mentor_id);
create index idx_interview_packages_candidate on public.interview_packages(candidate_id);
create index idx_interview_packages_mentor on public.interview_packages(mentor_id);
create index idx_interview_sessions_package on public.interview_sessions(package_id);
create index idx_interview_sessions_status on public.interview_sessions(status);
create index idx_notifications_user on public.notifications(user_id) where is_read = false;

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.candidates enable row level security;
alter table public.mentors enable row level security;
alter table public.mentor_availability enable row level security;
alter table public.interview_packages enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.session_evaluations enable row level security;
alter table public.final_reports enable row level security;
alter table public.candidate_reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.disputes enable row level security;

-- RLS Policies for profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS Policies for candidates
create policy "Candidates can view own data"
  on public.candidates for select
  using (auth.uid() = id);

create policy "Candidates can insert own data"
  on public.candidates for insert
  with check (auth.uid() = id);

create policy "Candidates can update own data"
  on public.candidates for update
  using (auth.uid() = id);

-- RLS Policies for mentors
create policy "Approved mentors are viewable by candidates"
  on public.mentors for select
  using (is_approved = true or auth.uid() = id);

create policy "Mentors can insert own data"
  on public.mentors for insert
  with check (auth.uid() = id);

create policy "Mentors can update own data"
  on public.mentors for update
  using (auth.uid() = id);

-- RLS Policies for mentor availability
create policy "Availability visible to all authenticated users"
  on public.mentor_availability for select
  using (auth.role() = 'authenticated');

create policy "Mentors can manage own availability"
  on public.mentor_availability for all
  using (auth.uid() = mentor_id);

-- RLS Policies for interview packages
create policy "Users can view their own packages"
  on public.interview_packages for select
  using (auth.uid() = candidate_id or auth.uid() = mentor_id);

create policy "Candidates can create packages"
  on public.interview_packages for insert
  with check (auth.uid() = candidate_id);

-- RLS Policies for interview sessions
create policy "Participants can view their sessions"
  on public.interview_sessions for select
  using (auth.uid() = candidate_id or auth.uid() = mentor_id);

create policy "System can create sessions"
  on public.interview_sessions for insert
  with check (auth.uid() = candidate_id or auth.uid() = mentor_id);

create policy "Participants can update sessions"
  on public.interview_sessions for update
  using (auth.uid() = candidate_id or auth.uid() = mentor_id);

-- RLS Policies for session evaluations
create policy "Candidates can view their evaluations"
  on public.session_evaluations for select
  using (
    exists (
      select 1 from public.interview_sessions
      where interview_sessions.id = session_evaluations.session_id
      and interview_sessions.candidate_id = auth.uid()
    )
  );

create policy "Mentors can create evaluations"
  on public.session_evaluations for insert
  with check (
    exists (
      select 1 from public.interview_sessions
      where interview_sessions.id = session_evaluations.session_id
      and interview_sessions.mentor_id = auth.uid()
    )
  );

-- RLS Policies for notifications
create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Functions to update timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add triggers for updated_at
create trigger handle_profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_candidates_updated_at before update on public.candidates
  for each row execute procedure public.handle_updated_at();

create trigger handle_mentors_updated_at before update on public.mentors
  for each row execute procedure public.handle_updated_at();

create trigger handle_interview_packages_updated_at before update on public.interview_packages
  for each row execute procedure public.handle_updated_at();

create trigger handle_interview_sessions_updated_at before update on public.interview_sessions
  for each row execute procedure public.handle_updated_at();

-- Function to update mentor statistics after review
create or replace function public.update_mentor_stats()
returns trigger as $$
begin
  update public.mentors
  set 
    total_sessions = (
      select count(*) from public.interview_sessions
      where mentor_id = new.mentor_id and status = 'completed'
    ),
    average_rating = (
      select coalesce(avg(rating), 0) from public.candidate_reviews
      where mentor_id = new.mentor_id
    ),
    mentor_level = case
      when total_sessions >= 50 and average_rating >= 4.5 then 'gold'::mentor_level
      when total_sessions >= 11 then 'silver'::mentor_level
      else 'bronze'::mentor_level
    end
  where id = new.mentor_id;
  
  return new;
end;
$$ language plpgsql;

create trigger update_mentor_stats_trigger
after insert on public.candidate_reviews
for each row execute procedure public.update_mentor_stats();

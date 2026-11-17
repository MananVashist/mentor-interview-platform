-- Estate cleanup, owner-approved 2026-11-17. Already applied to the shared Supabase project rcbaaiiawrglvyzmawvr through the Supabase MCP
-- (version 20261117013029). A manual backup copy and five functions nothing calls: no code in this repo, and no trigger, policy or other
-- function uses them. Rows and function definitions are backed up at D:\Projects\_archive\db\jarvis-project-dropped-objects-2026-11-17.json.
drop table if exists public.mentor_availability_rules_backup;
drop function if exists public.create_booking_package;
drop function if exists public.create_profile_for_user;
drop function if exists public.is_session_mentor;
drop function if exists public.log_session_status_change;
drop function if exists public.update_evaluation_templates_updated_at;

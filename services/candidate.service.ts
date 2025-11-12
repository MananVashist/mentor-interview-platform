import { supabase } from '@/lib/supabase/client';
import { Candidate } from '@/lib/types';

export const candidateService = {
  /**
   * Get candidate by ID
   */
  async getCandidateById(candidateId: string): Promise<Candidate | null> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', candidateId)
        .single();

      if (error) throw error;
      return data as Candidate;
    } catch (error) {
      console.error('Error fetching candidate:', error);
      return null;
    }
  },

  /**
   * Update candidate profile
   */
  async updateCandidate(candidateId: string, updates: Partial<Candidate>) {
    const { data, error } = await supabase
      .from('candidates')
      .update(updates)
      .eq('id', candidateId)
      .select()
      .single();

    return { data, error };
  },

  /**
   * Upload resume
   */
  async uploadResume(candidateId: string, file: File | Blob, fileName: string) {
    try {
      // Upload file to Supabase Storage
      const filePath = `resumes/${candidateId}/${Date.now()}_${fileName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Update candidate record with resume URL
      const { error: updateError } = await supabase
        .from('candidates')
        .update({ resume_url: urlData.publicUrl })
        .eq('id', candidateId);

      if (updateError) throw updateError;

      return { url: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading resume:', error);
      return { url: null, error };
    }
  },

  /**
   * Import LinkedIn profile data
   */
  async importLinkedInData(candidateId: string, linkedInData: {
    headline?: string;
    skills?: string[];
    experience?: any[];
    education?: any[];
  }) {
    const { data, error } = await supabase
      .from('candidates')
      .update({
        linkedin_headline: linkedInData.headline,
        linkedin_skills: linkedInData.skills,
        linkedin_experience: linkedInData.experience,
        linkedin_education: linkedInData.education,
      })
      .eq('id', candidateId)
      .select()
      .single();

    return { data, error };
  },

  /**
   * Get candidate's interview packages
   */
  async getCandidatePackages(candidateId: string) {
    try {
      const { data, error } = await supabase
        .from('interview_packages')
        .select(`
          *,
          mentor:mentors(*, profile:profiles(*)),
          sessions:interview_sessions(*)
        `)
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching candidate packages:', error);
      return [];
    }
  },

  /**
   * Get candidate's sessions
   */
  async getCandidateSessions(candidateId: string) {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select(`
          *,
          mentor:mentors(*, profile:profiles(*)),
          evaluation:session_evaluations(*)
        `)
        .eq('candidate_id', candidateId)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching candidate sessions:', error);
      return [];
    }
  },

  /**
   * Get final report for a package
   */
  async getFinalReport(packageId: string) {
    try {
      const { data, error } = await supabase
        .from('final_reports')
        .select('*')
        .eq('package_id', packageId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching final report:', error);
      return null;
    }
  },

  /**
   * Submit review for mentor
   */
  async submitReview(packageId: string, candidateId: string, mentorId: string, rating: number, reviewText?: string) {
    const { data, error } = await supabase
      .from('candidate_reviews')
      .insert({
        package_id: packageId,
        candidate_id: candidateId,
        mentor_id: mentorId,
        rating: rating,
        review_text: reviewText,
      })
      .select()
      .single();

    return { data, error };
  },
};

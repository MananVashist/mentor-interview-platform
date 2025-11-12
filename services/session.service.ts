import { supabase } from '@/lib/supabase/client';
import { InterviewSession, SessionEvaluation } from '@/lib/types';

export const sessionService = {
  /**
   * Get session by ID
   */
  async getSessionById(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select(`
          *,
          candidate:candidates(*, profile:profiles(*)),
          mentor:mentors(*, profile:profiles(*)),
          evaluation:session_evaluations(*)
        `)
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    }
  },

  /**
   * Schedule a session
   */
  async scheduleSession(
    sessionId: string,
    scheduledAt: string,
    meetingLink?: string
  ) {
    const { data, error } = await supabase
      .from('interview_sessions')
      .update({
        scheduled_at: scheduledAt,
        meeting_link: meetingLink,
        status: 'confirmed',
      })
      .eq('id', sessionId)
      .select()
      .single();

    return { data, error };
  },

  /**
   * Reschedule a session
   */
  async rescheduleSession(
    sessionId: string,
    newScheduledAt: string
  ) {
    try {
      // Get current session
      const { data: session } = await supabase
        .from('interview_sessions')
        .select('reschedule_count')
        .eq('id', sessionId)
        .single();

      if (!session) throw new Error('Session not found');
      if (session.reschedule_count >= 1) {
        throw new Error('Maximum reschedules reached');
      }

      const { data, error } = await supabase
        .from('interview_sessions')
        .update({
          scheduled_at: newScheduledAt,
          reschedule_count: session.reschedule_count + 1,
        })
        .eq('id', sessionId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error rescheduling session:', error);
      return { data: null, error };
    }
  },

  /**
   * Mark session as completed
   */
  async completeSession(sessionId: string, recordingUrl?: string) {
    const { data, error } = await supabase
      .from('interview_sessions')
      .update({
        status: 'completed',
        recording_url: recordingUrl,
      })
      .eq('id', sessionId)
      .select()
      .single();

    return { data, error };
  },

  /**
   * Mark session as no-show
   */
  async markNoShow(sessionId: string, noShowParty: 'mentor' | 'candidate') {
    const { data, error } = await supabase
      .from('interview_sessions')
      .update({
        status: 'no_show',
      })
      .eq('id', sessionId)
      .select()
      .single();

    // If mentor no-show, initiate refund process
    if (noShowParty === 'mentor' && data) {
      // TODO: Trigger refund/reschedule flow
    }

    return { data, error };
  },

  /**
   * Submit session evaluation (by mentor)
   */
  async submitEvaluation(
    sessionId: string,
    evaluation: Omit<SessionEvaluation, 'id' | 'session_id' | 'created_at'>
  ) {
    const { data, error } = await supabase
      .from('session_evaluations')
      .insert({
        session_id: sessionId,
        ...evaluation,
      })
      .select()
      .single();

    return { data, error };
  },

  /**
   * Update session evaluation
   */
  async updateEvaluation(
    evaluationId: string,
    updates: Partial<SessionEvaluation>
  ) {
    const { data, error } = await supabase
      .from('session_evaluations')
      .update(updates)
      .eq('id', evaluationId)
      .select()
      .single();

    return { data, error };
  },

  /**
   * Get mentor's upcoming sessions
   */
  async getMentorUpcomingSessions(mentorId: string) {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select(`
          *,
          candidate:candidates(*, profile:profiles(*)),
          package:interview_packages(*)
        `)
        .eq('mentor_id', mentorId)
        .in('status', ['pending', 'confirmed'])
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      return [];
    }
  },

  /**
   * Get mentor's past sessions
   */
  async getMentorPastSessions(mentorId: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select(`
          *,
          candidate:candidates(*, profile:profiles(*)),
          evaluation:session_evaluations(*)
        `)
        .eq('mentor_id', mentorId)
        .eq('status', 'completed')
        .order('scheduled_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching past sessions:', error);
      return [];
    }
  },

  /**
   * Get sessions needing evaluation
   */
  async getSessionsNeedingEvaluation(mentorId: string) {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select(`
          *,
          candidate:candidates(*, profile:profiles(*)),
          evaluation:session_evaluations(*)
        `)
        .eq('mentor_id', mentorId)
        .eq('status', 'completed')
        .is('evaluation', null)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching sessions needing evaluation:', error);
      return [];
    }
  },

  /**
   * Generate final report after all sessions complete
   */
  async generateFinalReport(packageId: string) {
    try {
      // Get all evaluations for the package
      const { data: sessions } = await supabase
        .from('interview_sessions')
        .select(`
          *,
          evaluation:session_evaluations(*)
        `)
        .eq('package_id', packageId);

      if (!sessions || sessions.length !== 3) {
        throw new Error('All sessions must be completed');
      }

      // Check if all sessions have evaluations
      const allEvaluated = sessions.every(s => s.evaluation);
      if (!allEvaluated) {
        throw new Error('All sessions must have evaluations');
      }

      // TODO: Implement AI-powered summary generation
      // For now, create a basic report
      const strengths: string[] = [];
      const improvements: string[] = [];
      
      sessions.forEach(session => {
        if (session.evaluation?.strengths) {
          strengths.push(session.evaluation.strengths);
        }
        if (session.evaluation?.areas_for_improvement) {
          improvements.push(session.evaluation.areas_for_improvement);
        }
      });

      const { data, error } = await supabase
        .from('final_reports')
        .insert({
          package_id: packageId,
          overall_assessment: 'Assessment based on 3 interview rounds',
          key_strengths: strengths,
          improvement_areas: improvements,
          recommendation: 'Review detailed feedback from each round',
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error generating final report:', error);
      return { data: null, error };
    }
  },

  /**
   * Upload session recording
   */
  async uploadRecording(sessionId: string, file: File | Blob, fileName: string) {
    try {
      const filePath = `recordings/${sessionId}/${Date.now()}_${fileName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('recordings')
        .getPublicUrl(filePath);

      // Update session with recording URL
      const { error: updateError } = await supabase
        .from('interview_sessions')
        .update({ recording_url: urlData.publicUrl })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      return { url: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading recording:', error);
      return { url: null, error };
    }
  },
};

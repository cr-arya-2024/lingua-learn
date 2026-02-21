import { createClient } from '@/lib/supabase/server';
import { Lesson, UserProgress, UserPremium } from './types';

export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data as UserProgress | null;
};

export const getLessonById = async (lessonId: string): Promise<Lesson> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('lessons')
    .select('*, exercises(*, exercise_options(*))')
    .eq('id', lessonId)
    .single();
  if (error) throw error;
  return data as Lesson;
};

export const getAllLessons = async (courseId: string): Promise<Lesson[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order', { ascending: true });
  if (error) throw error;
  return data as Lesson[];
};

export const updateUserProgress = async (userId: string, data: Partial<UserProgress>) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('user_progress')
    .update(data)
    .eq('user_id', userId);
  if (error) throw error;
};

export const decrementHearts = async (userId: string) => {
  const supabase = createClient();
  const progress = await getUserProgress(userId);
  if (!progress) return;
  const { error } = await supabase
    .from('user_progress')
    .update({ hearts: Math.max(progress.hearts - 1, 0) })
    .eq('user_id', userId);
  if (error) throw error;
};

export const resetHearts = async (userId: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('user_progress')
    .update({ hearts: 5 })
    .eq('user_id', userId);
  if (error) throw error;
};

export const getUserPremiumStatus = async (): Promise<UserPremium | null> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('user_premium')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data as UserPremium | null;
};

export const upsertUserPremium = async (data: any) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('user_premium')
    .upsert(data);
  if (error) throw error;
};

export const getOrCreateUserProgress = async (userId: string): Promise<UserProgress> => {
  const progress = await getUserProgress(userId);
  if (progress) return progress;
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_progress')
    .insert({
      user_id: userId,
      hearts: 5,
      points: 0,
      active_course_id: null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as UserProgress;
};

export const getTopTenUsers = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_progress')
    .select('*, profiles(username, avatar_url)')
    .order('points', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data ?? [];
};

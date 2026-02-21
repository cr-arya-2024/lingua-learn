import { createClient } from '@/lib/supabase/server';

export interface Lesson {
  id: string;
  title: string;
  unit_id: string;
  order_index: number;
}

export interface Exercise {
  id: string;
  lesson_id: string;
  type: 'SELECT' | 'ASSIST' | 'TRANSLATE';
  question: string;
  order_index: number;
  options?: string[];
  correct_answer: string;
}

export interface UserProgress {
  user_id: string;
  user_name: string;
  user_image_src: string;
  active_course_id: string | null;
  hearts: number;
  points: number;
  streak: number;
  last_active: string | null;
}

export interface UserPremium {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  stripe_current_period_end: string | null;
  is_active: boolean;
}

export const getUserProgress = async (userId?: string) => {
  const supabase = createClient();
  let uid = userId;
  if (!uid) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    uid = user.id;
  }
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', uid)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data as UserProgress | null;
};

export const getLessonById = async (lessonId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();
  if (error) throw error;
  return data as Lesson;
};

export const getAllLessons = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('order_index');
  if (error) throw error;
  return (data || []) as Lesson[];
};

export const getExercisesForLesson = async (lessonId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('challenges')
    .select('*, challenge_options(*)')
    .eq('lesson_id', lessonId)
    .order('order_index');
  if (error) throw error;
  return data || [];
};

export const getUserPremiumStatus = async (userId?: string) => {
  const supabase = createClient();
  let uid = userId;
  if (!uid) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    uid = user.id;
  }
  const { data } = await supabase
    .from('user_subscriptions')
    .select('is_active, stripe_current_period_end')
    .eq('user_id', uid)
    .single();
  if (!data) return false;
  const now = new Date();
  const periodEnd = data.stripe_current_period_end ? new Date(data.stripe_current_period_end) : null;
  return data.is_active === true && periodEnd !== null && periodEnd > now;
};

export const getOrCreateUserProgress = async (userId?: string) => {
  const supabase = createClient();
  let uid = userId;
  if (!uid) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    uid = user.id;
  }
  const { data: existing } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', uid)
    .single();
  if (existing) return existing as UserProgress;
  const { data: newProgress, error } = await supabase
    .from('user_progress')
    .insert({ user_id: uid, hearts: 5, points: 0, streak: 0, user_name: 'User', user_image_src: '/hero.svg' })
    .select('*')
    .single();
  if (error) throw error;
  return newProgress as UserProgress;
};

export const updateUserProgress = async (userId: string, data: { points?: number; streak?: number; last_active?: string; active_course_id?: string }) => {
  const supabase = createClient();
  const { data: result, error } = await supabase
    .from('user_progress')
    .update(data)
    .eq('user_id', userId)
    .select('*')
    .single();
  if (error) throw error;
  return result;
};

export const decrementHeart = async (userId: string) => {
  const supabase = createClient();
  const { data: progress } = await supabase
    .from('user_progress')
    .select('hearts')
    .eq('user_id', userId)
    .single();
  const newHearts = Math.max(0, (progress?.hearts ?? 0) - 1);
  const { data, error } = await supabase
    .from('user_progress')
    .update({ hearts: newHearts })
    .eq('user_id', userId)
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

export const resetHearts = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_progress')
    .update({ hearts: 5 })
    .eq('user_id', userId)
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

export const upsertUserPremium = async (
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  isActive: boolean
): Promise<any> => {
  const supabase = createClient();
  const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_price_id: 'price_premium',
      stripe_current_period_end: periodEnd,
      is_active: isActive,
    }, { onConflict: 'user_id' })
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

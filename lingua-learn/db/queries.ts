export interface Lesson {
  id: string;
  title: string;
  unitId: string;
  order: number;
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: "SELECT" | "ASSIST";
  question: string;
  order: number;
}

export interface UserProgress {
  userId: string;
  userName: string;
  userImageSrc: string;
  activeCourseId: string;
  hearts: number;
  points: number;
}

export interface UserPremium {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
}

import { createClient } from "@/lib/supabase/server";

export const getUserProgress = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("userId", user.id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as UserProgress | null;
};

export const getLessonById = async (lessonId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*, exercises(*, challenges(*))")
    .eq("id", lessonId)
    .single();

  if (error) throw error;
  return data;
};

export const getAllLessons = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw error;
  return data as Lesson[];
};

export const getUserPremiumStatus = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from("user_premium")
    .select("*")
    .eq("userId", user.id)
    .single();

  if (error || !data) return false;

  const isActive = data.stripePriceId && 
    new Date(data.stripeCurrentPeriodEnd).getTime() + 86_400_000 > Date.now();

  return !!isActive;
};

export const getOrCreateUserProgress = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const existingProgress = await getUserProgress();

  if (existingProgress) return existingProgress;

  const { data, error } = await supabase
    .from("user_progress")
    .insert({
      userId: user.id,
      userName: user.user_metadata.full_name || "User",
      userImageSrc: user.user_metadata.avatar_url || "/placeholder.png",
      activeCourseId: "en", // Default course
      hearts: 5,
      points: 0,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as UserProgress;
};

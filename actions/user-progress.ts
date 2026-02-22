"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUserProgress, getUserPremiumStatus } from "@/db/queries";

export const selectCourse = async (courseId: string) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("user_progress")
    .update({ active_course_id: courseId })
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
};

export const submitAnswer = async (lessonId: string) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const progress = await getUserProgress(user.id);
  const premium = await getUserPremiumStatus();

  if (!progress) throw new Error("Progress not found");

  if (premium?.status === 'active') return;

  if (progress.hearts === 0) {
    throw new Error("hearts");
  }

  const { error } = await supabase
    .from("user_progress")
    .update({ hearts: Math.max(progress.hearts - 1, 0) })
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/shop");
  revalidatePath("/leaderboard");
};

export const refillHearts = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const progress = await getUserProgress(user.id);
  if (!progress) throw new Error("Progress not found");

  if (progress.hearts === 5) throw new Error("Full hearts");
  if (progress.points < 10) throw new Error("Not enough points");

  const { error } = await supabase
    .from("user_progress")
    .update({
      hearts: 5,
      points: progress.points - 10
    })
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/learn");
  revalidatePath("/shop");
  revalidatePath("/leaderboard");
};

export const finishLesson = async (lessonId: string) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const progress = await getUserProgress(user.id);
  if (!progress) throw new Error("Progress not found");

  // Award XP and potentially update streak
  const { error } = await supabase
    .from("user_progress")
    .update({
      points: progress.points + 10,
      last_active_at: new Date().toISOString()
    })
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/quests");
};

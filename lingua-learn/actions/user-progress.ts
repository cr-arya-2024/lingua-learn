import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const selectCourse = async (courseId: string) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("user_progress")
    .update({ activeCourseId: courseId })
    .eq("userId", user.id);

  if (error) throw error;

  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
};

export const finishLesson = async (lessonId: string) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Logic to update user progress, award XP, update streak, etc.
  // This is a simplified version
  const { data: progress } = await supabase
    .from("user_progress")
    .select("points")
    .eq("userId", user.id)
    .single();

  await supabase
    .from("user_progress")
    .update({ points: (progress?.points || 0) + 10 })
    .eq("userId", user.id);

  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/quests");
};

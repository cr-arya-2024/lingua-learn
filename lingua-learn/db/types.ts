export interface UserProgress {
  user_id: string;
  hearts: number;
  points: number;
  active_course_id: string | null;
  streak_days?: number;
  last_active_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserPremium {
  id: string;
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan: string;
  status: string;
  current_period_end?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  title: string;
  image_src?: string;
  description?: string;
  language_code: string;
  created_at?: string;
  updated_at?: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order: number;
  completed?: boolean;
  exercises?: Exercise[];
  created_at?: string;
  updated_at?: string;
}

export interface Exercise {
  id: string;
  lesson_id: string;
  type: 'TRANSLATE' | 'ASSIST' | 'SELECT' | 'MATCH';
  question: string;
  order: number;
  exercise_options?: ExerciseOption[];
  created_at?: string;
  updated_at?: string;
}

export interface ExerciseOption {
  id: string;
  exercise_id: string;
  text: string;
  correct: boolean;
  audio_src?: string;
  image_src?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserExerciseProgress {
  id: string;
  user_id: string;
  exercise_id: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

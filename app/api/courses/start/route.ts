import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const AVAILABLE_COURSES = ['spanish', 'french', 'japanese', 'german', 'hindi', 'mandarin'];

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use the first available course (or you can randomize)
    const courseId = AVAILABLE_COURSES[0];

    // Update user's active course
    const { error: updateError } = await supabase
      .from('user_progress')
      .update({ active_course_id: courseId })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user progress', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { courseId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error starting course:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

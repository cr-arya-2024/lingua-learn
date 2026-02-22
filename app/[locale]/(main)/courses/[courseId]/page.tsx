import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

type Props = {
    params: { courseId: string };
};

export default async function CoursePage({ params }: Props) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect('/login');

    try {
        // Fetch lessons for this course
        const { data: lessons } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', params.courseId)
            .order('unit_order', { ascending: true })
            .order('lesson_order', { ascending: true });

        // Map course ID to display name
        const courseNames: Record<string, string> = {
            spanish: '🇪🇸 Spanish',
            french: '🇫🇷 French',
            japanese: '🇯🇵 Japanese',
            german: '🇩🇪 German',
            hindi: '🇮🇳 Hindi',
            mandarin: '🇨🇳 Mandarin',
        };

        const courseName = courseNames[params.courseId] || params.courseId;

        return (
            <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
                <div className="max-w-4xl mx-auto w-full px-4 py-8">
                    <Link href="/learn" className="text-blue-400 hover:text-blue-300 mb-6 inline-flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Learn
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">{courseName}</h1>
                        <p className="text-slate-400">Complete lessons to progress through the course</p>
                    </div>

                    <div className="grid gap-4">
                        {lessons && lessons.length > 0 ? (
                            lessons.map((lesson: any, index: number) => (
                                <Link
                                    key={lesson.id}
                                    href={`/lesson/${lesson.id}`}
                                    className="p-6 bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] hover:border-green-500 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center font-bold text-lg">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold group-hover:text-green-400 transition-colors">
                                                    {lesson.title}
                                                </h2>
                                                <p className="text-slate-400 text-sm">Start this lesson</p>
                                            </div>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-slate-600 group-hover:text-green-500 transition-colors"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-6 bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] text-center text-slate-400">
                                <p>No lessons available in {courseName} yet. Check back soon!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading course:', error);
        return redirect('/learn');
    }
}

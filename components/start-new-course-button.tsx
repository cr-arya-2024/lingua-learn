'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/locale-context';

export const StartNewCourseButton = () => {
  const router = useRouter();
  const { locale } = useLocale();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleStartCourse = () => {
    setError(null);
    startTransition(async () => {
      try {
        // Call the API endpoint to start a new course
        const response = await fetch('/api/courses/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to start a new course');
        }

        const { courseId } = data;

        if (!courseId) {
          throw new Error('No course ID returned from server');
        }

        const coursePath = `/${locale}/courses/${courseId}`;
        console.log('Course started successfully, navigating to:', coursePath);

        // Navigate to the course page (locale-prefixed)
        router.push(coursePath);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
        setError(errorMessage);
        console.error('Error starting course:', err);
      }
    });
  };

  return (
    <div className="w-full">
      <button
        onClick={handleStartCourse}
        disabled={pending}
        className={`
          w-full px-6 py-4 rounded-2xl font-bold text-lg transition-all
          flex items-center justify-center gap-2
          ${
            pending
              ? 'bg-gray-400 cursor-not-allowed opacity-75'
              : 'bg-green-500 hover:bg-green-400 text-white cursor-pointer'
          }
          ${error ? 'mb-2' : ''}
        `}
      >
        {pending ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Starting course...</span>
          </>
        ) : (
          'Start a new course'
        )}
      </button>

      {error && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-100 text-sm">
          <p className="font-semibold">Error: {error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline text-xs mt-1"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

"use client";
import { useState, useTransition } from "react";
import { selectCourse } from "@/actions/user-progress";
import { useRouter } from "next/navigation";

const COURSES = [
  { id: "spanish", label: "Spanish", flag: "\u{1F1EA}\u{1F1F8}", color: "bg-yellow-400" },
  { id: "french", label: "French", flag: "\u{1F1EB}\u{1F1F7}", color: "bg-blue-500" },
  { id: "japanese", label: "Japanese", flag: "\u{1F1EF}\u{1F1F5}", color: "bg-red-500" },
  { id: "german", label: "German", flag: "\u{1F1E9}\u{1F1EA}", color: "bg-gray-700" },
  { id: "hindi", label: "Hindi", flag: "\u{1F1EE}\u{1F1F3}", color: "bg-orange-500" },
  { id: "mandarin", label: "Mandarin", flag: "\u{1F1E8}\u{1F1F3}", color: "bg-red-600" },
];

export const CourseSelection = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (courseId: string) => {
    setSelected(courseId);
    startTransition(async () => {
      await selectCourse(courseId);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col items-center gap-y-8 pb-10 pt-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-700 mb-2">
          Choose a language
        </h1>
        <p className="text-neutral-500 text-base">
          Pick the language you want to learn
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {COURSES.map((course) => (
          <button
            key={course.id}
            onClick={() => handleSelect(course.id)}
            disabled={pending}
            className={`flex flex-col items-center justify-center gap-y-3 p-6 rounded-2xl border-2 transition-all font-bold text-lg
              ${
                selected === course.id
                  ? "border-green-500 bg-green-50 scale-105"
                  : "border-neutral-200 hover:border-green-400 hover:bg-green-50"
              }
              ${pending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <span className="text-4xl">{course.flag}</span>
            <span className="text-neutral-700">{course.label}</span>
          </button>
        ))}
      </div>
      {pending && (
        <p className="text-green-500 font-semibold animate-pulse">Starting your course...</p>
      )}
    </div>
  );
};

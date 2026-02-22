'use client';

import { useMemo } from 'react';

type StreakLevel = 'none' | 'low' | 'medium' | 'high' | 'max';

interface StreakCalendarProps {
  streakDays: number;
  lastActiveDate?: string;
  contributionData?: Record<string, number>; // date -> activity count
}

const getStreakLevel = (activityCount: number): StreakLevel => {
  if (activityCount === 0) return 'none';
  if (activityCount === 1) return 'low';
  if (activityCount === 2) return 'medium';
  if (activityCount === 3) return 'high';
  return 'max';
};

const levelColors: Record<StreakLevel, string> = {
  none: 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
  low: 'bg-green-100 dark:bg-green-900',
  medium: 'bg-green-300 dark:bg-green-700',
  high: 'bg-green-500 dark:bg-green-600',
  max: 'bg-green-600 dark:bg-green-500',
};

export const StreakCalendar = ({ streakDays, lastActiveDate, contributionData = {} }: StreakCalendarProps) => {
  const calendarData = useMemo(() => {
    const weeks: (Date | null)[][] = [];
    const today = new Date();
    
    // Start from 12 weeks ago
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 84);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    let currentWeek: (Date | null)[] = [];
    let currentDate = new Date(startDate);

    while (weeks.length < 13 || currentDate <= today) {
      currentWeek.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);

      if (currentDate.getDay() === 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, []);

  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getActivityCount = (date: Date): number => {
    const key = formatDateKey(date);
    return contributionData[key] ?? 0;
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className='w-full'>
      <div className='mb-4'>
        <div className='flex items-baseline gap-2 mb-2'>
          <span className='text-2xl font-bold text-green-500'>{streakDays}</span>
          <span className='text-slate-500'>Day Streak 🔥</span>
        </div>
        {lastActiveDate && (
          <p className='text-sm text-slate-400'>Last active: {new Date(lastActiveDate).toLocaleDateString()}</p>
        )}
      </div>

      <div className='overflow-x-auto pb-4'>
        <div className='inline-block'>
          {/* Day labels */}
          <div className='flex gap-1 mb-2'>
            <div className='w-6' />
            <div className='flex flex-col gap-1'>
              {dayLabels.slice(0, 7).map((day) => (
                <div key={day} className='w-3 text-center text-xs text-slate-400 h-5'>
                  {day.charAt(0)}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar grid */}
          <div className='flex gap-1'>
            {calendarData.map((week, weekIdx) => (
              <div key={weekIdx} className='flex flex-col gap-1'>
                {/* Month label for first week of month */}
                {week[0] && weekIdx === 0 && (
                  <div className='h-5 text-xs text-slate-400 mb-1'>
                    {months[week[0].getMonth()]}
                  </div>
                )}
                {week[0] && week[0].getDate() <= 7 && weekIdx > 0 && (
                  <div className='h-5 text-xs text-slate-400 mb-1'>
                    {months[week[0].getMonth()]}
                  </div>
                )}

                {week.map((date, dayIdx) => {
                  if (!date) return null;
                  const activityCount = getActivityCount(date);
                  const level = getStreakLevel(activityCount);
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <div
                      key={`${weekIdx}-${dayIdx}`}
                      className={`w-3 h-3 rounded-sm ${levelColors[level]} ${
                        isToday ? 'ring-2 ring-green-400' : ''
                      } cursor-pointer hover:ring-2 hover:ring-green-300 transition-all`}
                      title={`${date.toLocaleDateString()}: ${activityCount} lesson${activityCount !== 1 ? 's' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className='flex items-center gap-3 mt-4 text-xs text-slate-400'>
            <span>Less</span>
            <div className='flex gap-1'>
              <div className={`w-3 h-3 rounded-sm ${levelColors.none}`} />
              <div className={`w-3 h-3 rounded-sm ${levelColors.low}`} />
              <div className={`w-3 h-3 rounded-sm ${levelColors.medium}`} />
              <div className={`w-3 h-3 rounded-sm ${levelColors.high}`} />
              <div className={`w-3 h-3 rounded-sm ${levelColors.max}`} />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

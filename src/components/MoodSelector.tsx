'use client';

import { MoodLevel, MOOD_OPTIONS } from '@/types/attendance';

interface Props {
  selected: MoodLevel | null;
  onChange: (mood: MoodLevel) => void;
  moodLabels: Record<MoodLevel, string>;
}

export default function MoodSelector({ selected, onChange, moodLabels }: Props) {
  return (
    <div className="flex gap-2 justify-center">
      {MOOD_OPTIONS.map(({ level, emoji }) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(level)}
          className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-16 cursor-pointer ${
            selected === level
              ? 'border-indigo-500 bg-indigo-50 scale-110 shadow-md'
              : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
          }`}
        >
          <span className="text-3xl">{emoji}</span>
          <span className="text-xs mt-1 text-gray-600 font-medium">{moodLabels[level]}</span>
        </button>
      ))}
    </div>
  );
}

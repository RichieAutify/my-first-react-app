export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodOption {
  level: MoodLevel;
  emoji: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { level: 5, emoji: '😄' },
  { level: 4, emoji: '😊' },
  { level: 3, emoji: '😐' },
  { level: 2, emoji: '😔' },
  { level: 1, emoji: '😞' },
];

// 退勤時の「頑張り度」用絵文字
export const EFFORT_OPTIONS: MoodOption[] = [
  { level: 5, emoji: '🔥' },
  { level: 4, emoji: '💪' },
  { level: 3, emoji: '😊' },
  { level: 2, emoji: '😓' },
  { level: 1, emoji: '😴' },
];

export interface ClockEntry {
  time: string; // ISO string
  mood: MoodLevel;
  message: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  isPaidLeave?: boolean;
  clockIn?: ClockEntry;
  clockOut?: ClockEntry;
}

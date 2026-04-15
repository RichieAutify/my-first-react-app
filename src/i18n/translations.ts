import { MoodLevel } from '@/types/attendance';

export type Lang = 'ja' | 'en';

interface Translations {
  appName: string;
  toggleLang: string;
  clockIn: {
    title: string;
    moodQuestion: string;
    messageLabel: string;
    messagePlaceholder: string;
    button: string;
  };
  clockOut: {
    title: string;
    moodQuestion: string;
    messageLabel: string;
    messagePlaceholder: string;
    button: string;
  };
  status: {
    clockedIn: string;
    todayRecord: string;
    pastRecords: string;
    completed: string;
    missingClockOut: string;
    clockInLabel: string;
    clockOutLabel: string;
  };
  moods: Record<MoodLevel, string>;
}

export const translations: Record<Lang, Translations> = {
  ja: {
    appName: '勤怠打刻',
    toggleLang: 'EN',
    clockIn: {
      title: '出勤打刻',
      moodQuestion: '今日の調子は？',
      messageLabel: '今日の意気込みを一言',
      messagePlaceholder: '今日も頑張ります！',
      button: '出勤打刻する',
    },
    clockOut: {
      title: '退勤打刻',
      moodQuestion: '今の調子は？',
      messageLabel: '今日を振り返って一言',
      messagePlaceholder: '今日もお疲れ様でした！',
      button: '退勤打刻する',
    },
    status: {
      clockedIn: '出勤済み',
      todayRecord: '今日の記録',
      pastRecords: '過去の記録',
      completed: '完了',
      missingClockOut: '退勤未記録',
      clockInLabel: '出勤',
      clockOutLabel: '退勤',
    },
    moods: { 5: '絶好調', 4: '好調', 3: '普通', 2: '不調', 1: '絶不調' },
  },
  en: {
    appName: 'Attendance',
    toggleLang: '日本語',
    clockIn: {
      title: 'Clock In',
      moodQuestion: 'How are you feeling today?',
      messageLabel: 'Your motivation for today',
      messagePlaceholder: "Let's have a great day!",
      button: 'Clock In',
    },
    clockOut: {
      title: 'Clock Out',
      moodQuestion: 'How are you feeling now?',
      messageLabel: 'A word to wrap up your day',
      messagePlaceholder: 'Great work today!',
      button: 'Clock Out',
    },
    status: {
      clockedIn: 'Clocked In',
      todayRecord: "Today's Record",
      pastRecords: 'Past Records',
      completed: 'Done',
      missingClockOut: 'Clock-out Missing',
      clockInLabel: 'In',
      clockOutLabel: 'Out',
    },
    moods: { 5: 'Amazing', 4: 'Good', 3: 'Okay', 2: 'Not Great', 1: 'Rough' },
  },
};

'use client';

import { useState, useEffect } from 'react';
import { AttendanceRecord, MOOD_OPTIONS, EFFORT_OPTIONS, MoodLevel } from '@/types/attendance';
import { Lang, Translations } from '@/i18n/translations';
import MoodSelector from '@/components/MoodSelector';

interface Props {
  records: AttendanceRecord[];
  t: Translations;
  lang: Lang;
  onUpdateRecord: (record: AttendanceRecord) => void;
}

function getEmoji(level: MoodLevel, options: typeof MOOD_OPTIONS): string {
  return options.find((o) => o.level === level)!.emoji;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDate(dateStr: string, lang: Lang): string {
  const [y, m, d] = dateStr.split('-');
  if (lang === 'ja') return `${y}年${m}月${d}日`;
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function CalendarView({ records, t, lang, onUpdateRecord }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [retroTime, setRetroTime] = useState('');
  const [retroMood, setRetroMood] = useState<MoodLevel | null>(null);
  const [retroMessage, setRetroMessage] = useState('');

  useEffect(() => {
    setRetroTime('');
    setRetroMood(null);
    setRetroMessage('');
  }, [selectedDate]);

  const recordMap = new Map<string, AttendanceRecord>();
  records.forEach((r) => recordMap.set(r.date, r));

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  function closeModal() {
    setSelectedDate(null);
  }

  function handleRetroClockOut() {
    if (!selectedDate || !selectedRecord || !retroTime || !retroMood || !retroMessage.trim()) return;
    const updated: AttendanceRecord = {
      ...selectedRecord,
      clockOut: {
        time: new Date(`${selectedDate}T${retroTime}:00`).toISOString(),
        mood: retroMood,
        message: retroMessage.trim(),
      },
    };
    onUpdateRecord(updated);
    closeModal();
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  }

  const monthTitle = lang === 'ja'
    ? `${viewYear}年${viewMonth + 1}月`
    : new Date(viewYear, viewMonth).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectedRecord = selectedDate ? recordMap.get(selectedDate) : null;

  // 表示月の勤務時間を集計
  const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
  const monthRecords = records.filter((r) => r.date.startsWith(monthPrefix) && r.clockOut);
  const totalMinutes = monthRecords.reduce((sum, r) => {
    const diff = new Date(r.clockOut!.time).getTime() - new Date(r.clockIn.time).getTime();
    return sum + Math.floor(diff / 60000);
  }, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;
  const daysWorked = monthRecords.length;
  const avgMinutes = daysWorked > 0 ? Math.floor(totalMinutes / daysWorked) : 0;
  const avgHours = Math.floor(avgMinutes / 60);
  const avgMins = avgMinutes % 60;

  const totalLabel = lang === 'ja'
    ? `${totalHours}時間${totalMins}分`
    : `${totalHours}h ${totalMins}m`;
  const avgLabel = lang === 'ja'
    ? `${avgHours}時間${avgMins}分`
    : `${avgHours}h ${avgMins}m`;
  const daysLabel = lang === 'ja' ? `${daysWorked}日` : `${daysWorked} days`;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-4">
        {/* 月ナビゲーション */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 text-lg transition-colors"
          >
            ‹
          </button>
          <h2 className="font-bold text-gray-800">{monthTitle}</h2>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 text-lg transition-colors"
          >
            ›
          </button>
        </div>

        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 mb-1">
          {t.calendar.weekdays.map((day, i) => (
            <div
              key={day}
              className={`text-center text-xs font-semibold py-1 ${
                i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 月次集計 */}
        {daysWorked > 0 && (
          <div className="mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3">
            <div className="grid grid-cols-3 divide-x divide-indigo-100">
              <div className="text-center px-2">
                <p className="text-[10px] text-indigo-400 font-semibold mb-0.5">
                  {lang === 'ja' ? '総勤務時間' : 'Total'}
                </p>
                <p className="text-sm font-bold text-indigo-700">{totalLabel}</p>
              </div>
              <div className="text-center px-2">
                <p className="text-[10px] text-purple-400 font-semibold mb-0.5">
                  {lang === 'ja' ? '出勤日数' : 'Days'}
                </p>
                <p className="text-sm font-bold text-purple-700">{daysLabel}</p>
              </div>
              <div className="text-center px-2">
                <p className="text-[10px] text-indigo-400 font-semibold mb-0.5">
                  {lang === 'ja' ? '1日平均' : 'Avg/Day'}
                </p>
                <p className="text-sm font-bold text-indigo-700">{avgLabel}</p>
              </div>
            </div>
          </div>
        )}

        {/* カレンダーグリッド */}
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;

            const dateStr = toDateStr(viewYear, viewMonth, day);
            const record = recordMap.get(dateStr);
            const isToday = dateStr === todayStr;
            const dayOfWeek = (firstDayOfWeek + day - 1) % 7;

            return (
              <div
                key={dateStr}
                onClick={() => record && setSelectedDate(dateStr)}
                className={`rounded-lg p-1 min-h-14 flex flex-col ${
                  isToday
                    ? 'bg-indigo-50 ring-2 ring-indigo-400'
                    : record
                    ? 'bg-gray-50'
                    : ''
                } ${record ? 'cursor-pointer hover:bg-indigo-50 transition-colors' : ''}`}
              >
                {/* 日付番号 */}
                <span
                  className={`text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full mb-0.5 ${
                    isToday
                      ? 'bg-indigo-600 text-white'
                      : dayOfWeek === 0
                      ? 'text-red-400'
                      : dayOfWeek === 6
                      ? 'text-blue-400'
                      : 'text-gray-600'
                  }`}
                >
                  {day}
                </span>

                {/* 打刻情報 */}
                {record && (
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-0.5">
                      <span className="text-xs leading-none">
                        {getEmoji(record.clockIn.mood, MOOD_OPTIONS)}
                      </span>
                      <span className="text-[10px] text-indigo-500 leading-none font-medium">
                        {formatTime(record.clockIn.time)}
                      </span>
                    </div>
                    {record.clockOut && (
                      <div className="flex items-center gap-0.5">
                        <span className="text-xs leading-none">
                          {getEmoji(record.clockOut.mood, EFFORT_OPTIONS)}
                        </span>
                        <span className="text-[10px] text-purple-500 leading-none font-medium">
                          {formatTime(record.clockOut.time)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 日付詳細モーダル */}
      {selectedDate && selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-6 sm:pb-0"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">{formatDate(selectedDate, lang)}</h3>
              <button
                onClick={closeModal}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {/* 出勤 */}
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-xs text-indigo-600 font-semibold mb-2">
                  🌅 {t.status.clockInLabel}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getEmoji(selectedRecord.clockIn.mood, MOOD_OPTIONS)}</span>
                  <div>
                    <p className="font-bold text-gray-800">{formatTime(selectedRecord.clockIn.time)}</p>
                    <p className="text-xs text-gray-500">{t.moods[selectedRecord.clockIn.mood]}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">&ldquo;{selectedRecord.clockIn.message}&rdquo;</p>
              </div>

              {/* 退勤 */}
              {selectedRecord.clockOut ? (
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-xs text-purple-600 font-semibold mb-2">
                    🌙 {t.status.clockOutLabel}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getEmoji(selectedRecord.clockOut.mood, EFFORT_OPTIONS)}</span>
                    <div>
                      <p className="font-bold text-gray-800">{formatTime(selectedRecord.clockOut.time)}</p>
                      <p className="text-xs text-gray-500">{t.efforts[selectedRecord.clockOut.mood]}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">&ldquo;{selectedRecord.clockOut.message}&rdquo;</p>
                </div>
              ) : (
                <div className="bg-purple-50 rounded-xl p-4 space-y-3">
                  <p className="text-xs text-purple-600 font-semibold">
                    🌙 {t.status.retroClockOut}
                  </p>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t.status.retroClockOutTime}</p>
                    <input
                      type="time"
                      value={retroTime}
                      onChange={(e) => setRetroTime(e.target.value)}
                      className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">{t.clockOut.moodQuestion}</p>
                    <MoodSelector
                      selected={retroMood}
                      onChange={setRetroMood}
                      options={EFFORT_OPTIONS}
                      labels={t.efforts}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t.clockOut.messageLabel}</p>
                    <textarea
                      value={retroMessage}
                      onChange={(e) => setRetroMessage(e.target.value)}
                      placeholder={t.clockOut.messagePlaceholder}
                      rows={2}
                      className="w-full border border-purple-200 rounded-xl p-2 text-sm resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  <button
                    onClick={handleRetroClockOut}
                    disabled={!retroTime || !retroMood || !retroMessage.trim()}
                    className="w-full bg-purple-600 text-white py-2 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                  >
                    {t.status.retroClockOutSave}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

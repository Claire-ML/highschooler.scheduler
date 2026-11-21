import { ArrowRightLeft, Check, Plus, Sparkles, X } from 'lucide-react';
import {
  COLOR_STYLES,
  SubjectRecommendation,
  TimeSlotCoord,
} from '../data/curriculum';

interface SubjectDetailSheetProps {
  subject: SubjectRecommendation | null;
  isEnabled: boolean;
  slots: TimeSlotCoord[];
  onClose: () => void;
  onToggleSubject: (subjectId: string) => void;
  onStartMoveSlot: (subject: SubjectRecommendation, from: TimeSlotCoord) => void;
}

export function SubjectDetailSheet({
  subject,
  isEnabled,
  slots,
  onClose,
  onToggleSubject,
  onStartMoveSlot,
}: SubjectDetailSheetProps) {
  if (!subject) return null;

  const color = COLOR_STYLES[subject.colorKey];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 backdrop-blur-[2px] md:items-center md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-sheet-title"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white pb-safe shadow-xl md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="pt-3 md:hidden">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-300" />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs font-medium text-slate-500">
                <span className={color.badgeText}>{subject.category}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{subject.credits}학점</span>
                <span aria-hidden="true">·</span>
                <span>{subject.evaluation}</span>
                <span aria-hidden="true">·</span>
                <span>{subject.room}</span>
              </div>
              <h3
                id="detail-sheet-title"
                className="mt-1 text-xl font-bold tracking-tight text-slate-900"
              >
                {subject.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {subject.summary}
          </p>

          {/* Curriculum Topics */}
          <div className="mt-5 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold tracking-tight text-slate-900">
              이 과목에서 다루는 주요 내용
            </h4>
            <ul className="mt-2.5 space-y-2">
              {subject.topics.map((topic, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-sm leading-snug text-slate-700"
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${color.dot}`}
                    aria-hidden="true"
                  />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              <span className="font-semibold text-slate-700">이수 위계 · 참고: </span>
              {subject.prerequisiteTip}
            </p>
          </div>

          {/* Activity Tip */}
          <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
              탐구 활동 · 세특 연결 팁
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {subject.activityTip}
            </p>
          </div>

          {/* Official Credit Completion Rule & Missing-Subject Alternatives */}
          <div className="mt-3 rounded-xl border border-slate-200/80 bg-white p-3.5 text-xs leading-relaxed text-slate-600">
            <div>
              <span className="font-semibold text-slate-800">학점 이수 기준: </span>
              {subject.category === '교양'
                ? '과목 출석률 2/3 이상 충족 시 이수(P)로 인정돼요. (1학점 = 50분 기준 16회)'
                : '과목 출석률 2/3 이상 + 학업 성취율 40% 이상 충족 시 학점을 취득해요. (미달 시 최소 성취수준 보장지도 연계)'}
            </div>
            <div className="mt-1.5">
              <span className="font-semibold text-slate-800">학교 미개설 시 대안: </span>
              공동교육과정(거점·연합)이나 온라인학교를 통해 수강할 수 있어요.
            </div>
          </div>

          {/* Timetable Slot Adjustment */}
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold tracking-tight text-slate-900">
                현재 시간표 배치 ({slots.length}시간)
              </h4>
              <span className="text-[11px] text-slate-500">
                눌러서 공강 시간으로 이동
              </span>
            </div>

            {isEnabled ? (
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                {slots.map((slot) => (
                  <button
                    key={`${slot.day}-${slot.period}`}
                    type="button"
                    onClick={() => onStartMoveSlot(subject, slot)}
                    className="flex min-h-[44px] items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50/60"
                  >
                    <span className="font-mono-num">
                      {slot.day}요일 {slot.period}교시
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600">
                      <ArrowRightLeft className="h-3 w-3" aria-hidden="true" />
                      이동
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                현재 시간표에서 제외된 과목입니다. 아래 버튼을 눌러 다시
                추가할 수 있어요.
              </p>
            )}
          </div>

          {/* Primary Footer Actions */}
          <div className="mt-6 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onToggleSubject(subject.id)}
              className={`flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors ${
                isEnabled
                  ? 'border border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200/70'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEnabled ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  시간표에서 빼기
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  시간표에 다시 추가하기
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex min-h-[48px] items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

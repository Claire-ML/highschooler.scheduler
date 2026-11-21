import { ArrowRightLeft, Info, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import {
  COLOR_STYLES,
  COMMON_TIMETABLE_SLOTS,
  DAYS,
  DayOfWeek,
  FREE_PERIOD_ACTIVITIES,
  PERIODS,
  SubjectRecommendation,
  TimeSlotCoord,
} from '../data/curriculum';

export interface MovingSlotState {
  subjectId: string;
  subjectName: string;
  from: TimeSlotCoord;
}

interface WeeklyTimetableProps {
  fieldLabel: string;
  subjects: SubjectRecommendation[];
  enabledSubjectIds: string[];
  subjectSlotsMap: Record<string, TimeSlotCoord[]>;
  movingSlot: MovingSlotState | null;
  hasCustomMoves: boolean;
  onSelectElective: (subject: SubjectRecommendation) => void;
  onMoveToEmptySlot: (target: TimeSlotCoord) => void;
  onCancelMove: () => void;
  onResetTimetable: () => void;
}

export function WeeklyTimetable({
  fieldLabel,
  subjects,
  enabledSubjectIds,
  subjectSlotsMap,
  movingSlot,
  hasCustomMoves,
  onSelectElective,
  onMoveToEmptySlot,
  onCancelMove,
  onResetTimetable,
}: WeeklyTimetableProps) {
  const [showFreeGuide, setShowFreeGuide] = useState(false);

  const activeSubjects = subjects.filter((s) =>
    enabledSubjectIds.includes(s.id)
  );

  // Based on the 2024 High School Credit System Guide:
  // 34 regular weekly periods (Mon-Thu 1~7, Fri 1~6).
  // Common subjects (19) + Creative Experiential Activities (3) + Electives.
  const electiveCredits = activeSubjects.reduce(
    (sum, s) => sum + (subjectSlotsMap[s.id]?.length ?? s.defaultSlots.length),
    0
  );
  const commonSubjectCredits = COMMON_TIMETABLE_SLOTS.filter(
    (c) => !c.isCreative
  ).length;
  const creativeCredits = COMMON_TIMETABLE_SLOTS.filter(
    (c) => c.isCreative
  ).length;
  const subjectTotalCredits = commonSubjectCredits + electiveCredits;
  const totalCredits = subjectTotalCredits + creativeCredits;
  const freePeriods = Math.max(0, 34 - totalCredits);

  const findCellContent = (day: DayOfWeek, period: number) => {
    // Friday period 7 is non-regular / off-schedule in the 34-period model
    if (day === '금' && period === 7) {
      return { type: 'off' as const };
    }

    const common = COMMON_TIMETABLE_SLOTS.find(
      (c) => c.day === day && c.period === period
    );
    if (common) {
      return { type: 'common' as const, data: common };
    }

    for (const subject of activeSubjects) {
      const slots = subjectSlotsMap[subject.id] ?? subject.defaultSlots;
      const match = slots.find((s) => s.day === day && s.period === period);
      if (match) {
        return { type: 'elective' as const, subject };
      }
    }

    return { type: 'free' as const };
  };

  return (
    <section
      aria-labelledby="timetable-heading"
      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-medium text-slate-500">
            <span>{fieldLabel} 기준</span>
            <span aria-hidden="true">·</span>
            <span>주 34시간 편성 (졸업 192학점 기준)</span>
          </div>
          <h2
            id="timetable-heading"
            className="mt-0.5 text-lg font-bold tracking-tight text-slate-900"
          >
            내 고교학점제 주간 시간표
          </h2>
        </div>

        {hasCustomMoves && (
          <button
            type="button"
            onClick={onResetTimetable}
            className="inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 active:scale-[0.98]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            기본 배치로 초기화
          </button>
        )}
      </div>

      {/* Summary metrics with tabular numerals */}
      <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-200/80 bg-slate-50/70 py-2.5 text-center">
        <div className="px-2">
          <div className="text-[11px] font-medium text-slate-500">
            주간 이수 학점
          </div>
          <div className="mt-0.5 text-base font-bold text-slate-900 tabular-nums">
            {totalCredits}학점
          </div>
          <div className="text-[10px] text-slate-400 tabular-nums">
            교과 {subjectTotalCredits} + 창체 {creativeCredits}
          </div>
        </div>
        <div className="px-2">
          <div className="text-[11px] font-medium text-slate-500">
            추천 선택과목
          </div>
          <div className="mt-0.5 text-base font-bold text-blue-700 tabular-nums">
            {electiveCredits}학점
          </div>
          <div className="text-[10px] text-slate-400 tabular-nums">
            {activeSubjects.length}과목 반영
          </div>
        </div>
        <div className="px-2">
          <div className="text-[11px] font-medium text-slate-500">
            공강 시간
          </div>
          <div className="mt-0.5 text-base font-bold text-slate-700 tabular-nums">
            {freePeriods}시간
          </div>
          <div className="text-[10px] text-slate-400">자기주도 · 탐구</div>
        </div>
      </div>

      {/* Legend for the 3 recommended electives + common/creative */}
      <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        {subjects.map((subject) => {
          const isEnabled = enabledSubjectIds.includes(subject.id);
          const color = COLOR_STYLES[subject.colorKey];
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => onSelectElective(subject)}
              className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-1.5 font-medium transition-opacity hover:bg-slate-100 ${
                isEnabled ? 'text-slate-800' : 'text-slate-400 line-through'
              }`}
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-sm ${color.dot}`}
                aria-hidden="true"
              />
              <span className="whitespace-nowrap">{subject.name}</span>
            </button>
          );
        })}
        <span className="inline-flex items-center gap-1.5 text-slate-500">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-sm border border-slate-300 bg-slate-50"
            aria-hidden="true"
          />
          공통교과
        </span>
        <span className="inline-flex items-center gap-1.5 text-slate-500">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-sm border border-slate-300 bg-slate-200/80"
            aria-hidden="true"
          />
          창체(금4~6)
        </span>
      </div>

      {/* Move Slot Active Guidance Banner */}
      {movingSlot && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-xs text-blue-950">
          <div className="flex items-center gap-2">
            <ArrowRightLeft
              className="h-4 w-4 shrink-0 text-blue-600"
              aria-hidden="true"
            />
            <span>
              <strong>{movingSlot.subjectName}</strong> ({movingSlot.from.day}{' '}
              {movingSlot.from.period}교시)을 옮길 <strong>공강</strong> 칸을
              눌러주세요.
            </span>
          </div>
          <button
            type="button"
            onClick={onCancelMove}
            aria-label="이동 취소"
            className="inline-flex min-h-[36px] min-w-[36px] shrink-0 items-center justify-center rounded-lg text-blue-700 hover:bg-blue-100"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Weekly Timetable Grid */}
      <div className="mt-3.5 overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-[44px_repeat(5,minmax(0,1fr))] border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold text-slate-600">
          <div className="py-2.5 text-[11px] text-slate-400">교시</div>
          {DAYS.map((day) => (
            <div
              key={day}
              className="border-l border-slate-200/80 py-2.5 text-slate-800"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="divide-y divide-slate-200/80">
          {PERIODS.map(({ period, time }) => (
            <div key={period}>
              {/* Lunch Break Row between Period 4 and 5 */}
              {period === 5 && (
                <div className="grid grid-cols-[44px_1fr] border-b border-slate-200/80 bg-slate-50/80">
                  <div className="flex items-center justify-center py-1.5 text-[10px] font-medium text-slate-400">
                    점심
                  </div>
                  <div className="flex items-center justify-center border-l border-slate-200/80 py-1.5 text-[11px] font-medium text-slate-500">
                    점심시간 · 12:20 – 13:20
                  </div>
                </div>
              )}

              <div className="grid grid-cols-[44px_repeat(5,minmax(0,1fr))]">
                {/* Period / Time Axis */}
                <div className="flex flex-col items-center justify-center bg-slate-50/40 px-1 py-2 text-center">
                  <span className="font-mono-num text-xs font-bold text-slate-700">
                    {period}
                  </span>
                  <span className="font-mono-num mt-0.5 text-[9px] text-slate-400">
                    {time}
                  </span>
                </div>

                {/* Day Cells */}
                {DAYS.map((day) => {
                  const cell = findCellContent(day, period);

                  if (cell.type === 'off') {
                    return (
                      <div
                        key={day}
                        className="flex min-h-[54px] flex-col items-center justify-center border-l border-slate-200/70 bg-slate-100/55 px-1 py-1.5 text-center"
                      >
                        <span className="text-[10px] font-medium text-slate-400">
                          하교
                        </span>
                      </div>
                    );
                  }

                  if (cell.type === 'common') {
                    return (
                      <div
                        key={day}
                        className={`flex min-h-[54px] flex-col items-center justify-center border-l border-slate-200/70 px-1 py-1.5 text-center ${
                          cell.data.isCreative
                            ? 'bg-slate-100/90'
                            : 'bg-slate-50/60'
                        }`}
                      >
                        <span
                          className={`line-clamp-2 text-[11px] leading-tight ${
                            cell.data.isCreative
                              ? 'font-semibold text-slate-600'
                              : 'font-medium text-slate-500'
                          }`}
                        >
                          {cell.data.shortName}
                        </span>
                      </div>
                    );
                  }

                  if (cell.type === 'elective') {
                    const color = COLOR_STYLES[cell.subject.colorKey];
                    const isMovingSource =
                      movingSlot &&
                      movingSlot.subjectId === cell.subject.id &&
                      movingSlot.from.day === day &&
                      movingSlot.from.period === period;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => onSelectElective(cell.subject)}
                        className={`flex min-h-[54px] w-full flex-col items-center justify-center border-l border-slate-200/70 p-1 text-center transition-all duration-150 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-600 active:scale-[0.97] ${
                          isMovingSource
                            ? 'bg-blue-600 text-white'
                            : `${color.bg} hover:brightness-95`
                        }`}
                      >
                        <span
                          className={`line-clamp-2 text-[11px] font-bold leading-tight ${
                            isMovingSource ? 'text-white' : color.text
                          }`}
                        >
                          {cell.subject.name}
                        </span>
                        <span
                          className={`mt-0.5 hidden text-[9px] font-medium sm:block ${
                            isMovingSource ? 'text-blue-100' : color.subtext
                          }`}
                        >
                          {cell.subject.room}
                        </span>
                      </button>
                    );
                  }

                  // Free / 공강 cell
                  if (movingSlot) {
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => onMoveToEmptySlot({ day, period })}
                        className="flex min-h-[54px] w-full flex-col items-center justify-center border-l border-slate-200/70 bg-blue-50/70 p-1 text-center ring-1 ring-inset ring-blue-300 ring-dashed transition-colors hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-600"
                      >
                        <span className="text-[10px] font-bold text-blue-700">
                          여기로
                        </span>
                        <span className="text-[9px] text-blue-600">이동</span>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setShowFreeGuide((prev) => !prev)}
                      aria-expanded={showFreeGuide}
                      className="flex min-h-[54px] w-full flex-col items-center justify-center border-l border-slate-200/70 bg-white px-1 py-1.5 text-center transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-600"
                    >
                      <span className="text-[10px] font-medium text-slate-400">
                        공강
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inline Free-Period Guide toggled by clicking 공강 */}
      {showFreeGuide && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Info className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
              공강 시간은 이렇게 활용할 수 있어요
            </div>
            <button
              type="button"
              onClick={() => setShowFreeGuide(false)}
              aria-label="공강 안내 닫기"
              className="inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {FREE_PERIOD_ACTIVITIES.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-slate-200/70 bg-white p-2.5"
              >
                <div className="text-xs font-semibold text-slate-800">
                  {item.title}
                </div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-2.5 text-xs text-slate-500">
        선택과목 칸을 누르면 세부 내용과 시간 이동을, <strong>공강</strong> 칸을
        누르면 공강 활용 방법을 확인할 수 있어요.
      </p>
    </section>
  );
}

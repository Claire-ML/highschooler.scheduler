import { BookOpen, Check, ChevronRight, Plus } from 'lucide-react';
import {
  COLOR_STYLES,
  InterestField,
  SubjectRecommendation,
  TimeSlotCoord,
} from '../data/curriculum';

interface SubjectRecommendationsProps {
  field: InterestField;
  enabledSubjectIds: string[];
  subjectSlotsMap: Record<string, TimeSlotCoord[]>;
  onToggleSubject: (subjectId: string) => void;
  onInspectSubject: (subject: SubjectRecommendation) => void;
  onJumpToTimetable?: () => void;
}

export function SubjectRecommendations({
  field,
  enabledSubjectIds,
  subjectSlotsMap,
  onToggleSubject,
  onInspectSubject,
  onJumpToTimetable,
}: SubjectRecommendationsProps) {
  return (
    <section aria-labelledby="recommend-heading" className="mt-7">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2
            id="recommend-heading"
            className="text-lg font-bold tracking-tight text-slate-900"
          >
            02. {field.label} 추천 과목 3가지
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            과목마다 어떤 내용을 배우는지 확인하고 시간표에 바로 반영해 보세요.
          </p>
        </div>
        {onJumpToTimetable && (
          <button
            type="button"
            onClick={onJumpToTimetable}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1 whitespace-nowrap rounded-xl px-2.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 lg:hidden"
          >
            시간표 보기
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {field.subjects.map((subject, idx) => {
          const isEnabled = enabledSubjectIds.includes(subject.id);
          const color = COLOR_STYLES[subject.colorKey];
          const slots = subjectSlotsMap[subject.id] ?? subject.defaultSlots;
          const slotSummary = slots.map((s) => `${s.day}${s.period}`).join(' · ');

          return (
            <article
              key={subject.id}
              className={`rounded-2xl border bg-white p-4 transition-colors duration-150 ${
                isEnabled ? 'border-slate-200' : 'border-slate-200/70 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs font-medium text-slate-500">
                    <span className="font-mono-num text-slate-400">
                      0{idx + 1}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className={color.badgeText}>{subject.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{subject.credits}학점</span>
                    <span aria-hidden="true">·</span>
                    <span>{subject.evaluation}</span>
                    <span aria-hidden="true">·</span>
                    <span>{subject.room}</span>
                  </div>
                  <h3 className="mt-1 text-base font-bold tracking-tight text-slate-900">
                    {subject.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {subject.summary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleSubject(subject.id)}
                  aria-pressed={isEnabled}
                  className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-[0.97] ${
                    isEnabled
                      ? `${color.bg} ${color.border} ${color.text}`
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isEnabled ? (
                    <>
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      시간표 반영됨
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      시간표 추가
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3.5 border-t border-slate-100 pt-3">
                <p className="text-xs font-semibold text-slate-700">
                  어떤 내용을 다루나요?
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {subject.topics.map((topic, tIdx) => (
                    <li
                      key={tIdx}
                      className="flex items-start gap-2 text-[13px] leading-snug text-slate-600"
                    >
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${color.dot}`}
                        aria-hidden="true"
                      />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
                  <span className="font-semibold text-slate-600">이수 참고: </span>
                  {subject.prerequisiteTip}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
                <span className="font-mono-num text-xs text-slate-500">
                  {isEnabled ? `배치 교시: ${slotSummary}` : '시간표에서 제외됨'}
                </span>
                <button
                  type="button"
                  onClick={() => onInspectSubject(subject)}
                  className="inline-flex min-h-[44px] items-center gap-1 whitespace-nowrap rounded-xl px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  탐구 팁 · 시간 조정
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

import {
  BookMarked,
  CalendarDays,
  Compass,
  Printer,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CareerCounselingCard } from './components/CareerCounselingCard';
import { InterestSelector } from './components/InterestSelector';
import { SubjectDetailSheet } from './components/SubjectDetailSheet';
import { SubjectRecommendations } from './components/SubjectRecommendations';
import {
  MovingSlotState,
  WeeklyTimetable,
} from './components/WeeklyTimetable';
import {
  COMMON_TIMETABLE_SLOTS,
  DAYS,
  INTEREST_FIELDS,
  SubjectRecommendation,
  TimeSlotCoord,
} from './data/curriculum';

type MobileTab = 'explore' | 'timetable' | 'counseling';

const STORAGE_KEY = 'hakjeom_planner_state_v2';

interface PersistedState {
  selectedFieldId: string;
  enabledSubjectIds: string[];
  subjectSlotsMap: Record<string, TimeSlotCoord[]>;
}

function getDefaultFieldState(fieldId: string): PersistedState {
  const field =
    INTEREST_FIELDS.find((f) => f.id === fieldId) ?? INTEREST_FIELDS[0];
  const subjectSlotsMap: Record<string, TimeSlotCoord[]> = {};
  for (const subj of field.subjects) {
    subjectSlotsMap[subj.id] = subj.defaultSlots.map((s) => ({ ...s }));
  }
  return {
    selectedFieldId: field.id,
    enabledSubjectIds: field.subjects.map((s) => s.id),
    subjectSlotsMap,
  };
}

function loadInitialState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultFieldState(INTEREST_FIELDS[0].id);
    const parsed = JSON.parse(raw) as PersistedState;
    const validField = INTEREST_FIELDS.find(
      (f) => f.id === parsed.selectedFieldId
    );
    if (!validField) return getDefaultFieldState(INTEREST_FIELDS[0].id);

    const validIds = new Set(validField.subjects.map((s) => s.id));
    if (
      !Array.isArray(parsed.enabledSubjectIds) ||
      !parsed.enabledSubjectIds.every((id) => validIds.has(id))
    ) {
      return getDefaultFieldState(validField.id);
    }

    const commonKeys = new Set(
      COMMON_TIMETABLE_SLOTS.map((c) => `${c.day}-${c.period}`)
    );
    const validDays = new Set<string>(DAYS);
    for (const subj of validField.subjects) {
      const slots = parsed.subjectSlotsMap?.[subj.id];
      if (!Array.isArray(slots) || slots.length !== subj.defaultSlots.length) {
        return getDefaultFieldState(validField.id);
      }
      for (const slot of slots) {
        if (
          !validDays.has(slot.day) ||
          slot.period < 1 ||
          slot.period > 7 ||
          (slot.day === '금' && slot.period === 7) ||
          commonKeys.has(`${slot.day}-${slot.period}`)
        ) {
          return getDefaultFieldState(validField.id);
        }
      }
    }

    return parsed;
  } catch {
    return getDefaultFieldState(INTEREST_FIELDS[0].id);
  }
}

export default function App() {
  const [initialState] = useState<PersistedState>(() => loadInitialState());
  const [selectedFieldId, setSelectedFieldId] = useState<string>(
    initialState.selectedFieldId
  );
  const [enabledSubjectIds, setEnabledSubjectIds] = useState<string[]>(
    initialState.enabledSubjectIds
  );
  const [subjectSlotsMap, setSubjectSlotsMap] = useState<
    Record<string, TimeSlotCoord[]>
  >(initialState.subjectSlotsMap);

  const [mobileTab, setMobileTab] = useState<MobileTab>('explore');
  const [inspectedSubjectId, setInspectedSubjectId] = useState<string | null>(
    null
  );
  const [movingSlot, setMovingSlot] = useState<MovingSlotState | null>(null);

  const currentField = useMemo(
    () =>
      INTEREST_FIELDS.find((f) => f.id === selectedFieldId) ??
      INTEREST_FIELDS[0],
    [selectedFieldId]
  );

  const inspectedSubject = useMemo(
    () =>
      currentField.subjects.find((s) => s.id === inspectedSubjectId) ?? null,
    [currentField, inspectedSubjectId]
  );

  const hasCustomMoves = useMemo(() => {
    for (const subj of currentField.subjects) {
      const current = subjectSlotsMap[subj.id];
      if (!current) continue;
      if (current.length !== subj.defaultSlots.length) return true;
      for (let i = 0; i < current.length; i++) {
        if (
          current[i].day !== subj.defaultSlots[i].day ||
          current[i].period !== subj.defaultSlots[i].period
        ) {
          return true;
        }
      }
    }
    return enabledSubjectIds.length !== currentField.subjects.length;
  }, [currentField, subjectSlotsMap, enabledSubjectIds]);

  useEffect(() => {
    try {
      const payload: PersistedState = {
        selectedFieldId,
        enabledSubjectIds,
        subjectSlotsMap,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota or private mode errors
    }
  }, [selectedFieldId, enabledSubjectIds, subjectSlotsMap]);

  const handleSelectField = (fieldId: string) => {
    if (fieldId === selectedFieldId) return;
    const next = getDefaultFieldState(fieldId);
    setSelectedFieldId(next.selectedFieldId);
    setEnabledSubjectIds(next.enabledSubjectIds);
    setSubjectSlotsMap(next.subjectSlotsMap);
    setMovingSlot(null);
    setInspectedSubjectId(null);
  };

  const handleToggleSubject = (subjectId: string) => {
    const isCurrentlyEnabled = enabledSubjectIds.includes(subjectId);

    if (isCurrentlyEnabled) {
      setEnabledSubjectIds((prev) => prev.filter((id) => id !== subjectId));
      if (movingSlot?.subjectId === subjectId) {
        setMovingSlot(null);
      }
      return;
    }

    // Re-enabling: ensure none of its slots collide with other active subjects
    const occupiedKeys = new Set<string>();
    for (const activeId of enabledSubjectIds) {
      for (const s of subjectSlotsMap[activeId] ?? []) {
        occupiedKeys.add(`${s.day}-${s.period}`);
      }
    }

    const currentSlots = subjectSlotsMap[subjectId] ?? [];
    const hasCollision = currentSlots.some((s) =>
      occupiedKeys.has(`${s.day}-${s.period}`)
    );

    if (hasCollision) {
      const commonKeys = new Set(
        COMMON_TIMETABLE_SLOTS.map((c) => `${c.day}-${c.period}`)
      );
      const freePool: TimeSlotCoord[] = [];
      for (const d of DAYS) {
        for (let p = 1; p <= 7; p++) {
          if (d === '금' && p === 7) continue;
          const key = `${d}-${p}`;
          if (!commonKeys.has(key) && !occupiedKeys.has(key)) {
            freePool.push({ day: d, period: p });
          }
        }
      }

      const resolvedSlots = currentSlots.map((slot) => {
        const key = `${slot.day}-${slot.period}`;
        if (!occupiedKeys.has(key)) {
          occupiedKeys.add(key);
          return slot;
        }
        const replacement = freePool.find(
          (candidate) => !occupiedKeys.has(`${candidate.day}-${candidate.period}`)
        );
        if (replacement) {
          occupiedKeys.add(`${replacement.day}-${replacement.period}`);
          return replacement;
        }
        return slot;
      });

      setSubjectSlotsMap((prev) => ({
        ...prev,
        [subjectId]: resolvedSlots,
      }));
    }

    setEnabledSubjectIds((prev) => [...prev, subjectId]);
  };

  const handleStartMoveSlot = (
    subject: SubjectRecommendation,
    from: TimeSlotCoord
  ) => {
    setInspectedSubjectId(null);
    setMovingSlot({
      subjectId: subject.id,
      subjectName: subject.name,
      from,
    });
    setMobileTab('timetable');
  };

  const handleMoveToEmptySlot = (target: TimeSlotCoord) => {
    if (!movingSlot) return;
    setSubjectSlotsMap((prev) => {
      const existing = prev[movingSlot.subjectId] ?? [];
      const updated = existing.map((slot) =>
        slot.day === movingSlot.from.day &&
        slot.period === movingSlot.from.period
          ? target
          : slot
      );
      return {
        ...prev,
        [movingSlot.subjectId]: updated,
      };
    });
    setMovingSlot(null);
  };

  const handleResetTimetable = () => {
    const reset = getDefaultFieldState(currentField.id);
    setEnabledSubjectIds(reset.enabledSubjectIds);
    setSubjectSlotsMap(reset.subjectSlotsMap);
    setMovingSlot(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] pb-24 lg:pb-12">
      {/* Top Bar (3-zone contract on desktop, clean single-row on mobile) */}
      <header className="no-print border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:h-16">
          {/* Zone 1: Brand Title */}
          <a
            href="#top"
            className="whitespace-nowrap shrink-0 text-lg font-extrabold tracking-tight text-slate-900"
          >
            학점플래너
          </a>

          {/* Zone 2: Concise Nav Links (Desktop) */}
          <nav
            aria-label="주요 섹션 이동"
            className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex"
          >
            <a
              href="#interest-heading"
              className="whitespace-nowrap shrink-0 hover:text-slate-900"
            >
              관심 분야
            </a>
            <a
              href="#recommend-heading"
              className="whitespace-nowrap shrink-0 hover:text-slate-900"
            >
              추천 과목
            </a>
            <a
              href="#timetable-heading"
              className="whitespace-nowrap shrink-0 hover:text-slate-900"
            >
              주간 시간표
            </a>
            <a
              href="#counseling-heading"
              className="whitespace-nowrap shrink-0 hover:text-slate-900"
            >
              진로 상담 안내
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap shrink-0 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 active:scale-[0.98]"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              시간표 저장 · 인쇄
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="top" className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:pt-8">
        {/* Intro Header */}
        <div className="no-print mb-6 max-w-2xl">
          <p className="text-xs font-semibold text-blue-600">
            2022 개정 교육과정 · 주 34시간 기준 고교학점제 시간표 도우미
          </p>
          <h1
            className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
            style={{ textWrap: 'balance' }}
          >
            관심 분야에 맞는 선택과목 3가지로 내 시간표를 미리 짜보세요
          </h1>
        </div>

        {/* Desktop 2-Column Layout / Mobile Tabbed Views */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Interest Selection + 3 Recommended Subjects */}
          <div
            className={`lg:col-span-5 ${
              mobileTab === 'explore' ? 'block' : 'hidden lg:block'
            }`}
          >
            <InterestSelector
              fields={INTEREST_FIELDS}
              selectedFieldId={currentField.id}
              onSelectField={handleSelectField}
            />

            <SubjectRecommendations
              field={currentField}
              enabledSubjectIds={enabledSubjectIds}
              subjectSlotsMap={subjectSlotsMap}
              onToggleSubject={handleToggleSubject}
              onInspectSubject={(subject) => setInspectedSubjectId(subject.id)}
              onJumpToTimetable={() => setMobileTab('timetable')}
            />

            {/* Mobile inline CTA to jump straight to timetable */}
            <div className="mt-5 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileTab('timetable')}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.98]"
              >
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                추천 과목이 담긴 주간 시간표 보기
              </button>
            </div>

            {/* Mobile counseling reminder on explore tab too */}
            <div className="mt-6 lg:hidden">
              <CareerCounselingCard />
            </div>
          </div>

          {/* Right Column: Weekly Timetable Visualization + Career Counseling */}
          <div
            className={`space-y-6 lg:col-span-7 ${
              mobileTab === 'timetable' ? 'block' : 'hidden lg:block'
            }`}
          >
            <WeeklyTimetable
              fieldLabel={currentField.label}
              subjects={currentField.subjects}
              enabledSubjectIds={enabledSubjectIds}
              subjectSlotsMap={subjectSlotsMap}
              movingSlot={movingSlot}
              hasCustomMoves={hasCustomMoves}
              onSelectElective={(subject) => setInspectedSubjectId(subject.id)}
              onMoveToEmptySlot={handleMoveToEmptySlot}
              onCancelMove={() => setMovingSlot(null)}
              onResetTimetable={handleResetTimetable}
            />

            <CareerCounselingCard />
          </div>

          {/* Mobile-only Dedicated Counseling & Summary Tab */}
          <div
            className={`space-y-4 lg:hidden ${
              mobileTab === 'counseling' ? 'block' : 'hidden'
            }`}
          >
            <CareerCounselingCard />

            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-bold text-slate-900">
                선생님께 보여드릴 현재 선택 요약
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                관심 분야: {currentField.label}
              </p>
              <ul className="mt-3 divide-y divide-slate-100">
                {currentField.subjects.map((subject) => {
                  const active = enabledSubjectIds.includes(subject.id);
                  const slots =
                    subjectSlotsMap[subject.id] ?? subject.defaultSlots;
                  return (
                    <li
                      key={subject.id}
                      className="flex items-center justify-between gap-2 py-2.5 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">
                          {subject.name}
                        </span>
                        <span className="ml-2 text-slate-500">
                          {subject.category} · {subject.credits}학점 ·{' '}
                          {subject.evaluation}
                        </span>
                      </div>
                      <span
                        className={`font-mono-num ${
                          active
                            ? 'font-semibold text-blue-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {active
                          ? slots.map((s) => `${s.day}${s.period}`).join(' ')
                          : '미선택'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Tab Bar (Thumb Zone, compact <= 60px) */}
      <nav
        aria-label="하단 메뉴"
        className="no-print fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md pb-safe lg:hidden"
      >
        <div className="mx-auto grid h-15 max-w-lg grid-cols-3 items-center">
          <button
            type="button"
            onClick={() => setMobileTab('explore')}
            className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 transition-colors ${
              mobileTab === 'explore' ? 'text-blue-600' : 'text-slate-500'
            }`}
          >
            <Compass className="h-5 w-5" aria-hidden="true" />
            <span className="text-[11px] font-semibold">분야 · 추천</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('timetable')}
            className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 transition-colors ${
              mobileTab === 'timetable' ? 'text-blue-600' : 'text-slate-500'
            }`}
          >
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
            <span className="text-[11px] font-semibold">내 시간표</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('counseling')}
            className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 transition-colors ${
              mobileTab === 'counseling' ? 'text-blue-600' : 'text-slate-500'
            }`}
          >
            <BookMarked className="h-5 w-5" aria-hidden="true" />
            <span className="text-[11px] font-semibold">진로 상담</span>
          </button>
        </div>
      </nav>

      {/* Subject Detail & Slot Move Bottom Sheet / Modal */}
      <SubjectDetailSheet
        subject={inspectedSubject}
        isEnabled={
          inspectedSubject
            ? enabledSubjectIds.includes(inspectedSubject.id)
            : false
        }
        slots={
          inspectedSubject
            ? subjectSlotsMap[inspectedSubject.id] ??
              inspectedSubject.defaultSlots
            : []
        }
        onClose={() => setInspectedSubjectId(null)}
        onToggleSubject={handleToggleSubject}
        onStartMoveSlot={handleStartMoveSlot}
      />
    </div>
  );
}

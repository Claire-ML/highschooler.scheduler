import {
  CheckCircle2,
  Circle,
  ExternalLink,
  FileText,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';
import { useState } from 'react';

const COUNSELING_QUESTIONS = [
  '우리 학교 교육과정에 내가 고른 선택과목이 개설되어 있나요?',
  '미개설 과목이라면 공동교육과정, 온라인학교, 학교 밖 교육으로 들을 수 있나요?',
  '희망 진로에 맞춰 2~3학년 과목 위계(예: 일반선택 → 진로선택)가 잘 맞나요?',
  '진로가 바뀌었을 때 수강 신청 변경 기간(11월)이나 다음 학기에 조정할 수 있나요?',
];

const GUIDE_FACTS = [
  {
    label: '졸업 이수 학점',
    value: '총 192학점 이상 (교과 174 + 창체 18, 학기당 평균 32학점)',
  },
  {
    label: '과목 이수 기준',
    value: '출석률 2/3 이상 + 학업 성취율 40% 이상 (1학점 50분 16회)',
  },
  {
    label: '수강 신청 일정',
    value: '5~6월 수요 조사 → 9~10월 수강 신청 → 11월 변경 · 12월 확정',
  },
  {
    label: '미개설 과목 대안',
    value: '공동교육과정(거점·연합) · 온라인학교 · 학교 밖 교육(최대 8학점)',
  },
];

export function CareerCounselingCard() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const toggleItem = (idx: number) => {
    setCheckedItems((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx]
    );
  };

  return (
    <section
      aria-labelledby="counseling-heading"
      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <GraduationCap className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2
            id="counseling-heading"
            className="text-base font-bold tracking-tight text-slate-900"
          >
            진로 상담은 담임선생님이나 학교 진로선생님께 받을 수 있어요
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            이 앱에서 짠 시간표는 방향을 잡는 참고용이에요. 실제 과목 선택과
            수강 신청 전에는 학교 교육과정 이수 지도팀인{' '}
            <strong>담임선생님</strong> 또는{' '}
            <strong>학교 진로선생님(진로전담교사)</strong>께 꼭 진로 상담을
            받아보세요.
          </p>
        </div>
      </div>

      {/* Teacher Roles per 2024 Guide */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
          <div className="text-xs font-bold text-slate-900">담임선생님</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            과목 선택 기초 상담, 3개년 누적 학점 이수 점검, 진로 변경 시 학업
            설계 상담을 도와주세요.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
          <div className="text-xs font-bold text-slate-900">
            학교 진로선생님 (진로전담교사)
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            커리어넷·워크넷 진로심리검사 해석, 희망 계열·학과 맞춤 과목
            로드맵 심층 상담을 받을 수 있어요.
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div className="mt-4 border-t border-slate-100 pt-3.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <MessageSquare
            className="h-3.5 w-3.5 text-slate-500"
            aria-hidden="true"
          />
          선생님께 상담받을 때 물어볼 질문 체크리스트
        </div>
        <div className="mt-2 space-y-1.5">
          {COUNSELING_QUESTIONS.map((question, idx) => {
            const isChecked = checkedItems.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleItem(idx)}
                aria-pressed={isChecked}
                className={`flex min-h-[44px] w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs leading-snug transition-colors ${
                  isChecked
                    ? 'border-blue-200 bg-blue-50/70 text-blue-950'
                    : 'border-slate-200/80 bg-slate-50/60 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                {isChecked ? (
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-blue-600"
                    aria-hidden="true"
                  />
                ) : (
                  <Circle
                    className="h-4 w-4 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                )}
                <span>{question}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2024 Official Guide Key Facts + PDF Link */}
      <div className="mt-4 border-t border-slate-100 pt-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <FileText className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            고교학점제 핵심 기준 (2024 운영 안내서)
          </div>
          <a
            href="/assets/aistudio/hscredit_guide_2024_a249ac5a.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[36px] items-center gap-1 rounded-lg px-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
          >
            안내서 원문 PDF 보기
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>

        <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-2">
          {GUIDE_FACTS.map((fact) => (
            <div key={fact.label} className="rounded-lg bg-slate-50/80 px-2.5 py-2">
              <dt className="font-semibold text-slate-700">{fact.label}</dt>
              <dd className="mt-0.5 leading-snug text-slate-500">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

import {
  Brain,
  Building2,
  Clapperboard,
  Cpu,
  Globe,
  HeartPulse,
  Scale,
  TrendingUp,
} from 'lucide-react';
import { InterestField } from '../data/curriculum';

const ICON_MAP = {
  Cpu,
  HeartPulse,
  TrendingUp,
  Clapperboard,
  Scale,
  Building2,
  Brain,
  Globe,
};

interface InterestSelectorProps {
  fields: InterestField[];
  selectedFieldId: string;
  onSelectField: (fieldId: string) => void;
}

export function InterestSelector({
  fields,
  selectedFieldId,
  onSelectField,
}: InterestSelectorProps) {
  return (
    <section aria-labelledby="interest-heading">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <div>
          <h2
            id="interest-heading"
            className="text-lg font-bold tracking-tight text-slate-900"
          >
            01. 관심 분야 고르기
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            관심 있는 진로·학문 분야 버튼을 누르면 맞춤 과목을 추천해드려요.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2">
        {fields.map((field) => {
          const Icon = ICON_MAP[field.iconName];
          const isSelected = field.id === selectedFieldId;

          return (
            <button
              key={field.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectField(field.id)}
              className={`group flex min-h-[64px] w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-[0.98] ${
                isSelected
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/15'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  isSelected
                    ? 'bg-white/15 text-white'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200/70'
                }`}
              >
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold leading-snug">
                  {field.label}
                </span>
                <span
                  className={`mt-0.5 block truncate text-xs leading-tight ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {field.shortDesc}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

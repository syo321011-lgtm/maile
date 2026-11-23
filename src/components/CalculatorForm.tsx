import React, { useRef } from 'react';
import { Plus, RotateCcw } from 'lucide-react';

interface CalculatorFormProps {
  title: string;
  requiredMiles: string;
  taxesAndFees: string;
  paidFare: string;
  onTitleChange: (value: string) => void;
  onRequiredMilesChange: (value: string) => void;
  onTaxesAndFeesChange: (value: string) => void;
  onPaidFareChange: (value: string) => void;
  onAddToComparison: () => boolean;
  onClear: () => void;
  feedbackMessage: { type: 'error' | 'success'; text: string } | null;
}

export function CalculatorForm({
  title,
  requiredMiles,
  taxesAndFees,
  paidFare,
  onTitleChange,
  onRequiredMilesChange,
  onTaxesAndFeesChange,
  onPaidFareChange,
  onAddToComparison,
  onClear,
  feedbackMessage,
}: CalculatorFormProps) {
  const milesInputRef = useRef<HTMLInputElement>(null);
  const fareInputRef = useRef<HTMLInputElement>(null);

  const handleNumericInput = (
    raw: string,
    setter: (value: string) => void
  ) => {
    if (raw === '') {
      setter('');
      return;
    }
    const sanitized = raw.replace(/[^\d]/g, '');
    setter(sanitized);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const added = onAddToComparison();
    if (!added) {
      const miles = Number(requiredMiles);
      const fare = Number(paidFare);
      if (!requiredMiles || miles <= 0) {
        milesInputRef.current?.focus();
      } else if (!paidFare || fare <= 0) {
        fareInputRef.current?.focus();
      }
    }
  };

  return (
    <section
      aria-label="シミュレーション入力フォーム"
      className="flex h-full flex-col justify-between rounded-[16px] bg-white p-6 shadow-[0_8px_30px_rgba(38,35,30,0.05)] sm:p-8"
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* 比較用タイトル */}
        <div>
          <label
            htmlFor="plan-title"
            className="mb-2 block text-sm font-semibold text-[#2E2A24]"
          >
            比較用タイトル
          </label>
          <input
            id="plan-title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="例：東京ーホノルル ビジネス 往復"
            className="w-full rounded-full border border-[#E4DDD1] bg-[#FCFBF9] px-5 py-3 text-sm text-[#26231E] placeholder-[#ACA498] transition-colors duration-150 focus:border-[#A68446] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A68446]/20 sm:text-[15px]"
          />
        </div>

        {/* ①必要マイル数 & ②特典利用時の燃油サ/諸税（円） 横並び2列 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="required-miles"
              className="mb-2 block text-sm font-semibold text-[#2E2A24]"
            >
              ①必要マイル数
            </label>
            <div className="relative">
              <input
                ref={milesInputRef}
                id="required-miles"
                type="number"
                inputMode="numeric"
                min="0"
                value={requiredMiles}
                onChange={(e) =>
                  handleNumericInput(e.target.value, onRequiredMilesChange)
                }
                placeholder="0"
                className="tabular-nums w-full rounded-full border border-[#E4DDD1] bg-[#FCFBF9] py-3 pl-5 pr-16 text-sm font-medium text-[#26231E] placeholder-[#ACA498] transition-colors duration-150 focus:border-[#A68446] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A68446]/20 sm:text-[15px]"
              />
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs font-medium text-[#8C8478]">
                マイル
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="taxes-fees"
              className="mb-2 block text-sm font-semibold text-[#2E2A24]"
            >
              ②特典利用時の燃油サ/諸税（円）
            </label>
            <div className="relative">
              <input
                id="taxes-fees"
                type="number"
                inputMode="numeric"
                min="0"
                value={taxesAndFees}
                onChange={(e) =>
                  handleNumericInput(e.target.value, onTaxesAndFeesChange)
                }
                placeholder="0"
                className="tabular-nums w-full rounded-full border border-[#E4DDD1] bg-[#FCFBF9] py-3 pl-5 pr-12 text-sm font-medium text-[#26231E] placeholder-[#ACA498] transition-colors duration-150 focus:border-[#A68446] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A68446]/20 sm:text-[15px]"
              />
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs font-medium text-[#8C8478]">
                円
              </span>
            </div>
          </div>
        </div>

        {/* ③有償で購入した場合（円） 全幅 */}
        <div>
          <label
            htmlFor="paid-fare"
            className="mb-2 block text-sm font-semibold text-[#2E2A24]"
          >
            ③有償で購入した場合（円）
          </label>
          <div className="relative">
            <input
              ref={fareInputRef}
              id="paid-fare"
              type="number"
              inputMode="numeric"
              min="0"
              value={paidFare}
              onChange={(e) =>
                handleNumericInput(e.target.value, onPaidFareChange)
              }
              placeholder="0"
              className="tabular-nums w-full rounded-full border border-[#E4DDD1] bg-[#FCFBF9] py-3 pl-5 pr-12 text-sm font-medium text-[#26231E] placeholder-[#ACA498] transition-colors duration-150 focus:border-[#A68446] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A68446]/20 sm:text-[15px]"
            />
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs font-medium text-[#8C8478]">
              円
            </span>
          </div>
        </div>

        {/* フィードバックメッセージ */}
        {feedbackMessage && (
          <p
            role="status"
            aria-live="polite"
            className={`text-xs font-medium ${
              feedbackMessage.type === 'error'
                ? 'text-[#B8382C]'
                : 'text-[#1D7244]'
            }`}
          >
            {feedbackMessage.text}
          </p>
        )}

        {/* ボタン2つ横並び */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="submit"
            className="inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#A68446] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-[#91723B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A68446] focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>比較リストに追加</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#D8D1C5] bg-white px-6 py-2.5 text-sm font-semibold text-[#5B544A] transition-colors duration-150 hover:border-[#BEB5A6] hover:bg-[#FAF8F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A68446] focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>クリア</span>
          </button>
        </div>
      </form>

      {/* フッター注釈 */}
      <div className="mt-6 border-t border-[#EFEAE2] pt-4">
        <p className="text-xs text-[#8C8478] sm:text-[13px]">
          マイル価値 ＝（③ － ②） ÷ ①
        </p>
      </div>
    </section>
  );
}

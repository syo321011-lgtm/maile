import {
  formatYen,
  getGaugePosition,
  getMileRating,
} from '../types/simulator';

interface ResultCardProps {
  isValid: boolean;
  mileValue: number | null;
  paidFare: number;
  taxesAndFees: number;
  savings: number;
}

const GUIDE_ITEMS = [
  { range: '1円未満', label: '割に合わない' },
  { range: '1〜2円', label: '標準的' },
  { range: '3〜4円', label: 'お得' },
  { range: '5〜9円', label: 'かなりお得' },
  { range: '9円以上', label: '最高！' },
];

export function ResultCard({
  isValid,
  mileValue,
  paidFare,
  taxesAndFees,
  savings,
}: ResultCardProps) {
  const rating = getMileRating(isValid ? mileValue : null);
  const markerPosition = getGaugePosition(isValid ? mileValue : null);

  return (
    <section
      aria-label="リアルタイム計算結果"
      className="flex h-full flex-col justify-between rounded-[16px] bg-white p-6 shadow-[0_8px_30px_rgba(38,35,30,0.05)] sm:p-8"
    >
      <div>
        {/* 見出し */}
        <h2 className="text-sm font-semibold tracking-wide text-[#6D6558]">
          1マイルあたりの価値
        </h2>

        {/* メイン数値 + 単位 */}
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span
            className="tabular-nums text-4xl font-bold tracking-tight text-[#26231E] sm:text-5xl"
            data-testid="mile-value-display"
          >
            {isValid && mileValue !== null ? mileValue.toFixed(2) : '—'}
          </span>
          <span className="text-base font-semibold text-[#5E574C] sm:text-lg">
            円/マイル
          </span>
        </div>

        {/* 評価バッジ（ピル型ラベル） */}
        <div className="mt-3.5">
          <span
            className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold transition-colors duration-150 sm:text-[13px] ${rating.badgeClass}`}
          >
            {rating.label}
          </span>
        </div>

        {/* 水平インジケーターバー（ゲージ） */}
        <div className="mt-6">
          <div className="relative py-2">
            {/* Pastel gradient track */}
            <div
              className="h-3 w-full rounded-full shadow-inner"
              style={{
                background:
                  'linear-gradient(90deg, #F6B8B3 0%, #F9DF9F 25%, #B8E6C6 50%, #A9DFE7 75%, #E8CF8E 100%)',
              }}
              aria-hidden="true"
            />

            {/* Subtle tick lines */}
            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            >
              {[0, 25, 50, 75, 100].map((pct) => (
                <span
                  key={pct}
                  className="absolute top-1/2 h-3 w-[1px] -translate-x-1/2 -translate-y-1/2 bg-white/60"
                  style={{ left: `${pct}%` }}
                />
              ))}
            </div>

            {/* Vertical black indicator marker */}
            <div
              className={`pointer-events-none absolute top-1/2 h-5 w-[3.5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1E1B18] shadow-sm transition-all duration-200 ease-out ${
                isValid ? 'opacity-100 scale-100' : 'opacity-25 scale-90'
              }`}
              style={{ left: `${markerPosition}%` }}
              aria-hidden="true"
            />
          </div>

          {/* Gauge scale labels */}
          <div className="relative mt-1 h-4 text-[11px] font-medium text-[#7D7568] tabular-nums">
            <span className="absolute left-0">0</span>
            <span className="absolute left-[25%] -translate-x-1/2">1</span>
            <span className="absolute left-[50%] -translate-x-1/2">3</span>
            <span className="absolute left-[75%] -translate-x-1/2">5</span>
            <span className="absolute right-0">9円+</span>
          </div>
        </div>

        {/* 内訳リスト（区切り線あり） */}
        <dl className="mt-6 divide-y divide-[#EFEAE2] border-y border-[#EFEAE2] text-sm">
          <div className="flex items-center justify-between py-3">
            <dt className="text-[#665E52]">有償運賃</dt>
            <dd className="tabular-nums font-medium text-[#26231E]">
              {isValid ? formatYen(paidFare) : '—'}
            </dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-[#665E52]">特典利用時の自己負担</dt>
            <dd className="tabular-nums font-medium text-[#26231E]">
              {isValid ? formatYen(taxesAndFees) : '—'}
            </dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="font-bold text-[#26231E]">浮いた金額</dt>
            <dd className="tabular-nums font-bold text-[#26231E]">
              {isValid ? formatYen(savings) : '—'}
            </dd>
          </div>
        </dl>
      </div>

      {/* 判断目安ボックス */}
      <div className="mt-6 rounded-xl bg-[#FAF6EE] p-4 text-xs leading-relaxed text-[#574F44] sm:p-5 sm:text-[13px]">
        <p className="mb-1.5 font-semibold text-[#3C352B]">
          【マイル価値の判断目安】
        </p>
        <ul className="space-y-0.5">
          {GUIDE_ITEMS.map((item) => (
            <li key={item.range} className="tabular-nums">
              {item.range}：{item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

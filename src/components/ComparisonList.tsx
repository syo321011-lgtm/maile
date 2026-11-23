import { Trash2 } from 'lucide-react';
import {
  ComparisonPlan,
  formatNumber,
  formatYen,
  getMileRating,
} from '../types/simulator';

interface ComparisonListProps {
  plans: ComparisonPlan[];
  onDeletePlan: (id: string) => void;
  onClearAll: () => void;
}

export function ComparisonList({
  plans,
  onDeletePlan,
  onClearAll,
}: ComparisonListProps) {
  return (
    <section
      aria-label="比較リスト"
      className="rounded-[16px] bg-white p-6 shadow-[0_8px_30px_rgba(38,35,30,0.05)] sm:p-8"
    >
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h2 className="text-lg font-bold text-[#26231E] sm:text-xl">
            比較リスト
          </h2>
          {plans.length > 0 && (
            <span className="tabular-nums text-xs font-medium text-[#7D7568]">
              {plans.length}件
            </span>
          )}
        </div>

        {plans.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-[#DED7CB] bg-white px-4 py-1.5 text-xs font-semibold text-[#5E574C] transition-colors duration-150 hover:border-[#B8382C]/40 hover:bg-[#FDF0EF] hover:text-[#B8382C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A68446]"
          >
            <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>リストを空にする</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {plans.length === 0 ? (
        <div className="flex min-h-[128px] items-center justify-center rounded-xl border border-dashed border-[#D8D0C2] bg-[#FCFBF9] px-6 py-8 text-center">
          <p className="text-sm leading-relaxed text-[#7D7568]">
            候補の特典航空券を「比較リスト」に追加すると、こちらで比較することが可能です。
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#EFEAE2] text-xs font-semibold text-[#7A7265]">
                  <th className="py-3 pr-4">タイトル</th>
                  <th className="px-4 py-3">1マイル単価</th>
                  <th className="px-4 py-3 text-right">必要マイル数</th>
                  <th className="px-4 py-3 text-right">燃油サ/諸税</th>
                  <th className="px-4 py-3 text-right">有償運賃</th>
                  <th className="px-4 py-3 text-right">浮いた金額</th>
                  <th className="py-3 pl-4 text-right">
                    <span className="sr-only">操作</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEAE2]">
                {plans.map((plan) => {
                  const rating = getMileRating(plan.mileValue);
                  return (
                    <tr
                      key={plan.id}
                      className="transition-colors duration-150 hover:bg-[#FAF8F5]/70"
                    >
                      <td className="max-w-[260px] py-4 pr-4 font-semibold text-[#26231E]">
                        <span className="block truncate" title={plan.title}>
                          {plan.title}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="tabular-nums text-base font-bold text-[#26231E]">
                            {plan.mileValue.toFixed(2)}
                            <span className="ml-0.5 text-xs font-medium text-[#6D6558]">
                              円
                            </span>
                          </span>
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${rating.badgeClass}`}
                          >
                            {rating.label}
                          </span>
                        </div>
                      </td>
                      <td className="tabular-nums whitespace-nowrap px-4 py-4 text-right text-[#3A352E]">
                        {formatNumber(plan.requiredMiles)} マイル
                      </td>
                      <td className="tabular-nums whitespace-nowrap px-4 py-4 text-right text-[#3A352E]">
                        {formatYen(plan.taxesAndFees)}
                      </td>
                      <td className="tabular-nums whitespace-nowrap px-4 py-4 text-right text-[#3A352E]">
                        {formatYen(plan.paidFare)}
                      </td>
                      <td className="tabular-nums whitespace-nowrap px-4 py-4 text-right font-semibold text-[#26231E]">
                        {formatYen(plan.savings)}
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <button
                          type="button"
                          onClick={() => onDeletePlan(plan.id)}
                          aria-label={`${plan.title}を削除`}
                          className="inline-flex min-h-[36px] cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-[#E5DEC9] bg-white px-3 py-1 text-xs font-medium text-[#6D6558] transition-colors duration-150 hover:border-[#B8382C]/40 hover:bg-[#FDF0EF] hover:text-[#B8382C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A68446]"
                        >
                          <Trash2
                            className="h-3.5 w-3.5 shrink-0"
                            aria-hidden="true"
                          />
                          <span>削除</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="space-y-3 md:hidden">
            {plans.map((plan) => {
              const rating = getMileRating(plan.mileValue);
              return (
                <article
                  key={plan.id}
                  className="rounded-xl border border-[#EFEAE2] bg-[#FCFBF9] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-[#26231E]">
                      {plan.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => onDeletePlan(plan.id)}
                      aria-label={`${plan.title}を削除`}
                      className="inline-flex min-h-[36px] shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-[#E5DEC9] bg-white px-3 py-1 text-xs font-medium text-[#6D6558] transition-colors duration-150 hover:border-[#B8382C]/40 hover:bg-[#FDF0EF] hover:text-[#B8382C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A68446]"
                    >
                      <Trash2
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span>削除</span>
                    </button>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <span className="tabular-nums text-xl font-bold text-[#26231E]">
                      {plan.mileValue.toFixed(2)}
                      <span className="ml-1 text-xs font-medium text-[#6D6558]">
                        円/マイル
                      </span>
                    </span>
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${rating.badgeClass}`}
                    >
                      {rating.label}
                    </span>
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-[#EFEAE2] pt-3 text-xs">
                    <div>
                      <dt className="text-[#7D7568]">必要マイル数</dt>
                      <dd className="tabular-nums mt-0.5 font-medium text-[#26231E]">
                        {formatNumber(plan.requiredMiles)} マイル
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#7D7568]">燃油サ/諸税</dt>
                      <dd className="tabular-nums mt-0.5 font-medium text-[#26231E]">
                        {formatYen(plan.taxesAndFees)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#7D7568]">有償運賃</dt>
                      <dd className="tabular-nums mt-0.5 font-medium text-[#26231E]">
                        {formatYen(plan.paidFare)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#7D7568]">浮いた金額</dt>
                      <dd className="tabular-nums mt-0.5 font-bold text-[#26231E]">
                        {formatYen(plan.savings)}
                      </dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

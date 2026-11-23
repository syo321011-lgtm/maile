export interface ComparisonPlan {
  id: string;
  title: string;
  requiredMiles: number;
  taxesAndFees: number;
  paidFare: number;
  savings: number;
  mileValue: number;
  createdAt: number;
}

export interface MileRating {
  label: string;
  badgeClass: string;
  tier: 'empty' | 'poor' | 'standard' | 'good' | 'great' | 'best';
}

export function getMileRating(mileValue: number | null): MileRating {
  if (mileValue === null || !Number.isFinite(mileValue)) {
    return {
      label: '必要マイルと有償運賃を入力してください',
      badgeClass: 'bg-[#F3EFE6] text-[#6E6659] border border-[#E5DEC9]',
      tier: 'empty',
    };
  }

  if (mileValue < 1) {
    return {
      label: '割に合わない',
      badgeClass: 'bg-[#FDF0EF] text-[#B8382C] border border-[#F5CECA]',
      tier: 'poor',
    };
  }

  if (mileValue < 2) {
    return {
      label: '標準的',
      badgeClass: 'bg-[#FAF3DD] text-[#8A6515] border border-[#EDE0B2]',
      tier: 'standard',
    };
  }

  if (mileValue < 5) {
    return {
      label: 'お得',
      badgeClass: 'bg-[#EDF7F0] text-[#1D7244] border border-[#C6E8D1]',
      tier: 'good',
    };
  }

  if (mileValue < 9) {
    return {
      label: 'かなりお得',
      badgeClass: 'bg-[#EBF6F8] text-[#0E6A79] border border-[#BEE1E9]',
      tier: 'great',
    };
  }

  return {
    label: '最高！',
    badgeClass: 'bg-[#FBF3DC] text-[#8A6316] border border-[#E6CF8E]',
    tier: 'best',
  };
}

/**
 * Maps a mile value onto the horizontal gauge ticks:
 * 0 -> 0%, 1 -> 25%, 3 -> 50%, 5 -> 75%, 9+ -> 100%
 */
export function getGaugePosition(mileValue: number | null): number {
  if (mileValue === null || !Number.isFinite(mileValue) || mileValue <= 0) {
    return 0;
  }
  if (mileValue < 1) {
    return (mileValue / 1) * 25;
  }
  if (mileValue < 3) {
    return 25 + ((mileValue - 1) / 2) * 25;
  }
  if (mileValue < 5) {
    return 50 + ((mileValue - 3) / 2) * 25;
  }
  if (mileValue < 9) {
    return 75 + ((mileValue - 5) / 4) * 25;
  }
  return 100;
}

export function formatYen(value: number): string {
  return `${Math.round(value).toLocaleString('ja-JP')} 円`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('ja-JP');
}

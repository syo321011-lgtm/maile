/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import { ComparisonList } from './components/ComparisonList';
import { Header } from './components/Header';
import { ResultCard } from './components/ResultCard';
import { ComparisonPlan } from './types/simulator';

const STORAGE_KEY = 'mile_unit_value_comparison_plans_v1';

function loadSavedPlans(): ComparisonPlan[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is ComparisonPlan =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.requiredMiles === 'number' &&
        typeof item.taxesAndFees === 'number' &&
        typeof item.paidFare === 'number' &&
        typeof item.savings === 'number' &&
        typeof item.mileValue === 'number'
    );
  } catch {
    return [];
  }
}

function getNextUntitledName(existingPlans: ComparisonPlan[]): string {
  const existingTitles = new Set(existingPlans.map((p) => p.title));
  let index = 1;
  while (existingTitles.has(`無題のプラン${index}`)) {
    index += 1;
  }
  return `無題のプラン${index}`;
}

export default function App() {
  const [title, setTitle] = useState('');
  const [requiredMiles, setRequiredMiles] = useState('');
  const [taxesAndFees, setTaxesAndFees] = useState('');
  const [paidFare, setPaidFare] = useState('');

  const [plans, setPlans] = useState<ComparisonPlan[]>(() => loadSavedPlans());
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [plans]);

  useEffect(() => {
    if (!feedbackMessage) return;
    const timer = window.setTimeout(() => {
      setFeedbackMessage(null);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [feedbackMessage]);

  const calculation = useMemo(() => {
    const milesNum = Number(requiredMiles);
    const taxesNum = taxesAndFees === '' ? 0 : Number(taxesAndFees);
    const fareNum = Number(paidFare);

    const isValid =
      requiredMiles !== '' &&
      paidFare !== '' &&
      Number.isFinite(milesNum) &&
      milesNum > 0 &&
      Number.isFinite(fareNum) &&
      fareNum > 0 &&
      Number.isFinite(taxesNum) &&
      taxesNum >= 0;

    if (!isValid) {
      return {
        isValid: false,
        mileValue: null,
        paidFare: 0,
        taxesAndFees: 0,
        savings: 0,
        requiredMiles: 0,
      };
    }

    const savings = fareNum - taxesNum;
    const mileValue = savings / milesNum;

    return {
      isValid: true,
      mileValue,
      paidFare: fareNum,
      taxesAndFees: taxesNum,
      savings,
      requiredMiles: milesNum,
    };
  }, [requiredMiles, taxesAndFees, paidFare]);

  const handleAddToComparison = (): boolean => {
    if (!calculation.isValid || calculation.mileValue === null) {
      setFeedbackMessage({
        type: 'error',
        text: '「①必要マイル数」と「③有償で購入した場合」に1以上の数値を入力してください。',
      });
      return false;
    }

    const trimmedTitle = title.trim();
    const resolvedTitle = trimmedTitle || getNextUntitledName(plans);

    const newPlan: ComparisonPlan = {
      id:
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: resolvedTitle,
      requiredMiles: calculation.requiredMiles,
      taxesAndFees: calculation.taxesAndFees,
      paidFare: calculation.paidFare,
      savings: calculation.savings,
      mileValue: calculation.mileValue,
      createdAt: Date.now(),
    };

    setPlans((prev) => [...prev, newPlan]);
    setFeedbackMessage({
      type: 'success',
      text: `「${resolvedTitle}」を比較リストに追加しました。`,
    });
    return true;
  };

  const handleClearForm = () => {
    setTitle('');
    setRequiredMiles('');
    setTaxesAndFees('');
    setPaidFare('');
    setFeedbackMessage(null);
  };

  const handleDeletePlan = (id: string) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== id));
  };

  const handleClearAllPlans = () => {
    setPlans([]);
  };

  const handleFieldChange =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      if (feedbackMessage?.type === 'error') {
        setFeedbackMessage(null);
      }
    };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#26231E]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Header brandName="マイ旅" />

        <main className="space-y-6 sm:space-y-8">
          {/* 2カラムメインエリア（スマホ縦1列） */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
            <CalculatorForm
              title={title}
              requiredMiles={requiredMiles}
              taxesAndFees={taxesAndFees}
              paidFare={paidFare}
              onTitleChange={handleFieldChange(setTitle)}
              onRequiredMilesChange={handleFieldChange(setRequiredMiles)}
              onTaxesAndFeesChange={handleFieldChange(setTaxesAndFees)}
              onPaidFareChange={handleFieldChange(setPaidFare)}
              onAddToComparison={handleAddToComparison}
              onClear={handleClearForm}
              feedbackMessage={feedbackMessage}
            />

            <ResultCard
              isValid={calculation.isValid}
              mileValue={calculation.mileValue}
              paidFare={calculation.paidFare}
              taxesAndFees={calculation.taxesAndFees}
              savings={calculation.savings}
            />
          </div>

          {/* 下部全幅：比較リストエリア */}
          <ComparisonList
            plans={plans}
            onDeletePlan={handleDeletePlan}
            onClearAll={handleClearAllPlans}
          />
        </main>
      </div>
    </div>
  );
}

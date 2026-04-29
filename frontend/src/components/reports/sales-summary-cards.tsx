import { formatCurrency, type SalesSummary } from '../../pages/admin/reports.utils';

interface SalesSummaryCardsProps {
  summary: SalesSummary;
  isLoading: boolean;
}

interface SummaryCardItem {
  label: string;
  value: string;
  toneClassName: string;
}

export default function SalesSummaryCards({
  summary,
  isLoading,
}: SalesSummaryCardsProps) {
  const cards: SummaryCardItem[] = [
    {
      label: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue),
      toneClassName: 'from-green-500 to-green-600',
    },
    {
      label: 'Total Orders',
      value: `${summary.totalOrders}`,
      toneClassName: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Avg Order Value',
      value: formatCurrency(summary.averageOrderValue),
      toneClassName: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-gradient-to-br ${card.toneClassName} text-white p-6 rounded-xl shadow-lg`}
        >
          <p className='text-sm opacity-90'>{card.label}</p>
          <p className='text-2xl font-bold mt-2'>
            {isLoading ? 'Loading...' : card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

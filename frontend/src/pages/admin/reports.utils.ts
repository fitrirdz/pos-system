import type { Transaction } from '../../interfaces';

export type DateRangePreset = 'TODAY' | 'WEEK' | 'MONTH' | 'CUSTOM';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface SalesTrendPoint {
  dateKey: string;
  dateLabel: string;
  revenue: number;
  orders: number;
}

export interface TopProductRow {
  productId: string;
  code: string;
  name: string;
  totalQty: number;
  totalRevenue: number;
}

const getStartOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const getEndOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

export const parseSafeDate = (dateString: string): Date | null => {
  const parsed = new Date(dateString);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const toLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDateLabel = (dateKey: string): string => {
  const parsed = parseSafeDate(dateKey);

  if (!parsed) {
    return dateKey;
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
  }).format(parsed);
};

export const formatDateTime = (dateString: string): string => {
  const parsed = parseSafeDate(dateString);

  if (!parsed) {
    return '-';
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
};

export const getDateRange = (
  preset: DateRangePreset,
  customStartDate: string,
  customEndDate: string,
  now: Date = new Date(),
): DateRange => {
  const todayStart = getStartOfDay(now);
  const todayEnd = getEndOfDay(now);

  if (preset === 'TODAY') {
    return { start: todayStart, end: todayEnd };
  }

  if (preset === 'WEEK') {
    const weekStart = getStartOfDay(now);
    const day = weekStart.getDay();
    const diffFromMonday = day === 0 ? 6 : day - 1;
    weekStart.setDate(weekStart.getDate() - diffFromMonday);

    return { start: weekStart, end: todayEnd };
  }

  if (preset === 'MONTH') {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start: getStartOfDay(monthStart), end: todayEnd };
  }

  const parsedStart = parseSafeDate(customStartDate);
  const parsedEnd = parseSafeDate(customEndDate);

  if (!parsedStart || !parsedEnd) {
    return { start: todayStart, end: todayEnd };
  }

  const normalizedStart = getStartOfDay(parsedStart);
  const normalizedEnd = getEndOfDay(parsedEnd);

  if (normalizedEnd < normalizedStart) {
    return { start: normalizedEnd, end: getEndOfDay(normalizedStart) };
  }

  return {
    start: normalizedStart,
    end: normalizedEnd,
  };
};

export const isDateInRange = (
  date: Date,
  rangeStart: Date,
  rangeEnd: Date,
): boolean => {
  return date >= rangeStart && date <= rangeEnd;
};

export const calculateSalesSummary = (
  transactions: Transaction[],
): SalesSummary => {
  const totalRevenue = transactions.reduce(
    (sum, transaction) => sum + transaction.total,
    0,
  );
  const totalOrders = transactions.length;
  const averageOrderValue = totalOrders === 0 ? 0 : totalRevenue / totalOrders;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
  };
};

export const buildSalesTrend = (
  transactions: Transaction[],
): SalesTrendPoint[] => {
  const grouped = new Map<string, SalesTrendPoint>();

  for (const transaction of transactions) {
    const parsedDate = parseSafeDate(transaction.createdAt);

    if (!parsedDate) {
      continue;
    }

    const dateKey = toLocalDateKey(parsedDate);
    const existing = grouped.get(dateKey);

    if (existing) {
      existing.revenue += transaction.total;
      existing.orders += 1;
      continue;
    }

    grouped.set(dateKey, {
      dateKey,
      dateLabel: formatDateLabel(dateKey),
      revenue: transaction.total,
      orders: 1,
    });
  }

  return Array.from(grouped.values()).sort((a, b) =>
    a.dateKey.localeCompare(b.dateKey),
  );
};

export const calculateTopProducts = (
  transactions: Transaction[],
): TopProductRow[] => {
  const grouped = new Map<string, TopProductRow>();

  for (const transaction of transactions) {
    for (const item of transaction.items) {
      const productId = item.product.id;
      const existing = grouped.get(productId);

      if (existing) {
        existing.totalQty += item.qty;
        existing.totalRevenue += item.qty * item.price;
        continue;
      }

      grouped.set(productId, {
        productId,
        code: item.product.code,
        name: item.product.name,
        totalQty: item.qty,
        totalRevenue: item.qty * item.price,
      });
    }
  }

  return Array.from(grouped.values()).sort((a, b) => {
    if (b.totalRevenue !== a.totalRevenue) {
      return b.totalRevenue - a.totalRevenue;
    }
    return b.totalQty - a.totalQty;
  });
};
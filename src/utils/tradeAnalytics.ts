// Pure analytics computation extracted from TradeJournal
// Trade interface defined inline — mobile app uses Zustand store for trades

export interface Trade {
  id: string;
  ticker: string;
  strategy: string;
  type: 'call' | 'put' | 'stock' | 'spread' | 'other';
  status: 'open' | 'closed';
  date: string;           // ISO date string, e.g. "2024-03-15"
  expiration?: string;
  strike?: number;
  premium?: number;
  quantity?: number;
  pnl: number | null;
  ivAtEntry?: number;
  daysHeld?: number;
  notes?: string;
  tags: string[];
}

export interface Pattern {
  type: 'warning' | 'insight' | 'strength';
  title: string;
  description: string;
  metric?: string;
}

export interface Analytics {
  totalTrades: number;
  openTrades: number;
  winRate: number;
  totalPnL: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  byStrategy: Record<string, { count: number; wins: number; totalPnL: number }>;
  highIVWinRate: number;
  lowIVWinRate: number;
  avgDaysHeld: number;
}

export interface ChartDataResult {
  monthly: { month: string; pnl: number; trades: number; wins: number }[];
  cumulativePnL: { date: string; pnl: number; ticker: string }[];
  tagPerformance: { tag: string; pnl: number; trades: number; wins: number }[];
  calendarData: Record<string, { pnl: number; trades: number }>;
  pnlBuckets: { bigLoss: number; smallLoss: number; breakeven: number; smallWin: number; bigWin: number };
}

export function computeAnalytics(trades: Trade[]): Analytics {
  const closedTrades = trades.filter(t => t.status === 'closed' && t.pnl !== null);
  const winners = closedTrades.filter(t => (t.pnl || 0) > 0);
  const losers = closedTrades.filter(t => (t.pnl || 0) < 0);

  const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const avgWin = winners.length > 0
    ? winners.reduce((sum, t) => sum + (t.pnl || 0), 0) / winners.length
    : 0;
  const avgLoss = losers.length > 0
    ? Math.abs(losers.reduce((sum, t) => sum + (t.pnl || 0), 0) / losers.length)
    : 0;

  // Strategy breakdown
  const byStrategy: Record<string, { count: number; wins: number; totalPnL: number }> = {};
  closedTrades.forEach(t => {
    if (!byStrategy[t.strategy]) {
      byStrategy[t.strategy] = { count: 0, wins: 0, totalPnL: 0 };
    }
    byStrategy[t.strategy].count++;
    if ((t.pnl || 0) > 0) byStrategy[t.strategy].wins++;
    byStrategy[t.strategy].totalPnL += t.pnl || 0;
  });

  // IV analysis
  const highIVTrades = closedTrades.filter(t => t.ivAtEntry && t.ivAtEntry > 30);
  const lowIVTrades = closedTrades.filter(t => t.ivAtEntry && t.ivAtEntry <= 30);

  const highIVWinRate = highIVTrades.length > 0
    ? highIVTrades.filter(t => (t.pnl || 0) > 0).length / highIVTrades.length * 100
    : 0;
  const lowIVWinRate = lowIVTrades.length > 0
    ? lowIVTrades.filter(t => (t.pnl || 0) > 0).length / lowIVTrades.length * 100
    : 0;

  // Days held analysis
  const avgDaysHeld = closedTrades.filter(t => t.daysHeld).length > 0
    ? closedTrades.filter(t => t.daysHeld).reduce((sum, t) => sum + (t.daysHeld || 0), 0) /
    closedTrades.filter(t => t.daysHeld).length
    : 0;

  return {
    totalTrades: closedTrades.length,
    openTrades: trades.filter(t => t.status === 'open').length,
    winRate: closedTrades.length > 0 ? (winners.length / closedTrades.length) * 100 : 0,
    totalPnL,
    avgWin,
    avgLoss,
    profitFactor: avgLoss > 0 ? avgWin / avgLoss : 0,
    byStrategy,
    highIVWinRate,
    lowIVWinRate,
    avgDaysHeld
  };
}

export function computeChartData(trades: Trade[]): ChartDataResult {
  const closedTrades = trades.filter(t => t.status === 'closed' && t.pnl !== null);

  // Monthly breakdown
  const monthlyData: Record<string, { month: string; pnl: number; trades: number; wins: number }> = {};
  closedTrades.forEach(t => {
    const month = t.date.substring(0, 7); // YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = { month, pnl: 0, trades: 0, wins: 0 };
    }
    monthlyData[month].pnl += t.pnl || 0;
    monthlyData[month].trades++;
    if ((t.pnl || 0) > 0) monthlyData[month].wins++;
  });
  const monthly = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);

  // Cumulative P&L
  const sortedTrades = [...closedTrades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let cumulative = 0;
  const cumulativePnL = sortedTrades.map(t => {
    cumulative += t.pnl || 0;
    return { date: t.date, pnl: cumulative, ticker: t.ticker };
  });

  // Tag performance
  const tagData: Record<string, { tag: string; pnl: number; trades: number; wins: number }> = {};
  closedTrades.forEach(t => {
    t.tags.forEach(tag => {
      if (!tagData[tag]) {
        tagData[tag] = { tag, pnl: 0, trades: 0, wins: 0 };
      }
      tagData[tag].pnl += t.pnl || 0;
      tagData[tag].trades++;
      if ((t.pnl || 0) > 0) tagData[tag].wins++;
    });
  });
  const tagPerformance = Object.values(tagData).sort((a, b) => b.pnl - a.pnl);

  // Calendar data (last 3 months)
  const calendarData: Record<string, { pnl: number; trades: number }> = {};
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  trades.forEach(t => {
    const tradeDate = new Date(t.date);
    if (tradeDate >= threeMonthsAgo) {
      if (!calendarData[t.date]) {
        calendarData[t.date] = { pnl: 0, trades: 0 };
      }
      calendarData[t.date].pnl += t.pnl || 0;
      calendarData[t.date].trades++;
    }
  });

  // P&L distribution buckets
  const pnlBuckets = {
    bigLoss: 0, smallLoss: 0, breakeven: 0, smallWin: 0, bigWin: 0
  };
  closedTrades.forEach(t => {
    const pnl = t.pnl || 0;
    if (pnl < -200) pnlBuckets.bigLoss++;
    else if (pnl < -50) pnlBuckets.smallLoss++;
    else if (pnl <= 50) pnlBuckets.breakeven++;
    else if (pnl <= 200) pnlBuckets.smallWin++;
    else pnlBuckets.bigWin++;
  });

  return { monthly, cumulativePnL, tagPerformance, calendarData, pnlBuckets };
}

export function detectPatterns(trades: Trade[], analytics: Analytics): Pattern[] {
  const result: Pattern[] = [];
  const closedTrades = trades.filter(t => t.status === 'closed' && t.pnl !== null);

  if (closedTrades.length < 5) {
    return [{ type: 'insight', title: 'Need More Data', description: 'Log at least 5 closed trades to see patterns.' }];
  }

  // Win rate analysis
  if (analytics.winRate >= 60) {
    result.push({
      type: 'strength',
      title: 'Strong Win Rate',
      description: `Your ${analytics.winRate.toFixed(0)}% win rate is above average. Keep doing what works.`,
      metric: `${analytics.winRate.toFixed(0)}%`
    });
  } else if (analytics.winRate < 40) {
    result.push({
      type: 'warning',
      title: 'Low Win Rate',
      description: 'Consider tightening entry criteria or reviewing losing trades for common mistakes.',
      metric: `${analytics.winRate.toFixed(0)}%`
    });
  }

  // Profit factor
  if (analytics.profitFactor >= 1.5) {
    result.push({
      type: 'strength',
      title: 'Healthy Profit Factor',
      description: `Your winners are ${analytics.profitFactor.toFixed(1)}x larger than losers. Excellent risk/reward.`,
      metric: `${analytics.profitFactor.toFixed(1)}x`
    });
  } else if (analytics.profitFactor < 1 && analytics.profitFactor > 0) {
    result.push({
      type: 'warning',
      title: 'Negative Expectancy',
      description: 'Your losses are larger than wins. Consider using stop losses or taking profits earlier.',
      metric: `${analytics.profitFactor.toFixed(2)}x`
    });
  }

  // Strategy-specific insights
  Object.entries(analytics.byStrategy).forEach(([strategy, data]) => {
    if (data.count >= 3) {
      const winRate = (data.wins / data.count) * 100;
      if (winRate >= 70) {
        result.push({
          type: 'strength',
          title: `${strategy} Working Well`,
          description: `${winRate.toFixed(0)}% win rate on ${data.count} trades. This is your edge.`,
          metric: `${winRate.toFixed(0)}%`
        });
      } else if (winRate <= 30) {
        result.push({
          type: 'warning',
          title: `${strategy} Underperforming`,
          description: `Only ${winRate.toFixed(0)}% win rate. Consider reducing size or avoiding this strategy.`,
          metric: `${winRate.toFixed(0)}%`
        });
      }
    }
  });

  // IV environment analysis
  if (analytics.highIVWinRate > 0 && analytics.lowIVWinRate > 0) {
    if (analytics.highIVWinRate > analytics.lowIVWinRate + 20) {
      result.push({
        type: 'insight',
        title: 'Better in High IV',
        description: `You win ${analytics.highIVWinRate.toFixed(0)}% in high IV vs ${analytics.lowIVWinRate.toFixed(0)}% in low IV. Focus on high IV setups.`
      });
    } else if (analytics.lowIVWinRate > analytics.highIVWinRate + 20) {
      result.push({
        type: 'insight',
        title: 'Better in Low IV',
        description: `You win ${analytics.lowIVWinRate.toFixed(0)}% in low IV vs ${analytics.highIVWinRate.toFixed(0)}% in high IV. Consider avoiding high IV entries.`
      });
    }
  }

  // Holding period
  if (analytics.avgDaysHeld > 0) {
    const quickTrades = closedTrades.filter(t => t.daysHeld && t.daysHeld <= 3);
    const longerTrades = closedTrades.filter(t => t.daysHeld && t.daysHeld > 7);

    if (quickTrades.length >= 3 && longerTrades.length >= 3) {
      const quickWinRate = quickTrades.filter(t => (t.pnl || 0) > 0).length / quickTrades.length * 100;
      const longerWinRate = longerTrades.filter(t => (t.pnl || 0) > 0).length / longerTrades.length * 100;

      if (quickWinRate > longerWinRate + 15) {
        result.push({
          type: 'insight',
          title: 'Quick Exits Work Better',
          description: `Trades held 3 days or less win ${quickWinRate.toFixed(0)}% vs ${longerWinRate.toFixed(0)}% for longer holds.`
        });
      }
    }
  }

  // Recent performance
  const recentTrades = closedTrades.slice(0, 10);
  if (recentTrades.length >= 5) {
    const recentWinRate = recentTrades.filter(t => (t.pnl || 0) > 0).length / recentTrades.length * 100;
    if (recentWinRate >= 80) {
      result.push({
        type: 'strength',
        title: 'Hot Streak',
        description: `${recentWinRate.toFixed(0)}% win rate on last ${recentTrades.length} trades. Stay disciplined!`,
        metric: `${recentWinRate.toFixed(0)}%`
      });
    } else if (recentWinRate <= 20) {
      result.push({
        type: 'warning',
        title: 'Cold Streak',
        description: 'Consider reducing position size until the streak ends. Review recent losses.',
        metric: `${recentWinRate.toFixed(0)}%`
      });
    }
  }

  return result.length > 0 ? result : [{ type: 'insight', title: 'No Strong Patterns', description: 'Keep logging trades to discover your patterns.' }];
}

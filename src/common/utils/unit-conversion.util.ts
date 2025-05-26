export const MG_IN = {
  ton: 1_000_000_000,
  kilogram: 1_000_000,
  gram: 1_000,
  milligram: 1,
} as const;

export function toMilligrams(stock: Record<keyof typeof MG_IN, number>) {
  return (
    stock.ton * MG_IN.ton +
    stock.kilogram * MG_IN.kilogram +
    stock.gram * MG_IN.gram +
    stock.milligram * MG_IN.milligram
  );
}

export function fromMilligrams(totalMg: number) {
  const res = { ton: 0, kilogram: 0, gram: 0, milligram: 0 };

  for (const unit of ['ton', 'kilogram', 'gram', 'milligram'] as const) {
    const value = Math.floor(totalMg / MG_IN[unit]);
    res[unit] = value;
    totalMg -= value * MG_IN[unit];
  }
  return res;
}

export function formatPrice(price: number): string {
  if (price === 0) return "—";
  if (price >= 1_000) {
    return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  if (price >= 1) {
    return "$" + price.toFixed(2);
  }
  return "$" + price.toFixed(4);
}

export function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

export function changeColor(change: number): string {
  if (change > 0) return "var(--signal-green)";
  if (change < 0) return "var(--signal-red)";
  return "var(--text-muted)";
}

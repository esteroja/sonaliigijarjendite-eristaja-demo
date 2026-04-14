const NARROW_NBSP = "\u202F";

export function formatGroupedInt(value) {
  if (value == null || value === "") return "";

  const num = Number(value);
  if (!Number.isFinite(num)) return String(value);

  const sign = num < 0 ? "-" : "";
  const digits = Math.trunc(Math.abs(num)).toString();

  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP);
}

export function formatP(test) {
  if (!test) return "—";
  const p = test.p_adj ?? test.p;
  if (p == null || !isFinite(p)) return "—";

  // p = 0 → näita "0"
  if (p === 0) return "0";

  // p alla 0.001 → näita ainult 'p < 0.001'
  if (p < 0.001) return "p < 0.001";

  // muidu kolm koma
  return p.toFixed(3);
}

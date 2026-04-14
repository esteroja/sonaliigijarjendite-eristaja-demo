export function pct(x, digits = 3) {
    const v = Number.isFinite(x) ? x : 0;
    return `${(v * 100).toFixed(digits)}%`;
}


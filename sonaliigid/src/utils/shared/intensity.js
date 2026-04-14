const MIN_PVALUE = 1e-12;
const MAX_PVALUE_STRENGTH_STEPS = 4;

const BASE_OPACITY = 0.04;
const SIGNIFICANT_MIN_OPACITY = 0.1;
const MAX_OPACITY = 0.42;

function clampToUnitInterval(value) {
  return Math.max(0, Math.min(1, value));
}

function strengthFromPValue(pValue = null, significanceThreshold = 0.05) {
  if (typeof pValue !== "number" || !Number.isFinite(pValue)) return 0;
  if (
    typeof significanceThreshold !== "number" ||
    !Number.isFinite(significanceThreshold) ||
    significanceThreshold <= 0
  ) {
    return 0;
  }

  const safeP = Math.max(pValue, MIN_PVALUE);
  const ratio = significanceThreshold / safeP;
  const scaled = Math.log10(Math.max(ratio, 1)) / MAX_PVALUE_STRENGTH_STEPS;
  return clampToUnitInterval(scaled);
}

function opacityForDirection(dir, pValue, significanceThreshold, isSignificant) {
  if (dir === "equal") return 0;
  if (!isSignificant) return BASE_OPACITY;

  const strength = strengthFromPValue(pValue, significanceThreshold);
  return (
    SIGNIFICANT_MIN_OPACITY +
    (MAX_OPACITY - SIGNIFICANT_MIN_OPACITY) * strength
  );
}

function fillColor(dir, opacity) {
  if (dir === "up") return `rgba(30,136,229,${opacity})`;
  if (dir === "down") return `rgba(229,57,53,${opacity})`;
  return "rgba(0,0,0,0.045)";
}

function borderColor(dir, opacity) {
  if (dir === "up") return `rgba(21,101,192,${Math.min(1, opacity + 0.18)})`;
  if (dir === "down") return `rgba(183,28,28,${Math.min(1, opacity + 0.18)})`;
  return "rgba(0,0,0,0.10)";
}

export function pValueIntensity(
  pValue = null,
  significanceThreshold = 0.05,
  isSignificant = false
) {
  if (!isSignificant) return 0;
  return strengthFromPValue(pValue, significanceThreshold);
}

// Tree chip tone (background + border).
export function chipTone(
  dir,
  strength = 0,
  isSignificant = false
) {
  if (dir === "equal") {
    return { bg: "rgba(0,0,0,0.045)", border: "rgba(0,0,0,0.10)" };
  }

  const opacity = isSignificant
    ? SIGNIFICANT_MIN_OPACITY +
      (MAX_OPACITY - SIGNIFICANT_MIN_OPACITY) * clampToUnitInterval(strength)
    : BASE_OPACITY;

  return {
    bg: fillColor(dir, opacity),
    border: borderColor(dir, opacity),
  };
}

// Table row background uses the same significance-based tinting.
export function bgForRow(
  dir,
  pValue,
  significanceThreshold,
  isSignificant = false
) {
  const opacity = opacityForDirection(
    dir,
    pValue,
    significanceThreshold,
    isSignificant
  );

  if (opacity === 0) {
    return "rgba(0,0,0,0.045)";
  }

  return fillColor(dir, opacity);
}

export const keyFromCodes = (codes = []) =>
  Array.isArray(codes) ? codes.join(",") : "";

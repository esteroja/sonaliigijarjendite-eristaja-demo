import { formatGroupedInt, formatP } from "../shared/numberFormatting.js";
import { pct } from "./format.js";
import { keyToCsvLabel, keyToN } from "./posLabel.js";

function formatCsvP(p) {
  if (p == null) return "";
  return formatP({ p }).replace(/^p\s*/, "").replace(/^<\s+/, "<");
}

export function rowsToCsv(rows) {
  const header = [
    "n",
    "järjestus",
    "sagedus_minu",
    "sagedus_korpus",
    "osakaal_minu",
    "osakaal_korpus",
    "p_väärtus",
  ];

  const lines = [header.join(",")];

  (rows || []).forEach((r) => {
    const n = keyToN(r.key);
    const seq = keyToCsvLabel(r.key);
    const myCount = formatGroupedInt(r.myCount);
    const baseCount = formatGroupedInt(r.baasCount);
    const myShare = pct(r.myShare ?? 0);
    const baseShare = pct(r.baseShare ?? 0);
    const pStr = formatCsvP(r.p);

    lines.push(
      [
        n,
        seq,
        myCount,
        baseCount,
        myShare,
        baseShare,
        pStr,
      ].join(",")
    );
  });

  return lines.join("\r\n");
}

export function downloadCsv(csv, filename) {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function makeCsvDownloader({
  rowsByN,
  selectedNs,
  filenamePrefix,
  rowFilter = null,
}) {
  return () => {
    const picked = selectedNs.flatMap((n) => {
      const rows = rowsByN[n] || [];
      return rowFilter ? rows.filter(rowFilter) : rows;
    });

    const csv = rowsToCsv(picked);
    downloadCsv(csv, `${filenamePrefix}_${selectedNs.join("-")}.csv`);
  };
}

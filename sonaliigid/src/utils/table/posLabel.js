import { codeToName } from "../../constants/pos.js";

export function splitKey(codeKey = "") {
    return String(codeKey)
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
}

export function keyToUiLabel(codeKey) {
    return splitKey(codeKey)
        .map((c) => codeToName[c] || c)
        .join(" + ");
}

export function keyToCsvLabel(codeKey) {
    return splitKey(codeKey)
        .map((c) => codeToName[c] || c)
        .join("+");
}

export function keyToN(codeKey) {
    return splitKey(codeKey).length;
}

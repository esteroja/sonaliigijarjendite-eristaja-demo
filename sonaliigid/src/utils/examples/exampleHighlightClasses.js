export function highlightClassName(segment) {
  if (!segment.highlight) return "";

  const classes = ["example-highlight"];
  const depth = Math.min(segment.overlapDepth || 1, 3);

  if (depth >= 2) {
    classes.push(`example-highlight--depth-${depth}`);
  }

  if (/^\s+$/.test(segment.text)) {
    classes.push("example-highlight--space");
  }

  return classes.join(" ");
}

export function edgeClassName(segments, index) {
  const current = segments[index];
  if (!current?.highlight) return "";

  const previousHighlighted = !!segments[index - 1]?.highlight;
  const nextHighlighted = !!segments[index + 1]?.highlight;

  const classes = [];

  if (!previousHighlighted) {
    classes.push("example-highlight--edge-left");
  }

  if (!nextHighlighted) {
    classes.push("example-highlight--edge-right");
  }

  return classes.join(" ");
}

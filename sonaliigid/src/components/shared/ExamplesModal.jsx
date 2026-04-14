import { useEffect, useId, useRef } from "react";
import { buildSegments } from "../../utils/examples/highlight.js";
import {
    edgeClassName,
    highlightClassName,
} from "../../utils/examples/exampleHighlightClasses.js";

export default function ExamplesModal({
    open,
    title,
    items,
    keyStr,
    onClose,
}) {
    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const previousFocusRef = useRef(null);
    const titleId = useId();

    useEffect(() => {
        if (!open) return undefined;

        previousFocusRef.current = document.activeElement;
        closeButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== "Tab") return;

            const dialog = dialogRef.current;
            if (!dialog) return;

            const focusable = dialog.querySelectorAll(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );

            if (!focusable.length) {
                event.preventDefault();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);

            const previous = previousFocusRef.current;
            if (previous && typeof previous.focus === "function") {
                previous.focus();
            }
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="modal-backdrop"
            onClick={onClose}
        >
            <div
                ref={dialogRef}
                className="modal-dialog"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h4 id={titleId} className="modal-title">{title}</h4>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        aria-label="Sulge"
                        onClick={onClose}
                        className="modal-close-btn"
                    >
                        ✕
                    </button>
                </div>

                {(!items || items.length === 0) ? (
                    <div className="modal-empty">Näiteid ei leitud.</div>
                ) : (
                    <ol className="modal-list">
                        {items.map((ex, i) => {
                            const segments = buildSegments(ex.text, ex.matches, keyStr);

                            return (
                                <li key={i} className="modal-list-item example-row">
                                    {segments.map((seg, j) => (
                                        <span
                                            key={j}
                                            className={`${highlightClassName(seg)} ${edgeClassName(segments, j)}`.trim()}
                                        >
                                            {seg.text}
                                        </span>
                                    ))}
                                </li>
                            );
                        })}

                    </ol>
                )}
            </div>
        </div>
    );
}

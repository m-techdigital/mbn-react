import { useEffect, useId, useRef } from "react";

export default function BaseDrawer({
    open,
    onClose,
    ariaLabel,
    children,
    layerClassName = "",
    panelClassName = "",
}) {
    const panelRef = useRef(null);
    const labelId = useId();
    useEffect(() => {
        if (!open) return undefined;
        const previousOverflow = document.body.style.overflow;
        const previousFocus = document.activeElement;
        document.body.style.overflow = "hidden";
        window.setTimeout(
            () =>
                panelRef.current
                    ?.querySelector("button, a, input, select, textarea")
                    ?.focus(),
            0,
        );
        const onKeyDown = (event) => {
            if (event.key === "Escape") onClose?.();
            if (event.key !== "Tab" || !panelRef.current) return;
            const items = [
                ...panelRef.current.querySelectorAll(
                    "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
                ),
            ];
            if (!items.length) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
            previousFocus?.focus?.();
        };
    }, [open, onClose]);
    if (!open) return null;
    return (
        <div
            className={layerClassName}
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose?.();
            }}
        >
            <aside
                ref={panelRef}
                className={panelClassName}
                role="dialog"
                aria-modal="true"
                aria-labelledby={labelId}
                onMouseDown={(event) => event.stopPropagation()}
            >
                <span id={labelId} className="sr-only">
                    {ariaLabel}
                </span>
                {children}
            </aside>
        </div>
    );
}

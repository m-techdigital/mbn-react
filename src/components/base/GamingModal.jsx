import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { CloseOutlined } from "@ant-design/icons";

export default function GamingModal({
    open,
    title,
    onClose,
    children,
    footer,
    width = 500,
    className = "",
    closeOnBackdrop = false,
    bodyClassName = "",
}) {
    const titleId = useId();
    const modalRef = useRef(null);
    const previousFocusRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const previousOverflow = document.body.style.overflow;
        previousFocusRef.current = document.activeElement;
        window.setTimeout(
            () =>
                modalRef.current
                    ?.querySelector("button, a, input, select, textarea")
                    ?.focus(),
            0,
        );
        document.body.style.overflow = "hidden";
        const onKeyDown = (event) => {
            if (event.key === "Escape") onClose?.();
            if (event.key === "Tab" && modalRef.current) {
                const items = [
                    ...modalRef.current.querySelectorAll(
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
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
            previousFocusRef.current?.focus?.();
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className={`gaming-modal-layer ${className}`.trim()}
            role="presentation"
            onMouseDown={(event) => {
                if (closeOnBackdrop && event.target === event.currentTarget)
                    onClose?.();
            }}
        >
            <section
                ref={modalRef}
                className="gaming-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                style={{ "--gaming-modal-width": `${width}px` }}
            >
                <header className="gaming-modal__header">
                    <h2 id={titleId}>{title}</h2>
                    <button
                        type="button"
                        className="gaming-modal__close"
                        aria-label="Đóng"
                        onClick={onClose}
                    >
                        <CloseOutlined />
                    </button>
                </header>
                <div className={`gaming-modal__body ${bodyClassName}`.trim()}>
                    {children}
                </div>
                {footer ? (
                    <footer className="gaming-modal__footer">{footer}</footer>
                ) : null}
            </section>
        </div>,
        document.body,
    );
}

export function ModalFooterNote({ children, className = "" }) {
    return (
        <span className={`gaming-modal__footer-note ${className}`.trim()}>
            {children}
        </span>
    );
}

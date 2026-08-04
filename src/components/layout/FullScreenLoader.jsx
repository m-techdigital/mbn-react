import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import MarketplaceImage from "../base/MarketplaceImage";

const readNumber = (name, fallback) => {
    const value = Number(import.meta.env[name]);
    return Number.isFinite(value) && value >= 0 ? value : fallback;
};

const enabled =
    String(import.meta.env.VITE_FULL_SCREEN_LOADING ?? "true").toLowerCase() !==
    "false";

const isInternalNavigation = (event) => {
    if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    )
        return false;
    const anchor = event.target.closest?.("a[href]");
    if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
    )
        return false;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    return (
        `${url.pathname}${url.search}${url.hash}` !==
        `${window.location.pathname}${window.location.search}${window.location.hash}`
    );
};

export default function FullScreenLoader() {
    const location = useLocation();
    const [visible, setVisible] = useState(enabled);
    const [phase, setPhase] = useState(enabled ? "active" : "idle");
    const [label, setLabel] = useState("Đang khởi tạo hệ thống");

    const pending = useRef(false);
    const visibleAt = useRef(0);
    const lastLocationKey = useRef(location.key);
    const delayTimer = useRef(null);
    const finishTimer = useRef(null);
    const hideTimer = useRef(null);
    const failSafeTimer = useRef(null);

    const routeDelay = readNumber("VITE_ROUTE_OVERLAY_DELAY_MS", 260);
    const minimumVisible = readNumber("VITE_ROUTE_OVERLAY_MIN_MS", 260);
    const initialVisible = readNumber("VITE_INITIAL_LOADING_MS", 850);
    const maximumVisible = readNumber("VITE_ROUTE_OVERLAY_MAX_MS", 6000);

    const clearTransitionTimers = useCallback(() => {
        window.clearTimeout(delayTimer.current);
        window.clearTimeout(finishTimer.current);
        window.clearTimeout(hideTimer.current);
        window.clearTimeout(failSafeTimer.current);
    }, []);

    const hide = useCallback(() => {
        setPhase("leaving");
        hideTimer.current = window.setTimeout(() => {
            pending.current = false;
            setVisible(false);
            setPhase("idle");
        }, 240);
    }, []);

    const settle = useCallback(() => {
        window.clearTimeout(delayTimer.current);
        window.clearTimeout(failSafeTimer.current);

        if (!pending.current) return;

        if (!visible) {
            pending.current = false;
            setPhase("idle");
            return;
        }

        const elapsed = performance.now() - visibleAt.current;
        const wait = Math.max(0, minimumVisible - elapsed);
        window.clearTimeout(finishTimer.current);
        finishTimer.current = window.setTimeout(hide, wait);
    }, [hide, minimumVisible, visible]);

    const begin = useCallback(
        (nextLabel = "Đang chuyển trang") => {
            clearTransitionTimers();
            pending.current = true;
            setLabel(nextLabel);

            delayTimer.current = window.setTimeout(() => {
                visibleAt.current = performance.now();
                setVisible(true);
                setPhase("entering");
                window.requestAnimationFrame(() => setPhase("active"));
            }, routeDelay);

            failSafeTimer.current = window.setTimeout(() => {
                if (pending.current) hide();
            }, maximumVisible);
        },
        [clearTransitionTimers, hide, maximumVisible, routeDelay],
    );

    useEffect(() => {
        if (!enabled) return undefined;

        const onDocumentClick = (event) => {
            if (isInternalNavigation(event)) begin("Đang chuyển trang");
        };
        const onNavigationStart = () => begin("Đang chuyển trang");
        const onPopState = () => begin("Đang quay lại trang trước");
        const onNavigationSettled = () => settle();

        document.addEventListener("click", onDocumentClick, true);
        window.addEventListener("mbn:navigation-start", onNavigationStart);
        window.addEventListener("popstate", onPopState);
        window.addEventListener("mbn:navigation-settled", onNavigationSettled);

        visibleAt.current = performance.now();
        const initialTimer = window.setTimeout(() => {
            pending.current = true;
            settle();
        }, initialVisible);

        return () => {
            window.clearTimeout(initialTimer);
            clearTransitionTimers();
            document.removeEventListener("click", onDocumentClick, true);
            window.removeEventListener(
                "mbn:navigation-start",
                onNavigationStart,
            );
            window.removeEventListener("popstate", onPopState);
            window.removeEventListener(
                "mbn:navigation-settled",
                onNavigationSettled,
            );
        };
    }, [begin, clearTransitionTimers, initialVisible, settle]);

    useEffect(() => {
        if (!enabled || lastLocationKey.current === location.key) return;
        lastLocationKey.current = location.key;

        // Fallback for programmatic navigation that did not emit a start event.
        if (!pending.current) {
            begin("Đang tải nội dung");
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => settle());
            });
        }
    }, [begin, location.key, settle]);

    if (!visible) return null;

    return (
        <div
            className={`fullscreen-loader is-${phase}`}
            role="status"
            aria-live="polite"
            aria-label={label}
        >
            <div className="fullscreen-loader__backdrop" />
            <div className="fullscreen-loader__content">
                <div className="fullscreen-loader__mark" aria-hidden="true">
                    <span className="fullscreen-loader__orbit orbit-one" />
                    <span className="fullscreen-loader__orbit orbit-two" />
                    <MarketplaceImage src="/images/logo-purple.png" alt="" />
                </div>
                <div className="fullscreen-loader__copy">
                    <strong>MuaBanNick.Pro</strong>
                    <span>{label}</span>
                </div>
                <div className="fullscreen-loader__bar" aria-hidden="true">
                    <span />
                </div>
                <div className="fullscreen-loader__dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                </div>
            </div>
        </div>
    );
}

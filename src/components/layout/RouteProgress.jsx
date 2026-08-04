import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

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

export default function RouteProgress() {
    const location = useLocation();
    const [phase, setPhase] = useState("idle");
    const lastLocationKey = useRef(location.key);
    const finishTimer = useRef(null);
    const idleTimer = useRef(null);
    const failSafeTimer = useRef(null);

    const start = useCallback(() => {
        window.clearTimeout(finishTimer.current);
        window.clearTimeout(idleTimer.current);
        window.clearTimeout(failSafeTimer.current);
        setPhase("loading");
        failSafeTimer.current = window.setTimeout(() => {
            setPhase("finishing");
            idleTimer.current = window.setTimeout(() => setPhase("idle"), 220);
        }, 6000);
    }, []);

    const finish = useCallback(() => {
        window.clearTimeout(failSafeTimer.current);
        window.clearTimeout(finishTimer.current);
        finishTimer.current = window.setTimeout(() => {
            setPhase("finishing");
            idleTimer.current = window.setTimeout(() => setPhase("idle"), 220);
        }, 80);
    }, []);

    useEffect(() => {
        const onClick = (event) => {
            if (isInternalNavigation(event)) start();
        };
        const onPopState = () => start();
        const onStart = () => start();
        const onSettled = () => finish();

        document.addEventListener("click", onClick, true);
        window.addEventListener("popstate", onPopState);
        window.addEventListener("mbn:navigation-start", onStart);
        window.addEventListener("mbn:navigation-settled", onSettled);

        return () => {
            document.removeEventListener("click", onClick, true);
            window.removeEventListener("popstate", onPopState);
            window.removeEventListener("mbn:navigation-start", onStart);
            window.removeEventListener("mbn:navigation-settled", onSettled);
            window.clearTimeout(finishTimer.current);
            window.clearTimeout(idleTimer.current);
            window.clearTimeout(failSafeTimer.current);
        };
    }, [finish, start]);

    useEffect(() => {
        if (lastLocationKey.current === location.key) return;
        lastLocationKey.current = location.key;
        if (phase === "idle") {
            start();
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => finish());
            });
        }
    }, [finish, location.key, phase, start]);

    return (
        <div className={`route-progress is-${phase}`} aria-hidden="true">
            <span />
        </div>
    );
}

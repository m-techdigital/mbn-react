import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const positions = new Map();

const nextFrame = (callback) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(callback));
};

export default function ScrollManager() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const previousKey = useRef(location.key);

    useEffect(() => {
        const previousRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";
        return () => {
            window.history.scrollRestoration = previousRestoration;
        };
    }, []);

    useLayoutEffect(() => {
        const oldKey = previousKey.current;
        if (oldKey)
            positions.set(oldKey, { x: window.scrollX, y: window.scrollY });
        previousKey.current = location.key;

        const restore =
            navigationType === "POP" ? positions.get(location.key) : null;

        nextFrame(() => {
            if (location.hash) {
                const target = document.getElementById(location.hash.slice(1));
                if (target) {
                    target.scrollIntoView({ behavior: "auto", block: "start" });
                    return;
                }
            }

            window.scrollTo({
                left: restore?.x || 0,
                top: restore?.y || 0,
                behavior: "auto",
            });

            window.dispatchEvent(
                new CustomEvent("mbn:navigation-settled", {
                    detail: {
                        pathname: location.pathname,
                        restored: Boolean(restore),
                    },
                }),
            );
        });
    }, [
        location.key,
        location.pathname,
        location.search,
        location.hash,
        navigationType,
    ]);

    useEffect(
        () => () => {
            positions.set(location.key, {
                x: window.scrollX,
                y: window.scrollY,
            });
        },
        [location.key],
    );

    return null;
}

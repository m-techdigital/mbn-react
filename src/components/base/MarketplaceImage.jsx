import { useEffect, useMemo, useState } from "react";

const DEFAULT_FALLBACK = "/images/avatar-placeholder.svg";
const configuredApiUrl = String(import.meta.env.VITE_API_URL || "").trim();

function apiOrigin() {
    if (!configuredApiUrl) return "";
    try {
        return new URL(configuredApiUrl, window.location.origin).origin;
    } catch {
        return "";
    }
}

function normalizeMediaSource(source) {
    if (!source || typeof source !== "string") return source;
    if (source.startsWith("blob:") || source.startsWith("data:")) return source;
    try {
        const url = new URL(source, window.location.origin);
        const origin = apiOrigin();
        if (
            url.pathname.startsWith("/storage/") &&
            source.startsWith("/") &&
            origin &&
            origin !== window.location.origin
        )
            return `${origin}${url.pathname}${url.search}`;
    } catch {
        // Keep the original value when the source is not a valid URL.
    }
    return source;
}

export default function MarketplaceImage({
    src,
    fallbackSrc = DEFAULT_FALLBACK,
    alt = "",
    priority = false,
    loading,
    decoding = "async",
    fetchPriority,
    onError,
    ...props
}) {
    const initialSource = useMemo(
        () => normalizeMediaSource(src) || fallbackSrc,
        [src, fallbackSrc],
    );
    const [resolvedSource, setResolvedSource] = useState(initialSource);

    useEffect(() => {
        setResolvedSource(initialSource);
    }, [initialSource]);

    return (
        <img
            {...props}
            src={resolvedSource}
            alt={alt}
            loading={loading || (priority ? "eager" : "lazy")}
            decoding={decoding}
            fetchPriority={fetchPriority || (priority ? "high" : "auto")}
            onError={(event) => {
                if (resolvedSource !== fallbackSrc)
                    setResolvedSource(fallbackSrc);
                onError?.(event);
            }}
        />
    );
}

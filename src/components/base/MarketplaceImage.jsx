import { useEffect, useMemo, useState } from "react";

const DEFAULT_FALLBACK = "/images/avatar-placeholder.svg";

function normalizeMediaSource(source) {
    if (!source || typeof source !== "string") return source;
    try {
        const url = new URL(source, window.location.origin);
        if (
            url.pathname.startsWith("/storage/") &&
            ["localhost", "127.0.0.1"].includes(url.hostname)
        )
            return `${url.pathname}${url.search}`;
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

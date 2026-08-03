import InlineNotice from "./InlineNotice";
import { PageSkeleton } from "./LoadingSkeleton";

export default function AsyncContent({
    loading = false,
    error = null,
    onRetry,
    loadingVariant = "list",
    loadingCount = 6,
    empty = false,
    emptyContent = null,
    children,
    className = "",
}) {
    if (loading) {
        return (
            <div
                className={`mbn-async-content is-loading ${className}`.trim()}
                aria-busy="true"
            >
                <PageSkeleton variant={loadingVariant} count={loadingCount} />
            </div>
        );
    }

    if (error) {
        return (
            <div
                className={`mbn-async-content is-error ${className}`.trim()}
                aria-live="polite"
            >
                <InlineNotice
                    type="error"
                    title="Không thể tải dữ liệu"
                    description={error}
                    action={
                        onRetry
                            ? { label: "Thử lại", onClick: onRetry }
                            : undefined
                    }
                />
            </div>
        );
    }

    if (empty)
        return (
            <div className={`mbn-async-content is-empty ${className}`.trim()}>
                {emptyContent}
            </div>
        );

    return (
        <div
            className={`mbn-async-content is-ready ${className}`.trim()}
            aria-busy="false"
        >
            {children}
        </div>
    );
}

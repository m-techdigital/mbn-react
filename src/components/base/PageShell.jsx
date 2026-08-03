import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AsyncContent from "./AsyncContent";

export default function PageShell({
    title,
    description,
    children,
    onBack,
    onReload,
    actions = null,
    loading = false,
    loadingVariant = "list",
    loadingCount = 6,
    error = null,
    width = "wide",
    wide = false,
    className = "",
}) {
    const navigate = useNavigate();
    const resolvedWidth = wide ? "wide" : width;
    const normalizedWidth = resolvedWidth;
    const back = onBack === false ? null : onBack || (() => navigate(-1));
    const hasTools = Boolean(actions || onReload);

    return (
        <section
            className={`page-shell page-shell--${normalizedWidth} ${className}`.trim()}
        >
            <div className="page-panel">
                {title || description || back || hasTools ? (
                    <header className="mbn-page-header">
                        {back ? (
                            <button
                                type="button"
                                className="mbn-page-header__icon mbn-page-header__back"
                                onClick={back}
                                aria-label="Quay lại"
                            >
                                <ArrowLeftOutlined />
                            </button>
                        ) : null}
                        <div className="mbn-page-header__copy">
                            {title ? <h1>{title}</h1> : null}
                            {description ? <p>{description}</p> : null}
                        </div>
                        {hasTools ? (
                            <div className="mbn-page-header__tools">
                                {actions ? (
                                    <div className="mbn-page-header__actions">
                                        {actions}
                                    </div>
                                ) : null}
                                {onReload ? (
                                    <button
                                        type="button"
                                        className="mbn-page-header__icon"
                                        onClick={onReload}
                                        aria-label="Tải lại"
                                        disabled={loading}
                                    >
                                        <ReloadOutlined
                                            className={
                                                loading ? "is-spinning" : ""
                                            }
                                        />
                                    </button>
                                ) : null}
                            </div>
                        ) : null}
                    </header>
                ) : null}
                <AsyncContent
                    loading={loading}
                    error={error}
                    onRetry={onReload}
                    loadingVariant={loadingVariant}
                    loadingCount={loadingCount}
                    className="page-content"
                >
                    {children}
                </AsyncContent>
            </div>
        </section>
    );
}

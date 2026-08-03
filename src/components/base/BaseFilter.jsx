import { FilterOutlined, UpOutlined } from "@ant-design/icons";
import { useEffect, useId, useState } from "react";
import GamingButton from "./GamingButton";

export default function BaseFilter({
    children,
    onSubmit,
    onReset,
    className = "",
    resultText = "",
    loading = false,
    resetting = false,
    title = "Bộ lọc",
    activeCount = 0,
}) {
    const contentId = useId();
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const query = window.matchMedia("(max-width: 768px)");
        const sync = () => setCollapsed(query.matches);
        sync();
        query.addEventListener?.("change", sync);
        return () => query.removeEventListener?.("change", sync);
    }, []);

    return (
        <section
            className={`mbn-filter mbn-filter--compact ${collapsed ? "is-collapsed" : "is-expanded"} ${className}`.trim()}
        >
            <button
                type="button"
                className="mbn-filter__toggle"
                aria-expanded={!collapsed}
                aria-controls={contentId}
                onClick={() => setCollapsed((value) => !value)}
            >
                <span>
                    <FilterOutlined /> {title}
                    {activeCount > 0 ? <b>{activeCount}</b> : null}
                </span>
                <span className="mbn-filter__toggle-copy">
                    {collapsed ? "Mở bộ lọc" : "Thu gọn"} <UpOutlined />
                </span>
            </button>
            <form
                id={contentId}
                className="mbn-filter__form"
                onSubmit={onSubmit}
                hidden={collapsed}
            >
                <div className="mbn-filter__fields">{children}</div>
                <footer className="mbn-filter__footer">
                    <p className="mbn-filter__result" aria-live="polite">
                        {resultText || " "}
                    </p>
                    <div className="mbn-filter__actions">
                        <GamingButton
                            type="submit"
                            variant="primary"
                            size="sm"
                            loading={loading}
                        >
                            Tìm
                        </GamingButton>
                        <GamingButton
                            type="button"
                            variant="secondary"
                            size="sm"
                            loading={resetting}
                            onClick={onReset}
                        >
                            Đặt lại
                        </GamingButton>
                    </div>
                </footer>
            </form>
        </section>
    );
}

export function FilterField({ label, children, className = "" }) {
    return (
        <label className={`mbn-filter__field ${className}`.trim()}>
            {label ? <span className="mbn-filter__label">{label}</span> : null}
            <span className="mbn-filter__control">{children}</span>
        </label>
    );
}

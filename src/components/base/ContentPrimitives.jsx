export function PrimaryTextCell({ title, description, className = "" }) {
    return (
        <div className={`mbn-primary-text-cell ${className}`.trim()}>
            <b>{title ?? "—"}</b>
            {description ? <small>{description}</small> : null}
        </div>
    );
}

export function StepHeading({ number, title, description, className = "" }) {
    return (
        <header className={`mbn-step-heading ${className}`.trim()}>
            {number !== undefined && number !== null ? (
                <span className="mbn-step-heading__index">{number}</span>
            ) : null}
            <div>
                <h2>{title}</h2>
                {description ? <p>{description}</p> : null}
            </div>
        </header>
    );
}

export function SurfacePanel({
    children,
    className = "",
    as: Component = "section",
    tone = "default",
}) {
    return (
        <Component
            className={`mbn-surface-panel mbn-surface-panel--${tone} ${className}`.trim()}
        >
            {children}
        </Component>
    );
}

export function RecordList({ children, className = "", ariaLabel }) {
    return (
        <div
            className={`mbn-record-list ${className}`.trim()}
            role="list"
            aria-label={ariaLabel}
        >
            {children}
        </div>
    );
}

export function RecordListItem({ children, className = "", unread = false }) {
    return (
        <article
            className={`mbn-record-list__item ${unread ? "is-unread" : ""} ${className}`.trim()}
            role="listitem"
        >
            {children}
        </article>
    );
}

export default function GamingButton({
    children,
    icon,
    variant = "secondary",
    size = "md",
    block = false,
    loading = false,
    className = "",
    type = "button",
    ...props
}) {
    const disabled = props.disabled || loading;
    return (
        <button
            type={type}
            className={`mbn-button mbn-button--${variant} mbn-button--${size}${block ? " mbn-button--block" : ""} ${className}`.trim()}
            aria-busy={loading || undefined}
            {...props}
            disabled={disabled}
        >
            {loading ? (
                <span className="mbn-button__spinner" aria-hidden="true" />
            ) : icon ? (
                <span className="mbn-button__icon">{icon}</span>
            ) : null}
            <span className="mbn-button__label">{children}</span>
        </button>
    );
}

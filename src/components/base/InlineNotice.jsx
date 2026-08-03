export default function InlineNotice({
    type = "info",
    title,
    children,
    description,
    supportCode,
    action,
    className = "",
}) {
    const rawContent = children ?? description;
    const content =
        rawContent && typeof rawContent === "object"
            ? rawContent.userMessage ||
              rawContent.message ||
              "Nội dung đang tạm thời không khả dụng."
            : rawContent;
    return (
        <section
            className={`mbn-inline-notice is-${type} ${className}`.trim()}
            role={type === "error" ? "alert" : "status"}
        >
            <span className="mbn-inline-notice__icon" aria-hidden="true">
                {type === "success"
                    ? "✓"
                    : type === "warning"
                      ? "!"
                      : type === "error"
                        ? "×"
                        : "i"}
            </span>
            <div className="mbn-inline-notice__content">
                {title ? <strong>{title}</strong> : null}
                {content ? <p>{content}</p> : null}
                {supportCode ? <small>Mã hỗ trợ: {supportCode}</small> : null}
            </div>
            {action ? (
                <button
                    type="button"
                    className="mbn-inline-notice__action"
                    onClick={action.onClick}
                >
                    {action.label}
                </button>
            ) : null}
        </section>
    );
}

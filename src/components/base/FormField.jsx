import { cloneElement, isValidElement, useId } from "react";

export default function FormField({
    label,
    hint,
    error,
    required = false,
    className = "",
    children,
}) {
    const generatedId = useId();
    const messageId = `${generatedId}-message`;
    const control = isValidElement(children)
        ? cloneElement(children, {
              invalid: Boolean(error) || children.props.invalid,
              "aria-describedby":
                  error || hint
                      ? messageId
                      : children.props["aria-describedby"],
          })
        : children;
    return (
        <label
            className={`mbn-form-field ${error ? "has-error" : ""} ${className}`.trim()}
        >
            <span className="mbn-form-field__label">
                {label}
                {required ? <i aria-hidden="true">*</i> : null}
            </span>
            <span className="mbn-form-field__control">{control}</span>
            {error ? (
                <small
                    id={messageId}
                    className="mbn-form-field__error"
                    role="alert"
                >
                    {error}
                </small>
            ) : hint ? (
                <small id={messageId} className="mbn-form-field__hint">
                    {hint}
                </small>
            ) : null}
        </label>
    );
}

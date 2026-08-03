import { forwardRef, useId } from "react";

const BaseChoice = forwardRef(function BaseChoice(
    {
        type = "checkbox",
        label,
        description = "",
        className = "",
        id,
        ...props
    },
    ref,
) {
    const generatedId = useId();
    const controlId = id || generatedId;
    return (
        <label className={`mbn-choice ${className}`.trim()} htmlFor={controlId}>
            <input
                ref={ref}
                className="mbn-choice__native"
                id={controlId}
                type={type}
                {...props}
            />
            <span className="mbn-choice__indicator" aria-hidden="true" />
            <span className="mbn-choice__content">
                <span className="mbn-choice__label">{label}</span>
                {description ? <small>{description}</small> : null}
            </span>
        </label>
    );
});

export default BaseChoice;

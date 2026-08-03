import { useEffect, useMemo, useState } from "react";

const digitsOnly = (value) => String(value ?? "").replace(/\D/g, "");
const formatDigits = (value) => {
    const numeric = Number(digitsOnly(value) || 0);
    return numeric ? new Intl.NumberFormat("vi-VN").format(numeric) : "";
};

export default function MoneyInput({
    value,
    onChange,
    min = 0,
    max,
    unit = "đ",
    placeholder = "Nhập số tiền",
    disabled = false,
    id,
    name,
    required = false,
    "aria-describedby": ariaDescribedBy,
}) {
    const normalized = useMemo(() => Number(value || 0), [value]);
    const [display, setDisplay] = useState(() => formatDigits(normalized));

    useEffect(() => {
        setDisplay(formatDigits(normalized));
    }, [normalized]);

    const commit = (raw) => {
        const digits = digitsOnly(raw);
        const next = digits ? Number(digits) : 0;
        const capped = Number.isFinite(max) ? Math.min(next, max) : next;
        setDisplay(formatDigits(capped));
        onChange?.(capped);
    };

    const onBlur = () => {
        if (!display) return;
        const next = Number(digitsOnly(display) || 0);
        if (next > 0 && next < min) {
            setDisplay(formatDigits(min));
            onChange?.(min);
        }
    };

    return (
        <div className={`money-input ${disabled ? "is-disabled" : ""}`}>
            <input
                className="mbn-control mbn-control--money"
                id={id}
                name={name}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={display}
                onChange={(event) => commit(event.target.value)}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                aria-describedby={ariaDescribedBy}
            />
            <span aria-hidden="true">{unit}</span>
        </div>
    );
}

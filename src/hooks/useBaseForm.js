import { useCallback, useState } from "react";

export default function useBaseForm(initialValues, validate) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const setValue = useCallback((name, value) => {
        setValues((current) => ({ ...current, [name]: value }));
        setErrors((current) => {
            if (!current[name]) return current;
            const next = { ...current };
            delete next[name];
            return next;
        });
    }, []);

    const reset = useCallback(
        (nextValues = initialValues) => {
            setValues(nextValues);
            setErrors({});
        },
        [initialValues],
    );

    const validateAll = useCallback(() => {
        const nextErrors = validate ? validate(values) : {};
        setErrors(nextErrors || {});
        return !nextErrors || Object.keys(nextErrors).length === 0;
    }, [validate, values]);

    return {
        values,
        setValues,
        errors,
        setErrors,
        setValue,
        reset,
        validateAll,
    };
}

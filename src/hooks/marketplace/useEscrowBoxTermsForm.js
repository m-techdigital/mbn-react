import { useCallback, useEffect, useMemo, useState } from "react";

import useBaseForm from "../useBaseForm";
import { showToast } from "../../utils/toast";
import { escrowBoxRepository } from "../../services/repositories/marketplace";
import {
    applyValidationError,
    clearFieldError,
} from "../../utils/formValidation";
import {
    buildEscrowBoxPayload,
    createEscrowBoxValues,
    escrowBoxValuesFromRecord,
    validateEscrowBoxValues,
} from "./escrowBoxFormModel";

export function useEscrowBoxTermsForm(id) {
    const initialValues = useMemo(
        () => ({
            ...createEscrowBoxValues(),
            expected_version: null,
            change_note: "",
        }),
        [],
    );
    const form = useBaseForm(initialValues, validateEscrowBoxValues);
    const { reset } = form;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const box = await escrowBoxRepository.show(id);
            reset(escrowBoxValuesFromRecord(box));
            setLoaded(true);
        } catch (requestError) {
            setError(
                requestError?.response?.data?.message ||
                    requestError.message ||
                    "Không thể tải điều khoản Box.",
            );
        } finally {
            setLoading(false);
        }
    }, [id, reset]);

    useEffect(() => {
        load();
    }, [load]);

    const update = (name, value) => {
        form.setValue(name, value);
        if (name === "deal_type" && value === "exchange") {
            form.setValues((current) => ({
                ...current,
                deal_type: value,
                topup_amount: "",
                topup_payer_side: "party_b",
            }));
            clearFieldError(form.setErrors, "topup_amount");
            clearFieldError(form.setErrors, "topup_payer_side");
        }
    };

    const updateAsset = (side, name, value) => {
        form.setValues((current) => ({
            ...current,
            [side]: { ...current[side], [name]: value },
        }));
        clearFieldError(form.setErrors, `${side}.${name}`);
    };

    const submit = async (event) => {
        event.preventDefault();
        setError("");
        if (!form.validateAll()) {
            setError("Vui lòng kiểm tra các trường được đánh dấu.");
            return;
        }

        setSaving(true);
        try {
            const updatedBox = await escrowBoxRepository.updateTerms(
                id,
                buildEscrowBoxPayload(form.values),
            );
            reset(escrowBoxValuesFromRecord(updatedBox));
            showToast("success", "Đã cập nhật Box giao dịch trung gian.");
        } catch (requestError) {
            const result = applyValidationError(
                requestError,
                form.setErrors,
                "Không thể lưu điều khoản. Vui lòng kiểm tra các trường được đánh dấu.",
            );
            setError(
                Object.keys(result.errors).length
                    ? result.message
                    : requestError?.response?.data?.message ||
                          requestError.message ||
                          "Không thể lưu điều khoản.",
            );
        } finally {
            setSaving(false);
        }
    };

    return {
        data: form.values,
        errors: form.errors,
        loading,
        saving,
        loaded,
        error,
        update,
        updateAsset,
        submit,
        retry: load,
    };
}

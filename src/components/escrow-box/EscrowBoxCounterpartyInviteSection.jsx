import { useMemo, useState } from "react";

import useBaseForm from "../../hooks/useBaseForm";
import { applyValidationError } from "../../utils/formValidation";
import BaseForm, { BaseFormActions } from "../base/BaseForm";
import { BaseInput } from "../base/FormControls";
import FormField from "../base/FormField";
import GamingButton from "../base/GamingButton";
import InlineNotice from "../base/InlineNotice";
import PageSection from "../base/PageSection";

const validate = ({ phone }) =>
    String(phone || "").trim()
        ? {}
        : { phone: "Vui lòng nhập số điện thoại Bên B." };

export default function EscrowBoxCounterpartyInviteSection({
    onResolve,
    onInvite,
    loading = false,
}) {
    const initialValues = useMemo(() => ({ phone: "" }), []);
    const form = useBaseForm(initialValues, validate);
    const [candidate, setCandidate] = useState(null);
    const [message, setMessage] = useState("");
    const [searching, setSearching] = useState(false);

    const search = async (event) => {
        event.preventDefault();
        setMessage("");
        setCandidate(null);
        if (!form.validateAll()) return;
        setSearching(true);
        try {
            const response = await onResolve(form.values.phone);
            setCandidate(response);
        } catch (requestError) {
            const result = applyValidationError(
                requestError,
                form.setErrors,
                "Không tìm thấy khách hàng phù hợp với số điện thoại này.",
            );
            setMessage(result.message);
        } finally {
            setSearching(false);
        }
    };

    const invite = async () => {
        if (!candidate?.candidate_token) return;
        setMessage("");
        try {
            await onInvite(candidate.candidate_token);
            form.reset();
            setCandidate(null);
            setMessage("Đã gửi lời mời trong hệ thống cho Bên B.");
        } catch (requestError) {
            const result = applyValidationError(
                requestError,
                form.setErrors,
                "Không thể gửi lời mời. Vui lòng tìm lại khách hàng.",
            );
            setMessage(result.message);
        }
    };

    return (
        <PageSection
            title="Tìm và mời Bên B"
            description="Nhập đúng số điện thoại Bên B đã chủ động cung cấp. Hệ thống chỉ hiển thị thông tin đã che để bạn xác nhận trước khi gửi lời mời."
        >
            <BaseForm onSubmit={search}>
                {message ? <InlineNotice type="info">{message}</InlineNotice> : null}
                <FormField
                    label="Số điện thoại Bên B"
                    error={form.errors.phone}
                    required
                >
                    <BaseInput
                        type="tel"
                        value={form.values.phone}
                        onChange={(event) => {
                            form.setValue("phone", event.target.value);
                            setCandidate(null);
                        }}
                        placeholder="Nhập số điện thoại đã đăng ký"
                    />
                </FormField>
                <BaseFormActions align="end">
                    <GamingButton
                        type="submit"
                        variant="primary"
                        loading={searching}
                    >
                        Tìm khách hàng
                    </GamingButton>
                </BaseFormActions>
            </BaseForm>

            {candidate?.candidate ? (
                <div className="escrow-box-candidate-card">
                    <div>
                        <strong>{candidate.candidate.label}</strong>
                        <p>{candidate.candidate.phone_hint} · {candidate.candidate.status_label}</p>
                    </div>
                    <GamingButton
                        type="button"
                        variant="primary"
                        loading={loading}
                        onClick={invite}
                    >
                        Chọn và gửi lời mời
                    </GamingButton>
                </div>
            ) : null}
        </PageSection>
    );
}

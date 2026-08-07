import { useNavigate, useParams } from "react-router";

import BaseForm, {
    BaseFormGrid,
    BaseFormSection,
} from "../components/base/BaseForm";
import {
    BaseInput,
    BaseSelect,
    BaseTextarea,
} from "../components/base/FormControls";
import FormField from "../components/base/FormField";
import GamingButton from "../components/base/GamingButton";
import InlineNotice from "../components/base/InlineNotice";
import MoneyInput from "../components/base/MoneyInput";
import PageShell from "../components/base/PageShell";
import EscrowBoxAssetFields from "../components/escrow-box/EscrowBoxAssetFields";
import { useEscrowBoxTermsForm } from "../hooks/marketplace/useEscrowBoxTermsForm";

export default function EscrowBoxTermsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const form = useEscrowBoxTermsForm(id);

    if (!form.loaded) {
        return (
            <PageShell title="Cập nhật Box">
                {form.error ? (
                    <InlineNotice type="error">{form.error}</InlineNotice>
                ) : null}
                <p>{form.loading ? "Đang tải..." : "Không thể tải điều khoản."}</p>
                {!form.loading ? (
                    <GamingButton onClick={form.retry}>Tải lại</GamingButton>
                ) : null}
            </PageShell>
        );
    }

    return (
        <PageShell
            title="Cập nhật Box giao dịch"
            description="Mỗi thay đổi tạo phiên bản mới và hủy xác nhận trước đó của cả hai bên."
        >
            <BaseForm id="escrow-box-update-form" onSubmit={form.submit}>
                {form.error ? (
                    <InlineNotice type="error">{form.error}</InlineNotice>
                ) : null}
                <EscrowBoxAssetFields
                    asset={form.data.party_a_asset}
                    fieldPrefix="party_a_asset"
                    title="Tài sản Bên A"
                    errors={form.errors}
                    onChange={(name, value) =>
                        form.updateAsset("party_a_asset", name, value)
                    }
                />
                <EscrowBoxAssetFields
                    asset={form.data.party_b_asset}
                    fieldPrefix="party_b_asset"
                    title="Tài sản Bên B"
                    errors={form.errors}
                    onChange={(name, value) =>
                        form.updateAsset("party_b_asset", name, value)
                    }
                />

                <BaseFormSection title="Tiền và điều kiện">
                    <BaseFormGrid>
                        <FormField
                            label="Loại giao dịch"
                            required
                            error={form.errors.deal_type}
                        >
                            <BaseSelect
                                value={form.data.deal_type}
                                onChange={(event) =>
                                    form.update("deal_type", event.target.value)
                                }
                            >
                                <option value="exchange">Trao đổi ngang</option>
                                <option value="exchange_with_topup">
                                    Trao đổi có bù
                                </option>
                            </BaseSelect>
                        </FormField>
                        {form.data.deal_type === "exchange_with_topup" ? (
                            <>
                                <FormField
                                    label="Bên bù tiền"
                                    required
                                    error={form.errors.topup_payer_side}
                                >
                                    <BaseSelect
                                        value={form.data.topup_payer_side}
                                        onChange={(event) =>
                                            form.update(
                                                "topup_payer_side",
                                                event.target.value,
                                            )
                                        }
                                    >
                                        <option value="party_a">Bên A</option>
                                        <option value="party_b">Bên B</option>
                                    </BaseSelect>
                                </FormField>
                                <FormField
                                    label="Số tiền bù"
                                    required
                                    error={form.errors.topup_amount}
                                >
                                    <MoneyInput
                                        min={1000}
                                        value={form.data.topup_amount}
                                        onChange={(value) =>
                                            form.update("topup_amount", value)
                                        }
                                    />
                                </FormField>
                            </>
                        ) : null}
                        <FormField
                            label="Bên chịu phí"
                            required
                            error={form.errors.fee_payer_mode}
                        >
                            <BaseSelect
                                value={form.data.fee_payer_mode}
                                onChange={(event) =>
                                    form.update(
                                        "fee_payer_mode",
                                        event.target.value,
                                    )
                                }
                            >
                                <option value="party_a">Bên A</option>
                                <option value="party_b">Bên B</option>
                                <option value="split_equal">Chia đều</option>
                            </BaseSelect>
                        </FormField>
                        <FormField
                            label="Thời gian kiểm tra (phút)"
                            required
                            error={form.errors.inspection_period_minutes}
                        >
                            <BaseInput
                                type="number"
                                min="15"
                                max="1440"
                                value={form.data.inspection_period_minutes}
                                onChange={(event) =>
                                    form.update(
                                        "inspection_period_minutes",
                                        event.target.value,
                                    )
                                }
                            />
                        </FormField>
                        <FormField
                            label="Điều kiện thành công"
                            required
                            className="is-wide"
                            error={form.errors.success_conditions}
                        >
                            <BaseTextarea
                                rows="4"
                                value={form.data.success_conditions}
                                onChange={(event) =>
                                    form.update(
                                        "success_conditions",
                                        event.target.value,
                                    )
                                }
                            />
                        </FormField>
                        <FormField
                            label="Điều kiện hủy"
                            className="is-wide"
                            error={form.errors.cancellation_conditions}
                        >
                            <BaseTextarea
                                rows="3"
                                value={form.data.cancellation_conditions}
                                onChange={(event) =>
                                    form.update(
                                        "cancellation_conditions",
                                        event.target.value,
                                    )
                                }
                            />
                        </FormField>
                        <FormField
                            label="Điều khoản bổ sung"
                            className="is-wide"
                            error={form.errors.additional_terms}
                        >
                            <BaseTextarea
                                rows="3"
                                value={form.data.additional_terms}
                                onChange={(event) =>
                                    form.update(
                                        "additional_terms",
                                        event.target.value,
                                    )
                                }
                            />
                        </FormField>
                        <FormField
                            label="Lý do thay đổi"
                            className="is-wide"
                            error={form.errors.change_note}
                        >
                            <BaseTextarea
                                rows="2"
                                value={form.data.change_note}
                                onChange={(event) =>
                                    form.update("change_note", event.target.value)
                                }
                            />
                        </FormField>
                    </BaseFormGrid>
                </BaseFormSection>
            </BaseForm>
            <div
                className="escrow-box-page-actions"
                role="group"
                aria-label="Thao tác cập nhật Box"
            >
                <GamingButton type="button" onClick={() => navigate(-1)}>
                    Hủy
                </GamingButton>
                <GamingButton
                    type="submit"
                    form="escrow-box-update-form"
                    variant="primary"
                    loading={form.saving}
                >
                    Cập nhật
                </GamingButton>
            </div>
        </PageShell>
    );
}

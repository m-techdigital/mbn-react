import BaseForm, {
    BaseFormActions,
    BaseFormGrid,
    BaseFormSection,
} from "../components/base/BaseForm";
import FormField from "../components/base/FormField";
import { BaseInput, BaseSelect, BaseTextarea } from "../components/base/FormControls";
import GamingButton from "../components/base/GamingButton";
import InlineNotice from "../components/base/InlineNotice";
import MoneyInput from "../components/base/MoneyInput";
import EscrowBoxAssetFields from "../components/escrow-box/EscrowBoxAssetFields";
import PageShell from "../components/base/PageShell";
import { useEscrowBoxForm } from "../hooks/marketplace/useEscrowBoxForm";

export default function EscrowBoxCreatePage() {
    const form = useEscrowBoxForm();
    return (
        <PageShell
            title="Tạo Box giao dịch trung gian"
            description="Không đăng tin công khai. Sau khi tạo, bạn có thể mời Bên B bằng link dùng một lần hoặc số điện thoại họ đã chủ động cung cấp."
        >
            <BaseForm onSubmit={form.submit}>
                {form.error ? (
                    <InlineNotice type="error" title="Không thể tạo box">
                        {form.error}
                    </InlineNotice>
                ) : null}
                <EscrowBoxAssetFields
                    asset={form.data.party_a_asset}
                    fieldPrefix="party_a_asset"
                    title="Tài sản Bên A giao"
                    errors={form.errors}
                    onChange={(name, value) =>
                        form.updateAsset("party_a_asset", name, value)
                    }
                />
                <EscrowBoxAssetFields
                    asset={form.data.party_b_asset}
                    fieldPrefix="party_b_asset"
                    title="Tài sản Bên B dự kiến giao"
                    errors={form.errors}
                    onChange={(name, value) =>
                        form.updateAsset("party_b_asset", name, value)
                    }
                />
                <BaseFormSection title="Tiền bù và phí">
                    <BaseFormGrid>
                        <FormField
                            label="Loại giao dịch"
                            error={form.errors.deal_type}
                        >
                            <BaseSelect
                                value={form.data.deal_type}
                                onChange={(event) =>
                                    form.update(
                                        "deal_type",
                                        event.target.value,
                                    )
                                }
                            >
                                <option value="exchange">Trao đổi ngang</option>
                                <option value="exchange_with_topup">
                                    Trao đổi có bù tiền
                                </option>
                            </BaseSelect>
                        </FormField>
                        {form.data.deal_type === "exchange_with_topup" ? (
                            <>
                                <FormField
                                    label="Bên bù tiền"
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
                                    error={form.errors.topup_amount}
                                >
                                    <MoneyInput
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
                    </BaseFormGrid>
                </BaseFormSection>
                <BaseFormSection title="Điều kiện">
                    <BaseFormGrid>
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
                    </BaseFormGrid>
                </BaseFormSection>
                <BaseFormActions>
                    <GamingButton
                        type="submit"
                        variant="primary"
                        loading={form.loading}
                    >
                        Tạo box
                    </GamingButton>
                </BaseFormActions>
            </BaseForm>
        </PageShell>
    );
}

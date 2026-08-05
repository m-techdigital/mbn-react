import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BaseForm, {
    BaseFormActions,
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
import { escrowBoxRepository } from "../services/repositories/marketplace";

const deliveryMethods = [
    "email_transfer",
    "account_credentials",
    "in_game_trade",
    "redeem_code",
    "admin_observed",
    "other",
];

function AssetFields({ data, side, title, onChange }) {
    const asset = data[side];

    return (
        <BaseFormSection title={title}>
            <BaseFormGrid>
                <FormField label="Loại">
                    <BaseSelect
                        value={asset.type}
                        onChange={(event) =>
                            onChange(side, "type", event.target.value)
                        }
                    >
                        <option value="game_account">Tài khoản game</option>
                        <option value="item">Vật phẩm</option>
                        <option value="redeem_code">Mã kích hoạt</option>
                        <option value="other">Khác</option>
                    </BaseSelect>
                </FormField>
                <FormField label="Tên">
                    <BaseInput
                        value={asset.title}
                        onChange={(event) =>
                            onChange(side, "title", event.target.value)
                        }
                    />
                </FormField>
                <FormField label="Giá trị tham chiếu">
                    <MoneyInput
                        value={asset.reference_value}
                        onChange={(value) =>
                            onChange(side, "reference_value", value)
                        }
                    />
                </FormField>
                <FormField label="Phương thức">
                    <BaseSelect
                        value={asset.delivery_method}
                        onChange={(event) =>
                            onChange(
                                side,
                                "delivery_method",
                                event.target.value,
                            )
                        }
                    >
                        {deliveryMethods.map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </BaseSelect>
                </FormField>
                <FormField label="Mô tả" className="is-wide">
                    <BaseTextarea
                        rows="4"
                        value={asset.description}
                        onChange={(event) =>
                            onChange(side, "description", event.target.value)
                        }
                    />
                </FormField>
            </BaseFormGrid>
        </BaseFormSection>
    );
}

export default function EscrowBoxTermsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        escrowBoxRepository
            .show(id)
            .then((box) =>
                setData({
                    expected_version: box.expected_version,
                    deal_type: box.deal_type,
                    party_a_asset: box.agreement_terms.party_a_asset,
                    party_b_asset: box.agreement_terms.party_b_asset,
                    topup_payer_side: box.topup_payer_side || "party_b",
                    topup_amount: box.topup_amount || "",
                    fee_payer_mode: box.fee_payer_mode,
                    inspection_period_minutes: box.inspection_period_minutes,
                    success_conditions:
                        box.agreement_terms.success_conditions || "",
                    cancellation_conditions:
                        box.agreement_terms.cancellation_conditions || "",
                    additional_terms: box.agreement_terms.additional_terms || "",
                    change_note: "",
                }),
            )
            .catch((exception) =>
                setError(exception?.response?.data?.message || exception.message),
            )
            .finally(() => setLoading(false));
    }, [id]);

    const update = (name, value) =>
        setData((current) => ({ ...current, [name]: value }));

    const updateAsset = (side, name, value) =>
        setData((current) => ({
            ...current,
            [side]: { ...current[side], [name]: value },
        }));

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            await escrowBoxRepository.updateTerms(id, {
                ...data,
                topup_amount:
                    data.deal_type === "exchange_with_topup"
                        ? Number(data.topup_amount || 0)
                        : 0,
                inspection_period_minutes: Number(
                    data.inspection_period_minutes,
                ),
                party_a_asset: {
                    ...data.party_a_asset,
                    reference_value: Number(
                        data.party_a_asset.reference_value || 0,
                    ),
                },
                party_b_asset: {
                    ...data.party_b_asset,
                    reference_value: Number(
                        data.party_b_asset.reference_value || 0,
                    ),
                },
            });
            navigate(`/account/escrow-boxes/${id}`);
        } catch (exception) {
            setError(exception?.response?.data?.message || exception.message);
        } finally {
            setLoading(false);
        }
    };

    if (!data) {
        return (
            <PageShell title="Chỉnh sửa điều khoản">
                {error ? <InlineNotice type="error">{error}</InlineNotice> : null}
                <p>Đang tải...</p>
            </PageShell>
        );
    }

    return (
        <PageShell
            title="Chỉnh sửa điều khoản Box"
            description="Mỗi thay đổi tạo phiên bản mới và hủy xác nhận trước đó của cả hai bên."
        >
            <BaseForm onSubmit={submit}>
                {error ? <InlineNotice type="error">{error}</InlineNotice> : null}
                <AssetFields
                    data={data}
                    side="party_a_asset"
                    title="Tài sản Bên A"
                    onChange={updateAsset}
                />
                <AssetFields
                    data={data}
                    side="party_b_asset"
                    title="Tài sản Bên B"
                    onChange={updateAsset}
                />

                <BaseFormSection title="Tiền và điều kiện">
                    <BaseFormGrid>
                        <FormField label="Loại giao dịch">
                            <BaseSelect
                                value={data.deal_type}
                                onChange={(event) =>
                                    update("deal_type", event.target.value)
                                }
                            >
                                <option value="exchange">Trao đổi ngang</option>
                                <option value="exchange_with_topup">
                                    Trao đổi có bù
                                </option>
                            </BaseSelect>
                        </FormField>
                        {data.deal_type === "exchange_with_topup" ? (
                            <>
                                <FormField label="Bên bù">
                                    <BaseSelect
                                        value={data.topup_payer_side}
                                        onChange={(event) =>
                                            update(
                                                "topup_payer_side",
                                                event.target.value,
                                            )
                                        }
                                    >
                                        <option value="party_a">Bên A</option>
                                        <option value="party_b">Bên B</option>
                                    </BaseSelect>
                                </FormField>
                                <FormField label="Số tiền bù">
                                    <MoneyInput
                                        value={data.topup_amount}
                                        onChange={(value) =>
                                            update("topup_amount", value)
                                        }
                                    />
                                </FormField>
                            </>
                        ) : null}
                        <FormField label="Bên chịu phí">
                            <BaseSelect
                                value={data.fee_payer_mode}
                                onChange={(event) =>
                                    update("fee_payer_mode", event.target.value)
                                }
                            >
                                <option value="party_a">Bên A</option>
                                <option value="party_b">Bên B</option>
                                <option value="split_equal">Chia đều</option>
                            </BaseSelect>
                        </FormField>
                        <FormField label="Thời gian kiểm tra">
                            <BaseInput
                                type="number"
                                value={data.inspection_period_minutes}
                                onChange={(event) =>
                                    update(
                                        "inspection_period_minutes",
                                        event.target.value,
                                    )
                                }
                            />
                        </FormField>
                        <FormField label="Điều kiện thành công" className="is-wide">
                            <BaseTextarea
                                rows="4"
                                value={data.success_conditions}
                                onChange={(event) =>
                                    update("success_conditions", event.target.value)
                                }
                            />
                        </FormField>
                        <FormField label="Điều kiện hủy" className="is-wide">
                            <BaseTextarea
                                rows="3"
                                value={data.cancellation_conditions}
                                onChange={(event) =>
                                    update(
                                        "cancellation_conditions",
                                        event.target.value,
                                    )
                                }
                            />
                        </FormField>
                        <FormField label="Lý do thay đổi" className="is-wide">
                            <BaseTextarea
                                rows="2"
                                value={data.change_note}
                                onChange={(event) =>
                                    update("change_note", event.target.value)
                                }
                            />
                        </FormField>
                    </BaseFormGrid>
                </BaseFormSection>
                <BaseFormActions>
                    <GamingButton type="button" onClick={() => navigate(-1)}>
                        Hủy
                    </GamingButton>
                    <GamingButton type="submit" variant="primary" loading={loading}>
                        Lưu phiên bản mới
                    </GamingButton>
                </BaseFormActions>
            </BaseForm>
        </PageShell>
    );
}

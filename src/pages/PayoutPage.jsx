import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/base/PageShell";
import PageSection, {
    DefinitionGrid,
    MetricGrid,
    PageColumns,
    PageStack,
} from "../components/base/PageSection";
import BaseForm, { BaseFormActions } from "../components/base/BaseForm";
import FormField from "../components/base/FormField";
import MoneyInput from "../components/base/MoneyInput";
import GamingButton from "../components/base/GamingButton";
import StatusBadge from "../components/base/StatusBadge";
import ResponsiveDataTable from "../components/base/ResponsiveDataTable";
import { payoutRepository } from "../services/repositories";
import { showToast } from "../utils/toast";
import { getUserFacingError } from "../utils/userFacingError";
import { formatMoney } from "../utils/format";
import {
    BaseInput,
    BaseSelect,
    BaseTextarea,
} from "../components/base/FormControls";
import ImageUploadField from "../components/base/ImageUploadField";

export default function PayoutPage() {
    const [data, setData] = useState({
        wallet: {},
        verification: null,
        accounts: [],
        withdrawals: { data: [] },
    });
    const [busy, setBusy] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [verify, setVerify] = useState({
        document_type: "citizen_id",
        document_number: "",
        document_front: null,
        document_back: null,
        selfie: null,
    });
    const [account, setAccount] = useState({
        bank_code: "",
        bank_name: "",
        account_name: "",
        account_number: "",
        is_default: true,
    });
    const [withdraw, setWithdraw] = useState({
        payout_account_id: "",
        amount: "",
        note: "",
    });
    const load = async () => {
        setLoading(true);
        setLoadError("");
        try {
            setData(await payoutRepository.overview());
        } catch (e) {
            const message = getUserFacingError(
                e,
                "Không thể tải thông tin nhận tiền.",
            );
            setLoadError(message);
            showToast("error", message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        load();
    }, []);
    const verifiedAccounts = useMemo(
        () => data.accounts?.filter((x) => x.status === "verified") || [],
        [data.accounts],
    );
    const submit = async (type, fn, success = "Đã gửi yêu cầu.") => {
        setBusy(type);
        try {
            await fn();
            showToast("success", success);
            await load();
        } catch (e) {
            showToast("error", getUserFacingError(e, "Không thể gửi yêu cầu."));
        } finally {
            setBusy("");
        }
    };
    const columns = [
        { key: "code", title: "Mã yêu cầu", dataIndex: "code" },
        {
            key: "amount",
            title: "Số tiền yêu cầu",
            dataIndex: "amount",
            render: (v) => formatMoney(v),
        },
        {
            key: "net",
            title: "Thực nhận",
            dataIndex: "net_amount",
            render: (v) => formatMoney(v),
        },
        {
            key: "account",
            title: "Tài khoản nhận",
            render: (_, r) =>
                `${r.payout_account?.bank_name || ""} • ${r.payout_account?.account_number || ""}`,
        },
        {
            key: "status",
            title: "Trạng thái",
            dataIndex: "status",
            render: (v) => <StatusBadge status={v} />,
        },
        {
            key: "submitted_at",
            title: "Ngày gửi",
            dataIndex: "submitted_at",
            render: (v) => (v ? new Date(v).toLocaleString("vi-VN") : "—"),
        },
        {
            key: "actions",
            title: "Thao tác",
            render: (_, row) =>
                row.status === "submitted" ? (
                    <GamingButton
                        size="small"
                        variant="secondary"
                        loading={busy === `cancel-${row.id}`}
                        onClick={() =>
                            submit(
                                `cancel-${row.id}`,
                                () => payoutRepository.cancelWithdrawal(row.id),
                                "Đã hủy yêu cầu rút tiền.",
                            )
                        }
                    >
                        Hủy yêu cầu
                    </GamingButton>
                ) : (
                    "—"
                ),
        },
    ];
    const verificationStatus = data.verification?.status || "unverified";
    const journey = data.journey || {};
    const canWithdraw =
        journey.can_withdraw ??
        (verificationStatus === "verified" && verifiedAccounts.length > 0);
    return (
        <PageShell
            title="Nhận tiền và rút tiền"
            description="Hoàn tất xác minh, thiết lập tài khoản nhận và gửi yêu cầu rút theo từng bước."
            width="wide"
            className="payout-page"
            loading={loading}
            error={loadError}
            onReload={load}
            loadingVariant="detail"
        >
            <PageStack>
                <MetricGrid
                    items={[
                        {
                            label: "Số dư có thể rút",
                            value: formatMoney(
                                data.wallet?.available_balance || 0,
                            ),
                            description: "Số dư khả dụng hiện tại",
                        },
                        {
                            label: "Đang tạm giữ",
                            value: formatMoney(data.wallet?.held_balance || 0),
                            description:
                                "Chưa thể rút cho tới khi giao dịch hoàn tất",
                            tone: "warning",
                        },
                        {
                            label: "Hồ sơ người bán",
                            value: <StatusBadge status={verificationStatus} />,
                            description: canWithdraw
                                ? "Đủ điều kiện tạo yêu cầu rút"
                                : "Cần hoàn tất xác minh và tài khoản nhận",
                        },
                    ]}
                />
                {journey.latest_withdrawal?.status === "submitted" && (
                    <div className="payout-status-banner is-pending">
                        Yêu cầu rút tiền đang chờ Admin duyệt. Bạn chưa cần gửi
                        thêm yêu cầu mới.
                    </div>
                )}
                {journey.latest_withdrawal?.status === "approved" && (
                    <div className="payout-status-banner is-approved">
                        Yêu cầu đã được duyệt và đang chờ chi trả. Mã tham chiếu
                        sẽ hiển thị khi hoàn tất.
                    </div>
                )}
                {verificationStatus === "pending" && (
                    <div className="payout-status-banner is-pending">
                        Hồ sơ xác minh đang được kiểm tra. Bạn có thể chuẩn bị
                        tài khoản nhận tiền trong thời gian chờ.
                    </div>
                )}
                <PageSection
                    title="Lộ trình nhận tiền"
                    description={
                        journey.next_action?.label
                            ? `Việc tiếp theo: ${journey.next_action.label}`
                            : "Theo dõi điều kiện và trạng thái chi trả."
                    }
                >
                    <div className="payout-stepper">
                        {(journey.steps || []).length ? (
                            (journey.steps || []).map((step, index) => (
                                <span
                                    key={step.key}
                                    className={
                                        step.status === "completed"
                                            ? "is-done"
                                            : step.status === "current"
                                              ? "is-current"
                                              : "is-blocked"
                                    }
                                >
                                    <b>{index + 1}</b>
                                    <span>
                                        {step.label}
                                        <small>{step.detail}</small>
                                    </span>
                                </span>
                            ))
                        ) : (
                            <>
                                <span
                                    className={
                                        verificationStatus === "verified"
                                            ? "is-done"
                                            : "is-current"
                                    }
                                >
                                    <b>1</b>Xác minh danh tính
                                </span>
                                <span
                                    className={
                                        verifiedAccounts.length
                                            ? "is-done"
                                            : "is-current"
                                    }
                                >
                                    <b>2</b>Xác minh tài khoản nhận
                                </span>
                                <span
                                    className={canWithdraw ? "is-current" : ""}
                                >
                                    <b>3</b>Gửi yêu cầu rút
                                </span>
                            </>
                        )}
                    </div>
                    {!!journey.blocked_reasons?.length && (
                        <div className="payout-blocked-note">
                            <b>Điều kiện chưa hoàn tất</b>
                            {journey.blocked_reasons.map((reason) => (
                                <p key={reason}>{reason}</p>
                            ))}
                        </div>
                    )}
                </PageSection>
                <PageColumns ratio="balanced">
                    <PageStack>
                        <PageSection
                            title="1. Xác minh người bán"
                            description="Thông tin phải trùng khớp với chủ tài khoản ngân hàng."
                        >
                            <DefinitionGrid
                                items={[
                                    {
                                        label: "Trạng thái",
                                        value: (
                                            <StatusBadge
                                                status={verificationStatus}
                                            />
                                        ),
                                    },
                                    {
                                        label: "Phản hồi",
                                        value:
                                            data.verification?.review_note ||
                                            "Chưa có",
                                    },
                                ]}
                            />
                            {verificationStatus !== "verified" ? (
                                <BaseForm
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        submit(
                                            "verify",
                                            () =>
                                                payoutRepository.submitVerification(
                                                    verify,
                                                ),
                                            "Đã gửi hồ sơ xác minh.",
                                        );
                                    }}
                                >
                                    <FormField label="Loại giấy tờ">
                                        <BaseSelect
                                            value={verify.document_type}
                                            onChange={(e) =>
                                                setVerify((v) => ({
                                                    ...v,
                                                    document_type:
                                                        e.target.value,
                                                }))
                                            }
                                        >
                                            <option value="citizen_id">
                                                Căn cước công dân
                                            </option>
                                            <option value="passport">
                                                Hộ chiếu
                                            </option>
                                        </BaseSelect>
                                    </FormField>
                                    <FormField label="Số giấy tờ" required>
                                        <BaseInput
                                            value={verify.document_number}
                                            onChange={(e) =>
                                                setVerify((v) => ({
                                                    ...v,
                                                    document_number:
                                                        e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </FormField>
                                    <ImageUploadField
                                        label="Ảnh mặt trước"
                                        fileName={
                                            verify.document_front?.name || ""
                                        }
                                        value={
                                            verify.document_front
                                                ? URL.createObjectURL(
                                                      verify.document_front,
                                                  )
                                                : ""
                                        }
                                        onChange={(file) =>
                                            setVerify((v) => ({
                                                ...v,
                                                document_front: file,
                                            }))
                                        }
                                        hint="Ảnh rõ bốn góc, không lóa sáng."
                                    />
                                    <ImageUploadField
                                        label="Ảnh mặt sau"
                                        fileName={
                                            verify.document_back?.name || ""
                                        }
                                        value={
                                            verify.document_back
                                                ? URL.createObjectURL(
                                                      verify.document_back,
                                                  )
                                                : ""
                                        }
                                        onChange={(file) =>
                                            setVerify((v) => ({
                                                ...v,
                                                document_back: file,
                                            }))
                                        }
                                    />
                                    <ImageUploadField
                                        label="Ảnh chân dung cầm giấy tờ"
                                        fileName={verify.selfie?.name || ""}
                                        value={
                                            verify.selfie
                                                ? URL.createObjectURL(
                                                      verify.selfie,
                                                  )
                                                : ""
                                        }
                                        onChange={(file) =>
                                            setVerify((v) => ({
                                                ...v,
                                                selfie: file,
                                            }))
                                        }
                                        hint="Khuôn mặt và giấy tờ phải nhìn rõ."
                                    />
                                    <BaseFormActions>
                                        <GamingButton
                                            type="submit"
                                            loading={busy === "verify"}
                                        >
                                            Gửi hồ sơ xác minh
                                        </GamingButton>
                                    </BaseFormActions>
                                </BaseForm>
                            ) : null}
                        </PageSection>
                        <PageSection
                            title="2. Tài khoản nhận tiền"
                            description="Chỉ tài khoản đã xác minh mới được dùng để rút tiền."
                        >
                            <div className="payout-account-list">
                                {(data.accounts || []).map((x) => (
                                    <article key={x.id}>
                                        <strong>{x.bank_name}</strong>
                                        <span>{x.account_number}</span>
                                        <small>{x.account_name}</small>
                                        <StatusBadge status={x.status} />
                                    </article>
                                ))}
                            </div>
                            <BaseForm
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    submit(
                                        "account",
                                        () =>
                                            payoutRepository.addAccount(
                                                account,
                                            ),
                                        "Đã thêm tài khoản nhận tiền.",
                                    );
                                }}
                            >
                                <FormField label="Mã ngân hàng" required>
                                    <BaseInput
                                        value={account.bank_code}
                                        onChange={(e) =>
                                            setAccount((v) => ({
                                                ...v,
                                                bank_code:
                                                    e.target.value.toUpperCase(),
                                            }))
                                        }
                                        required
                                    />
                                </FormField>
                                <FormField label="Tên ngân hàng" required>
                                    <BaseInput
                                        value={account.bank_name}
                                        onChange={(e) =>
                                            setAccount((v) => ({
                                                ...v,
                                                bank_name: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </FormField>
                                <FormField label="Tên chủ tài khoản" required>
                                    <BaseInput
                                        value={account.account_name}
                                        onChange={(e) =>
                                            setAccount((v) => ({
                                                ...v,
                                                account_name:
                                                    e.target.value.toUpperCase(),
                                            }))
                                        }
                                        required
                                    />
                                </FormField>
                                <FormField label="Số tài khoản" required>
                                    <BaseInput
                                        value={account.account_number}
                                        onChange={(e) =>
                                            setAccount((v) => ({
                                                ...v,
                                                account_number: e.target.value,
                                            }))
                                        }
                                        required
                                        inputMode="numeric"
                                    />
                                </FormField>
                                <BaseFormActions>
                                    <GamingButton
                                        type="submit"
                                        loading={busy === "account"}
                                    >
                                        Thêm tài khoản
                                    </GamingButton>
                                </BaseFormActions>
                            </BaseForm>
                        </PageSection>
                    </PageStack>
                    <PageStack>
                        <PageSection
                            title="3. Tạo yêu cầu rút tiền"
                            description="Số tiền được tạm giữ ngay sau khi gửi để tránh chi tiêu trùng."
                        >
                            {!canWithdraw ? (
                                <div className="payout-blocked-note">
                                    Hoàn tất hai bước xác minh bên trái trước
                                    khi tạo yêu cầu rút tiền.
                                </div>
                            ) : null}
                            <BaseForm
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    submit(
                                        "withdraw",
                                        () =>
                                            payoutRepository.withdraw({
                                                ...withdraw,
                                                idempotency_key: `mbn-${Date.now()}`,
                                            }),
                                        "Đã gửi yêu cầu rút tiền.",
                                    );
                                }}
                            >
                                <FormField label="Tài khoản nhận" required>
                                    <BaseSelect
                                        value={withdraw.payout_account_id}
                                        onChange={(e) =>
                                            setWithdraw((v) => ({
                                                ...v,
                                                payout_account_id:
                                                    e.target.value,
                                            }))
                                        }
                                        required
                                    >
                                        <option value="">
                                            Chọn tài khoản đã xác minh
                                        </option>
                                        {verifiedAccounts.map((x) => (
                                            <option key={x.id} value={x.id}>
                                                {x.bank_name} •{" "}
                                                {x.account_number}
                                            </option>
                                        ))}
                                    </BaseSelect>
                                </FormField>
                                <FormField
                                    label="Số tiền rút"
                                    hint={`Tối thiểu 50.000 đ · Khả dụng ${formatMoney(data.wallet?.available_balance || 0)}`}
                                    required
                                >
                                    <MoneyInput
                                        value={withdraw.amount}
                                        onChange={(value) =>
                                            setWithdraw((v) => ({
                                                ...v,
                                                amount: value,
                                            }))
                                        }
                                    />
                                </FormField>
                                <FormField label="Ghi chú">
                                    <BaseTextarea
                                        value={withdraw.note}
                                        onChange={(e) =>
                                            setWithdraw((v) => ({
                                                ...v,
                                                note: e.target.value,
                                            }))
                                        }
                                    />
                                </FormField>
                                <BaseFormActions>
                                    <GamingButton
                                        type="submit"
                                        variant="primary"
                                        loading={busy === "withdraw"}
                                        disabled={!canWithdraw}
                                    >
                                        Gửi yêu cầu rút tiền
                                    </GamingButton>
                                </BaseFormActions>
                            </BaseForm>
                        </PageSection>
                        <PageSection
                            title="Lịch sử rút tiền"
                            description="Theo dõi số tiền yêu cầu, thực nhận và trạng thái xử lý."
                        >
                            <ResponsiveDataTable
                                columns={columns}
                                rows={data.withdrawals?.data || []}
                                rowKey="id"
                                minWidth={900}
                                emptyText="Chưa có yêu cầu rút tiền."
                            />
                        </PageSection>
                    </PageStack>
                </PageColumns>
            </PageStack>
        </PageShell>
    );
}

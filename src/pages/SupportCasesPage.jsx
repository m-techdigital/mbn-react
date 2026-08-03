import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/base/PageShell";
import PageSection, { PageStack } from "../components/base/PageSection";
import ResponsiveDataTable from "../components/base/ResponsiveDataTable";
import FormField from "../components/base/FormField";
import GamingButton from "../components/base/GamingButton";
import BaseForm from "../components/base/BaseForm";
import StatusBadge from "../components/base/StatusBadge";
import {
    marketplaceOperationsRepository,
    transactionRepository,
} from "../services/repositories";
import { showToast } from "../utils/toast";
import { getUserFacingError } from "../utils/userFacingError";
import {
    BaseInput,
    BaseSelect,
    BaseTextarea,
} from "../components/base/FormControls";
import { Link } from "react-router-dom";
import { valueLabel } from "../utils/labels";

const caseTypes = {
    support: "Hỗ trợ chung",
    cancellation: "Yêu cầu hủy",
    refund: "Yêu cầu hoàn tiền",
    handover_issue: "Vấn đề bàn giao",
    return_issue: "Vấn đề hoàn trả",
    payment_issue: "Vấn đề thanh toán",
    dispute: "Tranh chấp",
    appeal: "Khiếu nại kết quả",
};
export default function SupportCasesPage() {
    const [cases, setCases] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [busy, setBusy] = useState(false);
    const [form, setForm] = useState({
        transaction_id: "",
        case_type: "support",
        reason: "",
        description: "",
        priority: "normal",
    });
    const load = async () => {
        const [casePayload, transactionPayload] = await Promise.all([
            marketplaceOperationsRepository.cases(),
            transactionRepository.list({ per_page: 100 }),
        ]);
        setCases(casePayload?.data || casePayload || []);
        setTransactions(transactionPayload?.data || transactionPayload || []);
    };
    useEffect(() => {
        load().catch(() => {});
    }, []);
    const columns = useMemo(
        () => [
            {
                key: "code",
                title: "Mã",
                width: 150,
                render: (_, row) => <b>{row.code}</b>,
            },
            {
                key: "type",
                title: "Loại yêu cầu",
                width: 170,
                render: (_, row) => caseTypes[row.case_type] || row.case_type,
            },
            {
                key: "transaction",
                title: "Giao dịch",
                width: 150,
                render: (_, row) => row.transaction?.code || "—",
            },
            {
                key: "priority",
                title: "Ưu tiên",
                width: 110,
                render: (_, row) => valueLabel(row.priority, "Bình thường"),
            },
            {
                key: "status",
                title: "Trạng thái",
                width: 150,
                render: (_, row) => <StatusBadge status={row.status} />,
            },
            {
                key: "updated",
                title: "Cập nhật",
                width: 180,
                render: (_, row) =>
                    row.last_message_at
                        ? new Date(row.last_message_at).toLocaleString("vi-VN")
                        : "—",
            },
            {
                key: "action",
                title: "Chi tiết",
                width: 110,
                render: (_, row) => (
                    <Link
                        className="mbn-table-action"
                        to={`/account/cases/${row.id}`}
                    >
                        Xem
                    </Link>
                ),
            },
        ],
        [],
    );
    const submit = async (event) => {
        event.preventDefault();
        setBusy(true);
        try {
            await marketplaceOperationsRepository.openCase(
                form.transaction_id,
                form,
            );
            showToast("success", "Đã gửi yêu cầu hỗ trợ.");
            setForm({
                transaction_id: "",
                case_type: "support",
                reason: "",
                description: "",
                priority: "normal",
            });
            await load();
        } catch (error) {
            showToast(
                "error",
                getUserFacingError(error, "Không thể gửi yêu cầu."),
            );
        } finally {
            setBusy(false);
        }
    };
    return (
        <PageShell
            title="Trung tâm yêu cầu"
            description="Gửi và theo dõi yêu cầu hủy, hoàn tiền, hỗ trợ, bàn giao, hoàn trả hoặc tranh chấp."
            width="wide"
        >
            <PageStack>
                <PageSection
                    title="Gửi yêu cầu mới"
                    description="Chọn đúng giao dịch và loại yêu cầu để được xử lý nhanh hơn."
                >
                    <BaseForm className="mbn-form-stack" onSubmit={submit}>
                        <FormField label="Giao dịch" required>
                            <BaseSelect
                                required
                                value={form.transaction_id}
                                onChange={(event) =>
                                    setForm((value) => ({
                                        ...value,
                                        transaction_id: event.target.value,
                                    }))
                                }
                            >
                                <option value="">Chọn giao dịch</option>
                                {transactions.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.code} ·{" "}
                                        {item.product?.name || "Tài khoản"}
                                    </option>
                                ))}
                            </BaseSelect>
                        </FormField>
                        <FormField label="Loại yêu cầu" required>
                            <BaseSelect
                                value={form.case_type}
                                onChange={(event) =>
                                    setForm((value) => ({
                                        ...value,
                                        case_type: event.target.value,
                                    }))
                                }
                            >
                                {Object.entries(caseTypes).map(
                                    ([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ),
                                )}
                            </BaseSelect>
                        </FormField>
                        <FormField label="Tiêu đề / lý do" required>
                            <BaseInput
                                required
                                value={form.reason}
                                onChange={(event) =>
                                    setForm((value) => ({
                                        ...value,
                                        reason: event.target.value,
                                    }))
                                }
                            />
                        </FormField>
                        <FormField label="Mô tả chi tiết" required>
                            <BaseTextarea
                                required
                                value={form.description}
                                onChange={(event) =>
                                    setForm((value) => ({
                                        ...value,
                                        description: event.target.value,
                                    }))
                                }
                            />
                        </FormField>
                        <GamingButton
                            type="submit"
                            variant="primary"
                            block
                            loading={busy}
                        >
                            Gửi yêu cầu
                        </GamingButton>
                    </BaseForm>
                </PageSection>
                <PageSection
                    title="Các yêu cầu đã gửi"
                    description="Mỗi yêu cầu có một trang chi tiết riêng để theo dõi trao đổi và trạng thái."
                >
                    <ResponsiveDataTable
                        className="canonical-list-table support-cases-table"
                        caption="Danh sách yêu cầu hỗ trợ"
                        columns={columns}
                        rows={cases}
                        rowKey="id"
                        minWidth={920}
                        emptyText="Chưa có yêu cầu nào."
                    />
                </PageSection>
            </PageStack>
        </PageShell>
    );
}

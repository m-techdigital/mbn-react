import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../components/base/PageShell";
import PageSection, {
    DefinitionGrid,
    PageStack,
} from "../components/base/PageSection";
import BaseForm, { BaseFormActions } from "../components/base/BaseForm";
import FormField from "../components/base/FormField";
import { BaseTextarea } from "../components/base/FormControls";
import GamingButton from "../components/base/GamingButton";
import StatusBadge from "../components/base/StatusBadge";
import { marketplaceOperationsRepository } from "../services/repositories";
import { showToast } from "../utils/toast";
import { getUserFacingError } from "../utils/userFacingError";
import { valueLabel } from "../utils/labels";

const typeLabels = {
    support: "Hỗ trợ chung",
    cancellation: "Yêu cầu hủy",
    refund: "Yêu cầu hoàn tiền",
    handover_issue: "Vấn đề bàn giao",
    return_issue: "Vấn đề hoàn trả",
    payment_issue: "Vấn đề thanh toán",
    dispute: "Tranh chấp",
    appeal: "Khiếu nại kết quả",
};

export default function SupportCaseDetailPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    const load = useCallback(async () => {
        setLoading(true);
        try {
            setItem(await marketplaceOperationsRepository.caseDetail(id));
        } finally {
            setLoading(false);
        }
    }, [id]);
    useEffect(() => {
        load().catch(() => {});
    }, [load]);
    const submit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        setBusy(true);
        try {
            await marketplaceOperationsRepository.message(id, { message });
            setMessage("");
            showToast("success", "Đã gửi phản hồi.");
            await load();
        } catch (err) {
            showToast(
                "error",
                getUserFacingError(err, "Không thể gửi phản hồi."),
            );
        } finally {
            setBusy(false);
        }
    };
    return (
        <PageShell
            title={item?.code || "Chi tiết yêu cầu"}
            description="Theo dõi nội dung, trạng thái và trao đổi của yêu cầu."
            loading={loading}
            width="wide"
        >
            {item ? (
                <PageStack>
                    <PageSection
                        actions={
                            <Link to="/account/cases">← Danh sách yêu cầu</Link>
                        }
                    >
                        <DefinitionGrid
                            items={[
                                {
                                    label: "Loại yêu cầu",
                                    value:
                                        typeLabels[item.case_type] ||
                                        item.case_type,
                                },
                                {
                                    label: "Trạng thái",
                                    value: <StatusBadge status={item.status} />,
                                },
                                {
                                    label: "Giao dịch",
                                    value: item.transaction?.code || "—",
                                },
                                {
                                    label: "Mức ưu tiên",
                                    value: valueLabel(
                                        item.priority,
                                        "Bình thường",
                                    ),
                                },
                                { label: "Lý do", value: item.reason },
                                {
                                    label: "Hạn phản hồi dự kiến",
                                    value: item.due_at
                                        ? new Date(item.due_at).toLocaleString(
                                              "vi-VN",
                                          )
                                        : "—",
                                },
                            ]}
                        />
                        <div className="support-case-description">
                            <h3>Mô tả ban đầu</h3>
                            <p>{item.description}</p>
                        </div>
                    </PageSection>
                    <PageSection
                        title="Trao đổi"
                        description="Chỉ hiển thị nội dung trao đổi dành cho khách hàng."
                    >
                        <div className="support-case-thread">
                            {(item.messages || []).map((entry) => (
                                <article
                                    key={entry.id}
                                    className={`support-case-message is-${entry.actor_type}`}
                                >
                                    <header>
                                        <b>
                                            {entry.actor_type === "customer"
                                                ? "Khách hàng"
                                                : "Bộ phận hỗ trợ"}
                                        </b>
                                        <time>
                                            {new Date(
                                                entry.created_at,
                                            ).toLocaleString("vi-VN")}
                                        </time>
                                    </header>
                                    <p>{entry.message}</p>
                                </article>
                            ))}
                        </div>
                        <BaseForm onSubmit={submit}>
                            <FormField label="Phản hồi mới" required>
                                <BaseTextarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    rows={5}
                                />
                            </FormField>
                            <BaseFormActions>
                                <GamingButton type="submit" loading={busy}>
                                    Gửi phản hồi
                                </GamingButton>
                            </BaseFormActions>
                        </BaseForm>
                    </PageSection>
                </PageStack>
            ) : null}
        </PageShell>
    );
}

import PageSection, { DefinitionGrid } from "../base/PageSection";
import StatusBadge from "../base/StatusBadge";
import { formatMoney } from "../../utils/format";

const statusCopy = {
    submitted: "Tiền đang được tạm giữ và chờ Admin duyệt.",
    approved: "Yêu cầu đã được duyệt, tiền vẫn đang giữ cho tới khi xác nhận chi trả.",
    paid: "Yêu cầu đã được chi trả và số tiền đã rời số dư tạm giữ.",
    rejected: "Yêu cầu bị từ chối; tiền tạm giữ phải được hoàn về số dư khả dụng.",
    cancelled_by_customer: "Bạn đã hủy yêu cầu; tiền tạm giữ phải được hoàn về số dư khả dụng.",
};

export default function PayoutStatePanel({ withdrawal }) {
    if (!withdrawal) return null;

    return (
        <PageSection
            title="Trạng thái yêu cầu rút gần nhất"
            description={statusCopy[withdrawal.status] || "Theo dõi trạng thái xử lý và dòng tiền của yêu cầu."}
        >
            <DefinitionGrid
                items={[
                    { label: "Mã yêu cầu", value: withdrawal.code || "—" },
                    { label: "Trạng thái", value: <StatusBadge status={withdrawal.status} /> },
                    { label: "Số tiền yêu cầu", value: formatMoney(withdrawal.amount || 0) },
                    { label: "Phí", value: formatMoney(withdrawal.fee_amount || 0) },
                    { label: "Thực nhận", value: formatMoney(withdrawal.net_amount || 0) },
                    { label: "Tham chiếu chi trả", value: withdrawal.payment_reference || "Chưa có" },
                    { label: "Lý do/ghi chú", value: withdrawal.review_note || withdrawal.customer_note || "Chưa có" },
                ]}
            />
        </PageSection>
    );
}

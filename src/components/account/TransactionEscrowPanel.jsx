import PageSection, { DefinitionGrid } from "../base/PageSection";

const methodLabels = {
    account_credentials: "Thông tin đăng nhập qua kênh bảo mật",
    email_transfer: "Chuyển quyền email/liên kết",
    in_game_trade: "Giao dịch trực tiếp trong game",
    gift_code: "Mã quà tặng / mã vật phẩm",
};

export default function TransactionEscrowPanel({ transaction }) {
    const escrow = transaction?.journey?.escrow_handover || {};
    const agreement = transaction?.agreement_terms || {};
    if (!escrow.delivery_method) return null;

    return (
        <PageSection
            title="Bàn giao trung gian"
            description="Nền tảng giữ tiền cho đến khi tài sản số được bàn giao, kiểm tra và xác nhận theo đúng luồng giao dịch."
        >
            <DefinitionGrid
                items={[
                    { label: "Nguồn giao dịch", value: transaction?.initiation_source === "escrow_box" ? "Box giao dịch trung gian" : "Từ tin đăng" },
                    { label: "Trạng thái thỏa thuận", value: transaction?.agreement_status || "Đã chấp nhận" },
                    { label: "Tài sản thỏa thuận", value: agreement.asset_title || transaction?.product?.name || "—" },
                    { label: "Phương thức bàn giao", value: methodLabels[escrow.delivery_method] || escrow.delivery_method },
                    { label: "Thời gian kiểm tra", value: `${escrow.inspection_period_minutes || 30} phút` },
                    { label: "Hạn kiểm tra", value: escrow.inspection_deadline_at ? new Date(escrow.inspection_deadline_at).toLocaleString("vi-VN") : "Chưa bắt đầu" },
                    { label: "Biên bản trước bàn giao", value: escrow.requires_pre_handover_snapshot ? "Bắt buộc" : "Không bắt buộc" },
                    { label: "Hướng dẫn bàn giao", value: escrow.seller_delivery_note || "Chưa có" },
                    { label: "Ghi chú kiểm tra", value: escrow.buyer_inspection_note || "Chưa có" },
                ]}
            />
            <p className="muted-text">Không gửi mật khẩu, mã OTP hoặc mã khôi phục trong ghi chú công khai của giao dịch.</p>
        </PageSection>
    );
}

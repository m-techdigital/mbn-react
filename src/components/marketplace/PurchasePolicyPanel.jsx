export default function PurchasePolicyPanel({ purchaseTab }) {
    if (purchaseTab === "installment") {
        return (
            <div className="purchase-policy">
                <h3>QUY ĐỊNH MUA TRẢ GÓP</h3>
                <p>
                    - Số tiền thanh toán ban đầu và phần còn lại được hiển thị
                    ngay trong bảng thông tin giao dịch.
                </p>
                <p>
                    - Hệ thống tạo từng kỳ thanh toán cùng hạn cụ thể sau khi
                    giao dịch được xác nhận.
                </p>
                <p>
                    - Việc bàn giao chỉ mở khi giao dịch đạt điều kiện thanh
                    toán theo kế hoạch đã phát hành.
                </p>
                <p>
                    - Khi hủy, quá hạn hoặc phát sinh tranh chấp, số tiền hoàn
                    hoặc giữ lại được tính theo trạng thái thực tế và chứng từ
                    giao dịch; không áp dụng tỷ lệ cố định ngoài hợp đồng.
                </p>
                <div className="purchase-policy__note">
                    Mở trang chi tiết giao dịch để theo dõi từng kỳ, hạn thanh
                    toán, số đã trả và số còn lại.
                </div>
            </div>
        );
    }

    if (purchaseTab === "deposit") {
        return (
            <div className="purchase-policy">
                <h3>QUY ĐỊNH ĐẶT CỌC</h3>
                <p>
                    - Tiền cọc và số tiền còn lại được hiển thị rõ trước khi
                    tạo giao dịch.
                </p>
                <p>
                    - Hạn thanh toán phần còn lại được phát hành cùng kế hoạch
                    thanh toán của giao dịch.
                </p>
                <p>
                    - Việc hoàn, giữ hoặc khấu trừ tiền cọc phụ thuộc trạng
                    thái giao dịch, thỏa thuận và bằng chứng đã ghi nhận.
                </p>
                <div className="purchase-policy__note">
                    Không chuyển tiền ngoài số tiền, nội dung và hướng dẫn do
                    hệ thống tạo cho giao dịch.
                </div>
            </div>
        );
    }

    return null;
}

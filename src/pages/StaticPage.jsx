import { useLocation } from "react-router";
import PageShell from "../components/base/PageShell";
import InlineNotice from "../components/base/InlineNotice";
import PageSection, { PageStack } from "../components/base/PageSection";

const pages = {
    "/guides/huong-dan-mua-nick": {
        title: "Hướng dẫn mua hoặc thuê nick",
        intro: "Thực hiện đúng các bước dưới đây để giao dịch được ghi nhận và hỗ trợ đầy đủ.",
        sections: [
            [
                "Bước 1 — Đăng nhập hoặc đăng ký",
                "Đăng nhập bằng tài khoản khách hàng. Kiểm tra họ tên, số điện thoại và email để nhận thông báo giao dịch.",
            ],
            [
                "Bước 2 — Nạp tiền",
                "Nạp tiền qua ATM hoặc MOMO và chuyển đúng nội dung hệ thống cung cấp. Không chuyển tiền theo nội dung do người lạ gửi.",
            ],
            [
                "Bước 3 — Chọn tài khoản",
                "Mở đúng danh mục game, dùng bộ lọc để chọn nick. Kiểm tra mã nick, máy chủ, cấp độ, giá, tiền cọc và loại giao dịch bán hoặc cho thuê.",
            ],
            [
                "Bước 4 — Xác nhận giao dịch",
                "Đọc kỹ mô tả và điều kiện bàn giao. Với giao dịch thuê, kiểm tra thời hạn thuê, tiền cọc, quy định hoàn trả và phí quá hạn.",
            ],
            [
                "Bước 5 — Nhận và kiểm tra",
                "Theo dõi lịch sử mua/thuê. Sau khi nhận tài khoản, kiểm tra ngay thông tin và đổi mật khẩu khi được phép.",
            ],
        ],
        note: "Nếu trạng thái không thay đổi hoặc thông tin nhận nick chưa được cập nhật, hãy giữ nguyên giao dịch và liên hệ hỗ trợ. Không tự ý giao dịch ngoài hệ thống.",
    },
    "/services/giao-dich-trung-gian": {
        title: "Giao dịch trung gian",
        intro: "Hỗ trợ hai bên xác nhận sản phẩm, thanh toán và bàn giao minh bạch.",
        sections: [
            [
                "Quy trình",
                "Hai bên gửi thông tin giao dịch, hệ thống xác nhận điều kiện, ghi nhận thanh toán và theo dõi bàn giao.",
            ],
            [
                "Phí dịch vụ",
                "Phí phụ thuộc giá trị, độ phức tạp và thời gian hỗ trợ. Mức phí cuối cùng phải được hiển thị trước khi xác nhận.",
            ],
            [
                "Bảo mật",
                "Không cung cấp OTP, mật khẩu email hoặc mã khôi phục cho người không có thẩm quyền.",
            ],
        ],
        note: "Phí dịch vụ và phạm vi hỗ trợ phải được hiển thị rõ trong từng giao dịch trước khi người dùng xác nhận.",
    },
    "/services/mua-ban-xu-ninja-school": {
        title: "Mua bán xu Ninja School",
        intro: "Chọn gói xu, nhập đúng máy chủ và tên nhân vật nhận.",
        sections: [
            [
                "Kiểm tra thông tin",
                "Đối chiếu đúng server, tên nhân vật và số lượng xu.",
            ],
            [
                "Thời gian xử lý",
                "Giao dịch được xử lý theo trạng thái và khung giờ dịch vụ.",
            ],
            [
                "Lịch sử",
                "Mọi giao dịch phải xuất hiện trong lịch sử tài khoản khách hàng.",
            ],
        ],
        note: "Không hỗ trợ hoàn lại khi người dùng nhập sai thông tin nhận.",
    },
    "/services/nap-luong-carrot": {
        title: "Nạp lượng và Carrot",
        intro: "Chọn gói nạp và kiểm tra kỹ thông tin nhân vật trước khi thanh toán.",
        sections: [
            [
                "Chọn gói",
                "Mỗi gói hiển thị số lượng, giá và thời gian xử lý dự kiến.",
            ],
            [
                "Xác nhận",
                "Kiểm tra tên nhân vật, máy chủ và nội dung đơn hàng.",
            ],
            [
                "Hỗ trợ",
                "Liên hệ hỗ trợ nếu quá thời gian dự kiến mà trạng thái chưa hoàn tất.",
            ],
        ],
        note: "Không hỗ trợ hoàn tiền hoặc nạp lại khi thông tin nhận do khách hàng cung cấp bị sai.",
    },
    "/account/wallet/deposit/bank": {
        title: "Nạp tiền qua ATM — MOMO",
        intro: "Tạo yêu cầu nạp và chuyển khoản đúng thông tin được hiển thị.",
        sections: [
            [
                "Nội dung chuyển khoản",
                "Dùng đúng mã khách hàng hoặc mã yêu cầu nạp. Không thêm ký tự lạ.",
            ],
            [
                "Đối soát",
                "Số dư cập nhật sau khi hệ thống nhận và khớp giao dịch.",
            ],
            [
                "Lịch sử nạp",
                "Kiểm tra biến động số dư và giữ lại ảnh giao dịch ngân hàng khi cần hỗ trợ.",
            ],
        ],
        note: "Chỉ sử dụng thông tin chuyển khoản được tạo bên trong yêu cầu nạp tiền. Không chuyển khoản theo thông tin gửi riêng ngoài hệ thống.",
    },
    "/dieu-khoan-va-chinh-sach": {
        title: "Điều khoản và chính sách",
        intro: "Quy định chung khi sử dụng dịch vụ mua bán và thuê tài khoản.",
        sections: [
            [
                "Trách nhiệm người dùng",
                "Kiểm tra sản phẩm, giá, điều kiện bàn giao và thông tin đối tác trước khi xác nhận.",
            ],
            [
                "An toàn tài khoản",
                "Không chia sẻ mật khẩu, OTP hoặc mã khôi phục. Đổi thông tin bảo mật sau khi nhận nếu hợp đồng cho phép.",
            ],
            [
                "Hoàn tiền và tranh chấp",
                "Yêu cầu hoàn tiền hoặc tranh chấp được xử lý theo trạng thái giao dịch, bằng chứng và điều khoản đã xác nhận.",
            ],
            [
                "Giao dịch thuê",
                "Người thuê phải hoàn trả đúng hạn, đúng hiện trạng; các khoản cọc hoặc khấu trừ được xử lý theo hợp đồng thuê.",
            ],
        ],
        note: "Điều khoản áp dụng theo phiên bản được người dùng xác nhận tại thời điểm giao dịch và các quy định pháp luật bắt buộc đang có hiệu lực.",
    },
};

export default function StaticPage() {
    const l = useLocation();
    const page = pages[l.pathname] || {
        title: "Nội dung đang cập nhật",
        intro: "Màn hình đã sẵn sàng để kết nối API.",
        sections: [],
        note: "",
    };
    return (
        <PageShell title={page.title} description={page.intro} width="reading">
            <PageStack className="guide-content">
                {page.sections.map(([title, text], index) => (
                    <PageSection className="guide-box" key={title}>
                        <div className="guide-step">
                            {String(index + 1).padStart(2, "0")}
                        </div>
                        <div>
                            <h2>{title}</h2>
                            <p>{text}</p>
                        </div>
                    </PageSection>
                ))}
                {page.note && (
                    <InlineNotice type="warning" title="Lưu ý quan trọng">
                        {page.note}
                    </InlineNotice>
                )}
                <PageSection className="guide-support" tone="subtle">
                    <p>
                        Hỗ trợ: Zalo 0961646828 · Chỉ giao dịch qua kênh chính
                        thức của hệ thống.
                    </p>
                </PageSection>
            </PageStack>
        </PageShell>
    );
}

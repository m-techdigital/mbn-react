import {
    BellOutlined,
    CustomerServiceOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import GamingModal, { ModalFooterNote } from "../base/GamingModal";

const SNOOZE_KEY = "mbn_admin_notice_snooze_until";

const notices = [
    {
        title: "Chỉ thanh toán trong đơn hàng",
        description:
            "Không chuyển tiền theo số tài khoản hoặc mã QR được gửi riêng qua tin nhắn. Hãy mở đúng đơn giao dịch để lấy thông tin thanh toán.",
    },
    {
        title: "Không cung cấp mã bảo mật",
        description:
            "MBN và người bán không yêu cầu OTP, mã dự phòng 2FA, mật khẩu email, cookie đăng nhập hoặc quyền điều khiển thiết bị.",
    },
    {
        title: "Kiểm tra trước khi xác nhận hoàn tất",
        description:
            "Hãy đối chiếu máy chủ, nhân vật, vật phẩm, liên kết bảo mật và quay lại quá trình bàn giao nếu giao dịch có giá trị cao.",
    },
];

export default function AdminNotice() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const snoozeUntil = Number(
            window.localStorage.getItem(SNOOZE_KEY) || 0,
        );
        if (snoozeUntil > Date.now()) return undefined;
        const timer = window.setTimeout(() => setOpen(true), 650);
        return () => window.clearTimeout(timer);
    }, []);

    const closeForTwoHours = () => {
        window.localStorage.setItem(
            SNOOZE_KEY,
            String(Date.now() + 2 * 60 * 60 * 1000),
        );
        setOpen(false);
    };

    return (
        <>
            <button
                type="button"
                className="admin-notice-trigger"
                onClick={() => setOpen(true)}
            >
                <BellOutlined />
                <span>Thông báo an toàn giao dịch</span>
                <b>{notices.length}</b>
            </button>
            <GamingModal
                open={open}
                title="LƯU Ý TRƯỚC KHI GIAO DỊCH"
                onClose={() => setOpen(false)}
                width={480}
                className="admin-info-modal notice-safety-modal"
                footer={
                    <>
                        <ModalFooterNote>
                            Thông tin thanh toán chỉ hiển thị trong từng đơn
                            hàng.
                        </ModalFooterNote>
                        <button
                            type="button"
                            className="modal-button modal-button--muted"
                            onClick={closeForTwoHours}
                        >
                            Ẩn 2 giờ
                        </button>
                    </>
                }
            >
                <div className="notice-safety-hero">
                    <span>
                        <SafetyCertificateOutlined />
                    </span>
                    <div>
                        <strong>Giao dịch đúng quy trình để được hỗ trợ</strong>
                        <p>
                            Không giao dịch ngoài hệ thống, không gửi mã bảo mật
                            và không xác nhận hoàn tất khi chưa kiểm tra đủ
                            thông tin.
                        </p>
                    </div>
                </div>

                <div className="notice-safety-list">
                    {notices.map((item, index) => (
                        <article key={item.title}>
                            <span>{index + 1}</span>
                            <div>
                                <strong>{item.title}</strong>
                                <p>{item.description}</p>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="notice-safety-actions">
                    <Link
                        to="/policies/an-toan-tai-khoan"
                        onClick={() => setOpen(false)}
                    >
                        Xem trung tâm an toàn
                    </Link>
                    <a
                        href="https://zalo.me/0961646828"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <CustomerServiceOutlined /> Liên hệ hỗ trợ
                    </a>
                </div>

                <p className="notice-safety-footnote">
                    MBN không tự động gọi điện yêu cầu chuyển tiền, cài ứng dụng
                    hoặc đọc mã OTP. Khi nghi ngờ, hãy dừng giao dịch và mở yêu
                    cầu hỗ trợ.
                </p>
            </GamingModal>
        </>
    );
}

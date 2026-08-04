import {
    CustomerServiceOutlined,
    FileProtectOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Link } from "react-router";
import PageShell from "../components/base/PageShell";
import PageSection from "../components/base/PageSection";
import { useAuth } from "../context/AuthContext";

export default function SupportPage() {
    const { isAuthenticated } = useAuth();
    return (
        <PageShell
            title="Hỗ trợ khách hàng"
            description="Chọn đúng kênh theo nhu cầu để được xử lý nhanh và giữ đầy đủ bằng chứng."
            width="wide"
        >
            <div className="support-entry-grid">
                <Link
                    to={isAuthenticated ? "/account/cases" : "/account/cases"}
                >
                    <CustomerServiceOutlined />
                    <strong>Trung tâm yêu cầu</strong>
                    <span>Mở và theo dõi yêu cầu theo từng giao dịch.</span>
                </Link>
                <Link to="/policies/tranh-chap-khieu-nai">
                    <FileProtectOutlined />
                    <strong>Tranh chấp và khiếu nại</strong>
                    <span>Quy trình, thời hạn và bằng chứng cần chuẩn bị.</span>
                </Link>
                <Link to="/policies/an-toan-tai-khoan">
                    <SafetyCertificateOutlined />
                    <strong>An toàn giao dịch</strong>
                    <span>Nhận diện lừa đảo và bảo vệ tài khoản.</span>
                </Link>
            </div>
            <PageSection
                title="Trước khi gửi yêu cầu"
                description="Chuẩn bị mã giao dịch, mô tả rõ sự việc, thời điểm phát sinh và ảnh/video liên quan. Không gửi OTP, mật khẩu hoặc mã khôi phục."
            />
        </PageShell>
    );
}

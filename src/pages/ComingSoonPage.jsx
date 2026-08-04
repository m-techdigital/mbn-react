import { useLocation } from "react-router";
import PageShell from "../components/base/PageShell";
const pages = {
    "/garena/lien-quan-mobile": [
        "Nick Liên Quân Mobile",
        "Dịch vụ đang được chuẩn hóa quy trình xác minh, bàn giao và bảo mật.",
    ],
    "/g4m/dai-tay-du": [
        "Đại Tây Du — G4M",
        "Hệ thống đang hoàn thiện dữ liệu sản phẩm và quy trình hỗ trợ giao dịch.",
    ],
};
export default function ComingSoonPage() {
    const { pathname } = useLocation();
    const [title, description] = pages[pathname] || [
        "Dịch vụ sắp ra mắt",
        "Vui lòng quay lại sau.",
    ];
    return (
        <PageShell title={title} description={description}>
            <section className="coming-soon-card">
                <span>SẮP RA MẮT</span>
                <h2>{title}</h2>
                <p>{description}</p>
                <div>
                    <b>Đang chuẩn bị</b>
                    <i>Tính năng đang được hoàn thiện và chưa nhận giao dịch</i>
                </div>
            </section>
        </PageShell>
    );
}

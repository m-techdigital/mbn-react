import { Link } from "react-router";
import MarketplaceImage from "../components/base/MarketplaceImage";
import PageShell from "../components/base/PageShell";

export default function NotFoundPage() {
    return (
        <PageShell onBack={false} width="compact">
            <div className="not-found">
                <MarketplaceImage
                    src="/icon/404.gif"
                    alt="Không tìm thấy trang"
                />
                <h1>Không tìm thấy trang</h1>
                <Link className="gaming-button" to="/">
                    Về trang chủ
                </Link>
            </div>
        </PageShell>
    );
}

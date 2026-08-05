import { useEffect, useState } from "react";
import {
    HistoryOutlined,
    LoginOutlined,
    WalletOutlined,
    CreditCardOutlined,
} from "@ant-design/icons";
import { Link } from "react-router";
import AdminNotice from "../components/home/AdminNotice";
import { games, services } from "../data/catalog";
import { useAuth } from "../context/AuthContext";
import { isMockMode } from "../services/dataMode";
import HomeLoadingState from "../components/home/HomeLoadingState";
import MarketplaceImage from "../components/base/MarketplaceImage";
import PageShell from "../components/base/PageShell";

const shortcuts = [
    ["/account/profile", LoginOutlined, "Thành viên", "Tài khoản"],
    ["/account/purchases", HistoryOutlined, "Lịch sử", "Đã mua"],
    ["/account/wallet/deposit/bank", WalletOutlined, "Thanh toán", "Nạp tiền"],
    [
        "/account/wallet/transactions",
        CreditCardOutlined,
        "Ví khách hàng",
        "Biến động số dư",
    ],
];

export default function HomePage() {
    const mockLoadingMs = Number(
        import.meta.env.VITE_HOME_MOCK_LOADING_MS || 950,
    );
    const shouldFakeLoad = isMockMode() && mockLoadingMs > 0;
    const [preparing, setPreparing] = useState(shouldFakeLoad);
    const { customer, user } = useAuth();
    useEffect(() => {
        if (!shouldFakeLoad) return undefined;
        const timer = window.setTimeout(
            () => setPreparing(false),
            mockLoadingMs,
        );
        return () => window.clearTimeout(timer);
    }, [mockLoadingMs, shouldFakeLoad]);

    const account = customer || user;
    const serviceItems = [
        ...games,
        ...services,
        {
            title: "Hướng dẫn mua nick",
            path: "/guides/huong-dan-mua-nick",
            image: "/images/banners/history-buy-account-purple.png",
        },
    ];

    if (preparing) return <HomeLoadingState />;

    return (
        <PageShell
            onBack={false}
            width="full"
            className="home-page fidelity-home"
        >
            <section className="hero-banner">
                <MarketplaceImage
                    src="/images/banners/banner-purple.png"
                    alt="MuaBanNick.Pro"
                />
            </section>

            <section className="home-shortcuts">
                {shortcuts.map(([to, Icon, kicker, title]) => (
                    <Link to={to} key={to}>
                        <span className="shortcut-icon">
                            <Icon />
                        </span>
                        <span>
                            <small>{kicker}</small>
                            <b>
                                {to === "/account/profile" && account
                                    ? account.name || account.username
                                    : title}
                            </b>
                        </span>
                    </Link>
                ))}
            </section>

            <section className="service-section">
                <div className="legacy-section-title">DỊCH VỤ GAME</div>
                <div className="legacy-service-grid">
                    {serviceItems.slice(0, 8).map((item) => (
                        <Link
                            to={item.path}
                            key={`${item.path}-${item.title}`}
                            className="legacy-service-card"
                        >
                            <MarketplaceImage
                                src={item.image}
                                alt={item.title}
                            />
                            <strong>{item.title}</strong>
                        </Link>
                    ))}
                </div>
            </section>

            <AdminNotice />
        </PageShell>
    );
}

import { CloseOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import {
    PRIMARY_NAV_ITEMS,
    isPrimaryNavActive,
} from "../../config/navigation";
import { useAuth } from "../../context/AuthContext";
import { notificationRepository } from "../../services/repositories";
import { REMOTE_MBN_ASSETS } from "../../data/catalog";
import { NOTIFICATION_COUNT_CHANGED } from "../../utils/notificationEvents";
import NotificationTrigger from "./NotificationTrigger";
import MarketplaceImage from "../base/MarketplaceImage";
import GameCatalogModal from "./GameCatalogModal";
import BaseDrawer from "../base/BaseDrawer";
import AccountNavigationContent from "./AccountNavigationContent";

export default function Header({ onAccount }) {
    const location = useLocation();
    const [drawer, setDrawer] = useState(false);
    const [gameCatalogOpen, setGameCatalogOpen] = useState(false);
    const { customer, user, logout } = useAuth();
    const account = customer || user;
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!account) {
            setUnreadCount(0);
            return undefined;
        }
        let active = true;
        const load = async () => {
            try {
                const result = await notificationRepository.list({
                    unread: 1,
                    per_page: 1,
                });
                if (active) setUnreadCount(Number(result?.unread_count || 0));
            } catch {
                if (active) setUnreadCount(0);
            }
        };
        load();
        const timer = window.setInterval(load, 30000);
        window.addEventListener(NOTIFICATION_COUNT_CHANGED, load);
        window.addEventListener("focus", load);
        return () => {
            active = false;
            window.clearInterval(timer);
            window.removeEventListener(NOTIFICATION_COUNT_CHANGED, load);
            window.removeEventListener("focus", load);
        };
    }, [account]);

    useEffect(() => {
        const openCatalog = () => setGameCatalogOpen(true);
        window.addEventListener("mbn:open-game-catalog", openCatalog);
        return () =>
            window.removeEventListener("mbn:open-game-catalog", openCatalog);
    }, []);

    useEffect(() => {
        document.body.classList.toggle("mobile-menu-open", drawer);
        return () => document.body.classList.remove("mobile-menu-open");
    }, [drawer]);

    const closeDrawer = () => setDrawer(false);

    return (
        <>
            <header className="site-header">
                <div className="header-brand-row">
                    <Link to="/" className="brand" aria-label="MuaBanNick.Pro">
                        <MarketplaceImage
                            src={REMOTE_MBN_ASSETS.logo}
                            alt="MuaBanNick.Pro"
                            priority
                        />
                    </Link>
                    <div className="header-actions">
                        {account ? (
                            <NotificationTrigger unreadCount={unreadCount} />
                        ) : null}
                        <button
                            type="button"
                            className="header-account-pill"
                            onClick={onAccount}
                            aria-label={
                                account
                                    ? "Mở hồ sơ khách hàng"
                                    : "Đăng nhập hoặc đăng ký"
                            }
                        >
                            <span className="header-account-avatar">
                                {account?.avatar_url ? (
                                    <MarketplaceImage
                                        src={account.avatar_url}
                                        alt="Ảnh đại diện"
                                    />
                                ) : account ? (
                                    (account?.name || account?.username || "K")
                                        .charAt(0)
                                        .toUpperCase()
                                ) : (
                                    <UserOutlined />
                                )}
                            </span>
                            <span className="header-account-copy">
                                <b>
                                    {account?.name ||
                                        account?.username ||
                                        "Tài khoản"}
                                </b>
                                {account?.code ? (
                                    <small>{account.code}</small>
                                ) : null}
                            </span>
                            <span
                                className="header-account-caret"
                                aria-hidden="true"
                            >
                                ⌄
                            </span>
                        </button>
                        <button
                            type="button"
                            className="mobile-menu-button mobile-only"
                            aria-label="Mở menu"
                            aria-expanded={drawer}
                            onClick={() => setDrawer(true)}
                        >
                            <MenuOutlined />
                        </button>
                    </div>
                </div>
                <nav className="desktop-nav" aria-label="Điều hướng chính">
                    {PRIMARY_NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        if (item.action === "game-catalog")
                            return (
                                <button
                                    key={item.to}
                                    type="button"
                                    className={
                                        isPrimaryNavActive(
                                            item,
                                            location.pathname,
                                        )
                                            ? "active"
                                            : undefined
                                    }
                                    onClick={() => setGameCatalogOpen(true)}
                                >
                                    <Icon />
                                    <span>{item.label}</span>
                                </button>
                            );
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === "/"}
                                className={
                                    isPrimaryNavActive(item, location.pathname)
                                        ? "active"
                                        : undefined
                                }
                            >
                                <Icon />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </header>

            <GameCatalogModal
                open={gameCatalogOpen}
                onClose={() => setGameCatalogOpen(false)}
            />

            <BaseDrawer
                open={drawer}
                onClose={closeDrawer}
                ariaLabel="Menu điều hướng"
                layerClassName="mobile-menu-layer"
                panelClassName="mobile-menu-panel"
            >
                <div className="mobile-menu-head">
                    <MarketplaceImage
                        src={REMOTE_MBN_ASSETS.logo}
                        alt="MuaBanNick.Pro"
                        priority
                    />
                    <button
                        type="button"
                        aria-label="Đóng menu"
                        onClick={closeDrawer}
                    >
                        <CloseOutlined />
                    </button>
                </div>
                <div className="mobile-menu-scroll">
                    <AccountNavigationContent
                        account={account}
                        onAuth={(mode) => {
                            closeDrawer();
                            window.dispatchEvent(
                                new CustomEvent("mbn:open-auth", {
                                    detail: { mode },
                                }),
                            );
                        }}
                        onLogout={logout}
                        onNavigate={closeDrawer}
                        compact
                    />
                </div>
            </BaseDrawer>
        </>
    );
}

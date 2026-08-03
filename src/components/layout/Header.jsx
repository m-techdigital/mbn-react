import { CloseOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
    ACCOUNT_NAV_ITEMS,
    LOGOUT_ICON,
    PRIMARY_NAV_ITEMS,
    SUPPORT_NAV_ITEMS,
    isPrimaryNavActive,
} from "../../config/navigation";
import { useAuth } from "../../context/AuthContext";
import { notificationRepository } from "../../services/repositories";
import { NOTIFICATION_COUNT_CHANGED } from "../../utils/notificationEvents";
import NotificationTrigger from "./NotificationTrigger";
import MarketplaceImage from "../base/MarketplaceImage";
import GameCatalogModal from "./GameCatalogModal";
import BaseDrawer from "../base/BaseDrawer";

function NavItems({ items, path, onNavigate }) {
    return items.map((item) => {
        const Icon = item.icon;
        const active = item.match ? isPrimaryNavActive(item, path) : undefined;
        if (item.action === "game-catalog")
            return (
                <button
                    key={item.to}
                    type="button"
                    className={active ? "active" : undefined}
                    onClick={() => {
                        onNavigate?.();
                        window.dispatchEvent(
                            new CustomEvent("mbn:open-game-catalog"),
                        );
                    }}
                >
                    <Icon />
                    <span>{item.label}</span>
                    <i>›</i>
                </button>
            );
        return (
            <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                    active || isActive ? "active" : undefined
                }
                onClick={onNavigate}
            >
                <Icon />
                <span>{item.label}</span>
                <i>›</i>
            </NavLink>
        );
    });
}

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
    const LogoutIcon = LOGOUT_ICON;

    return (
        <>
            <header className="site-header">
                <div className="header-brand-row">
                    <Link to="/" className="brand" aria-label="MuaBanNick.Pro">
                        <MarketplaceImage
                            src="/images/logo-purple.png"
                            alt="MuaBanNick.Pro"
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
                        src="/images/logo-purple.png"
                        alt="MuaBanNick.Pro"
                    />
                    <button
                        type="button"
                        aria-label="Đóng menu"
                        onClick={closeDrawer}
                    >
                        <CloseOutlined />
                    </button>
                </div>
                <nav className="mobile-menu-links">
                    <NavItems
                        items={PRIMARY_NAV_ITEMS}
                        path={location.pathname}
                        onNavigate={closeDrawer}
                    />
                </nav>
                {account ? (
                    <div className="mobile-account-section">
                        <div className="mobile-account-summary">
                            <span className="header-account-avatar">
                                {account?.avatar_url ? (
                                    <MarketplaceImage
                                        src={account.avatar_url}
                                        alt="Ảnh đại diện"
                                    />
                                ) : (
                                    (account?.name || account?.username || "K")
                                        .charAt(0)
                                        .toUpperCase()
                                )}
                            </span>
                            <span>
                                <b>{account?.name || account?.username}</b>
                                <small>
                                    {account?.code || "Tài khoản khách hàng"}
                                </small>
                            </span>
                        </div>
                        <nav
                            className="mobile-account-links"
                            aria-label="Chức năng tài khoản"
                        >
                            <NavItems
                                items={[
                                    ...ACCOUNT_NAV_ITEMS,
                                    ...SUPPORT_NAV_ITEMS,
                                ]}
                                path={location.pathname}
                                onNavigate={closeDrawer}
                            />
                        </nav>
                        <button
                            type="button"
                            className="mobile-menu-logout"
                            onClick={async () => {
                                closeDrawer();
                                await logout();
                            }}
                        >
                            <LogoutIcon />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="mobile-menu-account"
                        onClick={() => {
                            closeDrawer();
                            onAccount();
                        }}
                    >
                        <UserOutlined />
                        <span>Đăng nhập / Đăng ký</span>
                    </button>
                )}
            </BaseDrawer>
        </>
    );
}

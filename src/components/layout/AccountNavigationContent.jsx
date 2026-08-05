import { NavLink } from "react-router";
import {
    ACCOUNT_NAV_ITEMS,
    LOGOUT_ICON,
    PUBLIC_SIDEBAR_ITEMS,
    SUPPORT_NAV_ITEMS,
} from "../../config/navigation";
import { formatMoney } from "../../utils/format";
import MarketplaceImage from "../base/MarketplaceImage";

function NavigationLinks({ items, onNavigate }) {
    return items.map((item) => {
        const Icon = item.icon;
        return (
            <NavLink key={item.to} to={item.to} onClick={onNavigate}>
                <Icon />
                <span>{item.label}</span>
                <i aria-hidden="true">›</i>
            </NavLink>
        );
    });
}

export default function AccountNavigationContent({
    account,
    onAuth,
    onLogout,
    onNavigate,
    compact = false,
}) {
    const LogoutIcon = LOGOUT_ICON;
    const identity = account?.name || account?.username || "Thành viên";
    const code = account?.code || "Tài khoản khách hàng";

    return (
        <div className={`account-navigation-content${compact ? " is-compact" : ""}`}>
            <section className="account-navigation-profile">
                {account ? (
                    <>
                        <div className="account-navigation-identity">
                            <span className="account-navigation-avatar">
                                {account.avatar_url ? (
                                    <MarketplaceImage src={account.avatar_url} alt="Ảnh đại diện" />
                                ) : (
                                    identity.charAt(0).toUpperCase()
                                )}
                            </span>
                            <span className="account-navigation-copy">
                                <strong>{identity}</strong>
                                {compact ? <small>{code}</small> : null}
                            </span>
                        </div>
                        <div className="account-navigation-balance">
                            <span>Số dư khả dụng</span>
                            <b>{formatMoney(account.balance ?? account.cash ?? 0)}</b>
                        </div>
                    </>
                ) : (
                    <div className="account-navigation-auth">
                        <button type="button" onClick={() => onAuth?.("login")}>Đăng nhập</button>
                        <button type="button" onClick={() => onAuth?.("register")}>Đăng ký</button>
                    </div>
                )}
            </section>

            <nav className="account-navigation-links" aria-label={account ? "Chức năng tài khoản" : "Điều hướng nhanh"}>
                <NavigationLinks
                    items={account ? ACCOUNT_NAV_ITEMS : PUBLIC_SIDEBAR_ITEMS}
                    onNavigate={onNavigate}
                />
                <NavigationLinks items={SUPPORT_NAV_ITEMS} onNavigate={onNavigate} />
            </nav>

            {account ? (
                <button
                    type="button"
                    className="account-navigation-logout"
                    onClick={async () => {
                        onNavigate?.();
                        await onLogout?.();
                    }}
                >
                    <LogoutIcon />
                    <span>Đăng xuất</span>
                </button>
            ) : null}
        </div>
    );
}

import { UserOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import {
    ACCOUNT_NAV_ITEMS,
    LOGOUT_ICON,
    SUPPORT_NAV_ITEMS,
} from "../../config/navigation";
import { useAuth } from "../../context/AuthContext";
import { formatMoney } from "../../utils/format";
import MarketplaceImage from "../base/MarketplaceImage";

function SidebarLinks({ items }) {
    return items.map((item) => {
        const Icon = item.icon;
        return (
            <NavLink key={item.to} to={item.to}>
                <Icon />
                <span>{item.label}</span>
                <i>›</i>
            </NavLink>
        );
    });
}

export default function AccountSidebar({ onAuth }) {
    const { customer, user, logout } = useAuth();
    const account = customer || user;
    const LogoutIcon = LOGOUT_ICON;

    return (
        <aside className="account-sidebar" aria-label="Menu người dùng">
            <span className="sidebar-close" aria-hidden="true">
                ×
            </span>
            <div className="sidebar-profile">
                {account ? (
                    <>
                        <div className="sidebar-profile__identity">
                            <div className="sidebar-avatar">
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
                            </div>
                            <strong>
                                {account.name ||
                                    account.username ||
                                    "Thành viên"}
                            </strong>
                        </div>
                        <span className="sidebar-balance">
                            ▣ Số dư:{" "}
                            <b>
                                {formatMoney(
                                    account.balance ?? account.cash ?? 0,
                                )}
                            </b>
                        </span>
                    </>
                ) : (
                    <div className="sidebar-auth-actions">
                        <button
                            className="btn-login"
                            type="button"
                            onClick={() => onAuth("login")}
                        >
                            Đăng nhập
                        </button>
                        <button
                            className="btn-register"
                            type="button"
                            onClick={() => onAuth("register")}
                        >
                            Đăng ký
                        </button>
                    </div>
                )}
            </div>
            <nav className="sidebar-links">
                {account ? <SidebarLinks items={ACCOUNT_NAV_ITEMS} /> : null}
                <SidebarLinks items={SUPPORT_NAV_ITEMS} />
            </nav>
            {account ? (
                <div className="sidebar-logout-wrap">
                    <button
                        className="sidebar-logout"
                        type="button"
                        onClick={logout}
                    >
                        <LogoutIcon /> Đăng xuất
                    </button>
                </div>
            ) : null}
        </aside>
    );
}

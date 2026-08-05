import { useAuth } from "../../context/AuthContext";
import AccountNavigationContent from "./AccountNavigationContent";

export default function AccountSidebar({ onAuth }) {
    const { customer, user, logout } = useAuth();
    const account = customer || user;

    return (
        <aside
            className="account-sidebar"
            aria-label={account ? "Menu người dùng" : "Điều hướng nhanh"}
        >
            <AccountNavigationContent
                account={account}
                onAuth={onAuth}
                onLogout={logout}
            />
        </aside>
    );
}

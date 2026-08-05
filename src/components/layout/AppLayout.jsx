import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Header from "./Header";
import BottomNav from "./BottomNav";
import AccountSidebar from "./AccountSidebar";
import FloatingRail from "./FloatingRail";
import AuthModal from "../account/AuthModal";
import RouteProgress from "./RouteProgress";
import ScrollManager from "./ScrollManager";
import FullScreenLoader from "./FullScreenLoader";
import { useAuth } from "../../context/AuthContext";
import ToastCenter from "../base/ToastCenter";
import RouteMetadata from "../system/RouteMetadata";
import SiteFooter from "./SiteFooter";
import AdminNotice from "../home/AdminNotice";

export default function AppLayout() {
    const [authState, setAuthState] = useState({ open: false, mode: "login" });
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isAccountWorkspace = location.pathname.startsWith("/account");
    const openAuth = (mode = "login") => setAuthState({ open: true, mode });
    const openAccount = () =>
        isAuthenticated ? navigate("/account/profile") : openAuth("login");

    useEffect(() => {
        const listener = (event) => openAuth(event.detail?.mode || "login");
        window.addEventListener("mbn:open-auth", listener);
        return () => window.removeEventListener("mbn:open-auth", listener);
    }, []);

    return (
        <div className="app theme-dark">
            <a className="mbn-skip-link" href="#main-content">
                Bỏ qua điều hướng
            </a>
            <RouteMetadata />
            <ToastCenter />
            <AdminNotice />
            <RouteProgress />
            <FullScreenLoader />
            <ScrollManager />
            <Header onAccount={openAccount} />
            <div className="site-frame site-frame--workspace">
                <AccountSidebar onAuth={openAuth} />
                <div className="site-content-column">
                    <main id="main-content" className="site-main" tabIndex="-1">
                        <Outlet />
                    </main>
                    {!isAccountWorkspace ? <SiteFooter /> : null}
                </div>
            </div>
            <FloatingRail />
            <BottomNav />
            <AuthModal
                open={authState.open}
                initialMode={authState.mode}
                onClose={() =>
                    setAuthState((current) => ({ ...current, open: false }))
                }
            />
        </div>
    );
}

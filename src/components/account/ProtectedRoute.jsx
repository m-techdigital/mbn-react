import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { PageSkeleton } from "../base/LoadingSkeleton";

export default function ProtectedRoute({ children }) {
    const { loading, isAuthenticated } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            window.dispatchEvent(
                new CustomEvent("mbn:open-auth", { detail: { mode: "login" } }),
            );
        }
    }, [isAuthenticated, loading]);

    if (loading) return <PageSkeleton variant="detail" />;
    return isAuthenticated ? (
        children
    ) : (
        <Navigate to="/" state={{ from: location }} replace />
    );
}

import ProtectedRoute from "./ProtectedRoute";
export default function AccountRouteShell({ children }) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}

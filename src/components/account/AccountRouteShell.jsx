import ProtectedRoute from "./ProtectedRoute";
import "../../styles/customer-account.css";
import "../../styles/account-layout-polish.css";
import "../../styles/marketplace-account-presentation.css";
import "../../styles/interaction-customer-shell.css";
import "../../styles/form-controls.css";

export default function AccountRouteShell({ children }) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}

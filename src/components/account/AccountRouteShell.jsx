import ProtectedRoute from "./ProtectedRoute";
import "../../styles/account-privacy-upload.css";
import "../../styles/profile-security-motion.css";
import "../../styles/form-table-document-polish.css";
import "../../styles/profile-controls-motion.css";
import "../../styles/mobile-surfaces-forms.scss";
import "../../styles/mobile-documents-profile-modal.scss";
import "../../styles/mobile-route-polish.scss";
import "../../styles/mobile-table-resilience.scss";
import "../../styles/customer-account.css";
import "../../styles/account-layout-polish.css";
import "../../styles/marketplace-account-presentation.css";
import "../../styles/interaction-customer-shell.css";
import "../../styles/form-controls.css";

export default function AccountRouteShell({ children }) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}

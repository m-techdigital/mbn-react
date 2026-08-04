import { BrowserRouter } from "react-router";
import App from "../App";
import { AuthProvider } from "../context/AuthContext";
import MbnThemeProvider from "./providers/MbnThemeProvider";

export default function RootApp() {
    return (
        <MbnThemeProvider>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </MbnThemeProvider>
    );
}

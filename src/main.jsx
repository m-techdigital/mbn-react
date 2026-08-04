import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const RootApp = lazy(() => import("./app/RootApp"));

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Suspense fallback={<div className="route-loading-shell" aria-label="Đang tải ứng dụng" />}>
            <RootApp />
        </Suspense>
    </React.StrictMode>,
);

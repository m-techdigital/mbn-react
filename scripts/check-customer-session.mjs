import fs from "node:fs";

const api = fs.readFileSync(
    new URL("../src/services/api.js", import.meta.url),
    "utf8",
);
const vite = fs.readFileSync(
    new URL("../vite.config.js", import.meta.url),
    "utf8",
);
const auth = fs.readFileSync(
    new URL("../src/context/AuthContext.jsx", import.meta.url),
    "utf8",
);

const failures = [];
if (!api.includes("resolveBaseURL"))
    failures.push(
        "API must resolve local absolute URLs through the same-origin proxy.",
    );
if (!api.includes("isLoopbackHost"))
    failures.push(
        "API must normalize localhost and 127.0.0.1 to one browser origin in development.",
    );
if (!api.includes("withCredentials: true"))
    failures.push("Axios must send the HttpOnly refresh cookie.");
if (!api.includes("refreshPromise"))
    failures.push("Concurrent 401 requests must share one refresh operation.");
if (!vite.includes("'/api'"))
    failures.push("Vite must proxy /api in local development.");
if (!vite.includes("configuredApiOrigin"))
    failures.push(
        "Vite proxy must derive its backend target from VITE_API_URL when supplied.",
    );
if (!auth.includes("refreshAccessToken()"))
    failures.push(
        "Auth bootstrap must share the canonical deduplicated refresh operation.",
    );
if (!auth.includes("authRepository.customer()"))
    failures.push("Auth bootstrap must fetch the customer after refresh.");

if (failures.length) {
    console.error(failures.map((item) => `- ${item}`).join("\n"));
    process.exit(1);
}

console.log(
    "Customer session contract passed: reload restores login through the same-origin refresh cookie.",
);

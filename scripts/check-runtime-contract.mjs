import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const api = read("../src/services/api.js");
const auth = read("../src/context/AuthContext.jsx");
const query = read("../src/services/queryClient.js");
const hook = read("../src/hooks/useRemoteData.js");
const metadata = read("../src/components/system/RouteMetadata.jsx");
const layout = read("../src/components/layout/AppLayout.jsx");
const failures = [];

if (
    api.includes("localStorage.getItem") ||
    api.includes("localStorage.setItem")
)
    failures.push("Token vẫn được đọc/ghi vào localStorage.");
if (
    !api.includes("/auth/customer/refresh") ||
    !api.includes("withCredentials: true")
)
    failures.push("Thiếu refresh cookie-only.");
if (api.includes("{ refresh_token:"))
    failures.push("Frontend vẫn gửi refresh_token trong request body.");
if (!auth.includes("refreshAccessToken()"))
    failures.push(
        "Auth bootstrap chưa dùng refresh cookie canonical có chống gọi trùng.",
    );
if (!query.includes("inFlight") || !query.includes("staleTime"))
    failures.push("Query client thiếu dedupe/cache freshness.");
if (!hook.includes("queryKey") || !hook.includes("fetchQuery"))
    failures.push("useRemoteData chưa dùng query owner.");
if (
    !metadata.includes("noindex,nofollow") ||
    !metadata.includes('link[rel="canonical"]')
)
    failures.push("SEO/private metadata chưa đầy đủ.");
if (!layout.includes("<RouteMetadata />"))
    failures.push("RouteMetadata chưa được gắn vào layout.");

if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}
console.log(
    "Runtime contract OK: cookie-only auth, query cache and route metadata are canonical.",
);

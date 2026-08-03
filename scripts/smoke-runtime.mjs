import fs from "node:fs";

const required = [
    "src/App.jsx",
    "src/services/api.js",
    "src/services/queryClient.js",
    "src/components/system/RouteBoundary.jsx",
    "src/components/system/RouteMetadata.jsx",
    "src/components/base/MarketplaceImage.jsx",
    "src/components/base/AsyncContent.jsx",
    "src/styles/foundation.css",
    "src/styles/app.css",
];
const missing = required.filter((file) => !fs.existsSync(file));
if (missing.length) {
    console.error(`Runtime foundation thiếu: ${missing.join(", ")}`);
    process.exit(1);
}
const index = fs.readFileSync("src/index.css", "utf8");
if ((index.match(/@import/g) || []).length !== 3) {
    console.error("CSS entrypoint chưa được hợp nhất.");
    process.exit(1);
}
console.log(
    "Runtime smoke contract OK. Chạy smoke:browser sau khi dev/build server hoạt động.",
);

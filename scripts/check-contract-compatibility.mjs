import fs from "node:fs";

const contract = JSON.parse(
    fs.readFileSync(
        new URL("../src/contracts/marketplace-contract.json", import.meta.url),
        "utf8",
    ),
);
const banner = fs.readFileSync(
    new URL(
        "../src/components/system/ContractCompatibilityBanner.jsx",
        import.meta.url,
    ),
    "utf8",
);

const required = [
    "GET /marketplace-contract",
    "POST /customer/profile/avatar",
    "POST /auth/customer/refresh",
];

const endpoints = new Set([
    ...(contract.public_endpoints || []),
    ...(contract.customer_endpoints || []),
]);
for (const endpoint of required) {
    if (!endpoints.has(endpoint))
        throw new Error(
            `Marketplace contract thiếu endpoint bắt buộc: ${endpoint}`,
        );
}

if (/catch\(\(\)\s*=>[^\n]*set(Incompatible|Issues)/.test(banner)) {
    throw new Error(
        "Contract banner không được coi lỗi kết nối là contract mismatch.",
    );
}
if (!banner.includes("inspectContractCompatibility")) {
    throw new Error(
        "Contract banner phải dùng inspectContractCompatibility để giữ chi tiết mismatch.",
    );
}
if (!banner.includes("setIssues([])")) {
    throw new Error(
        "Contract banner phải xóa mismatch state khi contract endpoint không truy cập được.",
    );
}

console.log("Contract compatibility UI gate passed.");

import snapshot from "./marketplace-contract.json";
import api, { unwrap } from "../services/api";

export const marketplaceContract = snapshot;
export const EXPECTED_CONTRACT_VERSION = snapshot.contract_version;

export async function fetchMarketplaceContract() {
    return api.get("/marketplace-contract").then(unwrap);
}

const major = (version) => String(version ?? "").split(".")[0];
const endpointSet = (items = []) => new Set(items);

export function inspectContractCompatibility(remote) {
    const issues = [];
    const warnings = [];

    if (!remote || typeof remote !== "object") {
        return {
            compatible: true,
            issues: [],
            warnings: ["Không nhận được hợp đồng tích hợp từ máy chủ."],
        };
    }

    // Only a major contract mismatch is a user-facing incompatibility.
    // Endpoint/capability drift is diagnostic because newer backends may add,
    // alias or phase endpoints without breaking the customer runtime.
    if (major(remote.contract_version) !== major(EXPECTED_CONTRACT_VERSION)) {
        issues.push(
            `Phiên bản chính không tương thích: cần ${EXPECTED_CONTRACT_VERSION}, nhận ${remote.contract_version || "không xác định"}.`,
        );
    }

    for (const [capability, enabled] of Object.entries(snapshot.capabilities || {})) {
        if (enabled === true && remote.capabilities?.[capability] !== true) {
            warnings.push(`Máy chủ chưa công bố khả năng: ${capability}.`);
        }
    }

    for (const group of ["public_endpoints", "customer_endpoints"]) {
        const available = endpointSet(remote[group]);
        for (const endpoint of snapshot[group] || []) {
            if (!available.has(endpoint)) warnings.push(`Máy chủ chưa công bố endpoint: ${endpoint}.`);
        }
    }

    return { compatible: issues.length === 0, issues, warnings };
}

export function isCompatibleContract(remote) {
    return inspectContractCompatibility(remote).compatible;
}

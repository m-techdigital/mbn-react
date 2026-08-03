import { useEffect, useState } from "react";
import {
    fetchMarketplaceContract,
    inspectContractCompatibility,
} from "../../contracts/marketplaceContract";

export default function ContractCompatibilityBanner() {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        let active = true;

        fetchMarketplaceContract()
            .then((remote) => {
                if (!active) return;
                const result = inspectContractCompatibility(remote);
                setIssues(result.compatible ? [] : result.issues);
            })
            .catch((error) => {
                // Lỗi kết nối/API không đồng nghĩa với contract không tương thích.
                // Connectivity/error boundaries chịu trách nhiệm hiển thị lỗi hệ thống tương ứng.
                if (import.meta.env.DEV) {
                    console.warn(
                        "[MBN] Không thể kiểm tra marketplace contract.",
                        error,
                    );
                }
                if (active) setIssues([]);
            });

        return () => {
            active = false;
        };
    }, []);

    if (!issues.length) return null;

    return (
        <div
            className="mbn-contract-banner"
            role="alert"
            title={issues.join("\n")}
        >
            Phiên bản giao diện và máy chủ chưa tương thích. Một số chức năng
            tạm thời chưa khả dụng.
        </div>
    );
}

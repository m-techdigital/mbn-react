import { useEffect, useState } from "react";
import { Link } from "react-router";

import GamingLink from "../components/base/GamingLink";
import InlineNotice from "../components/base/InlineNotice";
import PageSection from "../components/base/PageSection";
import PageShell from "../components/base/PageShell";
import StatusBadge from "../components/base/StatusBadge";
import { escrowBoxRepository } from "../services/repositories/marketplace";

export default function EscrowBoxesPage() {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        escrowBoxRepository
            .list({ per_page: 50 })
            .then((response) => setData(response.data || response))
            .catch((requestError) => setError(requestError.message));
    }, []);

    return (
        <PageShell
            title="Box giao dịch trung gian"
            description="Danh tính đối tác luôn được hiển thị dưới bí danh Bên A/B."
        >
            {error ? <InlineNotice type="error">{error}</InlineNotice> : null}
            <PageSection
                title="Box giao dịch của tôi"
                description="Mở từng box để xem điều khoản, tiến trình, lịch sử và thao tác còn được phép."
                actions={<GamingLink to="/account/escrow-boxes/new">Tạo box mới</GamingLink>}
            >
                {data.length ? (
                    data.map((box) => {
                        const latestEvent = box.events?.[0];
                        return (
                            <article key={box.id} className="escrow-box-card">
                                <div className="escrow-box-card__content">
                                    <strong>{box.code}</strong>
                                    <p>
                                        {box.agreement_terms?.party_a_asset?.title || "Tài sản A"} ↔{" "}
                                        {box.agreement_terms?.party_b_asset?.title || "Tài sản B"}
                                    </p>
                                    <small>
                                        {latestEvent
                                            ? `${latestEvent.description || latestEvent.event_type} · ${new Date(latestEvent.occurred_at).toLocaleString("vi-VN")}`
                                            : "Chưa có lịch sử mới"}
                                    </small>
                                </div>
                                <div className="escrow-box-card__actions">
                                    <StatusBadge status={box.status}>{box.status}</StatusBadge>
                                    <GamingLink to={`/account/escrow-boxes/${box.id}`}>Xem chi tiết</GamingLink>
                                </div>
                            </article>
                        );
                    })
                ) : (
                    <p>Chưa có box nào.</p>
                )}
            </PageSection>
        </PageShell>
    );
}

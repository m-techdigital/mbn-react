import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import GamingButton from "../components/base/GamingButton";
import InlineNotice from "../components/base/InlineNotice";
import PageSection, { DefinitionGrid } from "../components/base/PageSection";
import PageShell from "../components/base/PageShell";
import { escrowBoxRepository } from "../services/repositories/marketplace";

export default function EscrowBoxAssignedInvitePage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        escrowBoxRepository
            .previewAssignedInvite(token)
            .then(setData)
            .catch((requestError) =>
                setError(
                    requestError?.response?.data?.message ||
                        "Lời mời không còn khả dụng.",
                ),
            )
            .finally(() => setLoading(false));
    }, [token]);

    const accept = async () => {
        setLoading(true);
        setError("");
        try {
            const box = await escrowBoxRepository.acceptAssignedInvite(token);
            navigate(`/account/escrow-boxes/${box.id}`);
        } catch (requestError) {
            setError(
                requestError?.response?.data?.message || requestError.message,
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageShell
            title="Xác nhận Box do Admin tạo"
            description="Link này chỉ dành cho tài khoản của bạn. Bạn chỉ thấy vai trò Bên A/B và nội dung giao dịch, không thấy danh tính đối tác."
        >
            {error ? (
                <InlineNotice type="error" title="Không thể mở lời mời">
                    {error}
                </InlineNotice>
            ) : null}
            {data ? (
                <>
                    <PageSection
                        title={`Box ${data.code}`}
                        description={`Bạn được chỉ định là ${data.self_label}. Khi xác nhận, hệ thống ghi nhận bạn đồng ý phiên bản điều khoản hiện tại.`}
                    >
                        <DefinitionGrid
                            items={[
                                { label: "Vai trò của bạn", value: data.self_label },
                                { label: "Đối tác", value: data.counterparty_label },
                                {
                                    label: "Loại giao dịch",
                                    value:
                                        data.deal_type === "exchange_with_topup"
                                            ? "Trao đổi có bù"
                                            : "Trao đổi ngang",
                                },
                                { label: "Tiền bù", value: data.topup_amount },
                                { label: "Phí dự kiến", value: data.estimated_fee },
                                {
                                    label: "Thời gian kiểm tra",
                                    value: `${data.inspection_period_minutes} phút`,
                                },
                            ]}
                        />
                    </PageSection>
                    <PageSection title="Điều khoản do Admin thiết lập">
                        <DefinitionGrid
                            items={[
                                {
                                    label: "Bên A giao",
                                    value: data.agreement_terms?.party_a_asset?.title,
                                },
                                {
                                    label: "Mô tả A",
                                    value: data.agreement_terms?.party_a_asset?.description,
                                },
                                {
                                    label: "Bên B giao",
                                    value: data.agreement_terms?.party_b_asset?.title,
                                },
                                {
                                    label: "Mô tả B",
                                    value: data.agreement_terms?.party_b_asset?.description,
                                },
                                {
                                    label: "Điều kiện hoàn tất",
                                    value: data.agreement_terms?.success_conditions,
                                },
                            ]}
                        />
                    </PageSection>
                    <GamingButton
                        variant="primary"
                        loading={loading}
                        onClick={accept}
                    >
                        Đồng ý tham gia với vai trò {data.self_label}
                    </GamingButton>
                </>
            ) : loading ? (
                <p>Đang tải lời mời...</p>
            ) : null}
        </PageShell>
    );
}

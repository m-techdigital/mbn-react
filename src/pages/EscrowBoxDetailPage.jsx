import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";

import GamingButton from "../components/base/GamingButton";
import InlineNotice from "../components/base/InlineNotice";
import MultiImageUploadField from "../components/base/MultiImageUploadField";
import PageSection, {
    DefinitionGrid,
    PageStack,
} from "../components/base/PageSection";
import PageShell from "../components/base/PageShell";
import { BaseTextarea } from "../components/base/FormControls";
import EscrowBoxCounterpartyInviteSection from "../components/escrow-box/EscrowBoxCounterpartyInviteSection";
import { useEscrowBoxDetail } from "../hooks/marketplace/useEscrowBoxDetail";

const formatMoney = (value) =>
    `${Number(value || 0).toLocaleString("vi-VN")} đ`;

export default function EscrowBoxDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const box = useEscrowBoxDetail(id);
    const [note, setNote] = useState("");
    const [invitePath, setInvitePath] = useState(
        location.state?.createdInvitePath || "",
    );

    const data = box.data;
    const eventItems = useMemo(
        () =>
            (data?.events || []).map((event) => ({
                label: new Date(event.occurred_at).toLocaleString("vi-VN"),
                value: `${event.description || event.event_type}${
                    event.actor_label ? ` · ${event.actor_label}` : ""
                }`,
            })),
        [data?.events],
    );
    const conditionItems = useMemo(
        () => [
            {
                label: "Bên A giao",
                value: data?.agreement_terms?.party_a_asset?.title,
            },
            {
                label: "Bên B giao",
                value: data?.agreement_terms?.party_b_asset?.title,
            },
            {
                label: "Tiền bù",
                value:
                    data?.deal_type === "exchange_with_topup"
                        ? formatMoney(data?.topup_amount)
                        : "Không có",
            },
            { label: "Phí nền tảng", value: formatMoney(data?.final_fee) },
            { label: "Bên chịu phí", value: data?.fee_payer_mode },
            {
                label: "Điều kiện thành công",
                value: data?.agreement_terms?.success_conditions,
            },
        ],
        [data],
    );
    const obligationItems = useMemo(
        () =>
            (data?.obligations || []).map((item) => ({
                label: `${item.party_side} · ${item.type}`,
                value: `${formatMoney(item.amount)} · ${item.status}`,
            })),
        [data?.obligations],
    );

    if (box.loading && !data) {
        return (
            <PageShell title="Box giao dịch">
                <p>Đang tải...</p>
            </PageShell>
        );
    }

    if (!data) {
        return (
            <PageShell title="Box giao dịch">
                {box.error ? (
                    <InlineNotice type="error">{box.error}</InlineNotice>
                ) : null}
                <GamingButton type="button" onClick={box.reload}>
                    Tải lại
                </GamingButton>
            </PageShell>
        );
    }

    const selfStep = data.handover_steps?.find(
        (step) => step.party_side === data.self_role,
    );

    const rotateInvite = async () => {
        const response = await box.rotateInvite();
        setInvitePath(response.invite_path || "");
    };

    const copyInvite = async () => {
        if (!invitePath) return;
        await navigator.clipboard.writeText(
            `${window.location.origin}${invitePath}`,
        );
    };

    const cloneBox = async () => {
        const response = await box.clone();
        navigate(`/account/escrow-boxes/${response.box.id}`);
    };

    return (
        <PageShell
            title={`Box ${data.code}`}
            description={`Bạn là ${data.self_label}. Đối tác chỉ được hiển thị là ${data.counterparty_label}.`}
            onReload={box.reload}
            loading={box.loading}
        >
            {box.error ? (
                <InlineNotice type="error">{box.error}</InlineNotice>
            ) : null}

            <PageStack className="escrow-box-detail-stack">
                <PageSection
                    title="Điều khoản hiện tại"
                    description={`Phiên bản ${data.agreement_version}`}
                >
                    <DefinitionGrid items={conditionItems} />
                </PageSection>

                {data.can_invite_counterparty_by_phone ? (
                    <EscrowBoxCounterpartyInviteSection
                        loading={box.loading}
                        onResolve={box.resolveCounterparty}
                        onInvite={box.inviteCounterparty}
                    />
                ) : null}

                {data.counterparty_invitation_pending ? (
                    <PageSection
                        title="Lời mời Bên B đang chờ"
                        description={
                            data.can_accept_counterparty_invite
                                ? "Bạn được mời tham gia Box này với vai trò Bên B."
                                : "Bên B chưa chấp nhận. Người tạo có thể hủy lời mời và chọn người khác."
                        }
                    >
                        <div className="escrow-box-inline-actions">
                            {data.can_accept_counterparty_invite ? (
                                <GamingButton
                                    type="button"
                                    variant="primary"
                                    onClick={box.acceptCounterpartyInvite}
                                >
                                    Chấp nhận tham gia Box
                                </GamingButton>
                            ) : null}
                            {data.can_cancel_counterparty_invite ? (
                                <GamingButton
                                    type="button"
                                    variant="danger"
                                    onClick={box.cancelCounterpartyInvite}
                                >
                                    Hủy lời mời và chọn người khác
                                </GamingButton>
                            ) : null}
                        </div>
                    </PageSection>
                ) : null}

                {data.can_rotate_invite ? (
                    <PageSection
                        title="Link mời Bên B"
                        description="Lấy link mới sẽ vô hiệu hóa link cũ ngay lập tức."
                    >
                        <div className="escrow-box-inline-actions">
                            <GamingButton type="button" onClick={rotateInvite}>
                                Lấy link mới
                            </GamingButton>
                            {invitePath ? (
                                <div className="escrow-box-invite-link">
                                    <code>{`${window.location.origin}${invitePath}`}</code>
                                    <GamingButton
                                        type="button"
                                        onClick={copyInvite}
                                    >
                                        Sao chép
                                    </GamingButton>
                                </div>
                            ) : null}
                        </div>
                    </PageSection>
                ) : null}

                {["terms_pending", "changes_requested"].includes(data.status) ? (
                    <PageSection
                        title="Xác nhận điều khoản"
                        actions={
                            <Link to={`/account/escrow-boxes/${id}/terms`}>
                                Đề xuất sửa điều khoản
                            </Link>
                        }
                        description="Cả hai bên phải xác nhận cùng một phiên bản trước khi Admin thẩm định."
                    >
                        <p>
                            Bạn: {data.self_confirmed ? "Đã xác nhận" : "Chưa xác nhận"}
                            {" · "}
                            Đối tác: {data.counterparty_confirmed
                                ? "Đã xác nhận"
                                : "Chưa xác nhận"}
                        </p>
                        <GamingButton
                            type="button"
                            variant="primary"
                            onClick={box.confirm}
                            disabled={data.self_confirmed}
                        >
                            Xác nhận phiên bản này
                        </GamingButton>
                    </PageSection>
                ) : null}

                <PageSection title="Thanh toán và bàn giao">
                    {obligationItems.length ? (
                        <DefinitionGrid items={obligationItems} />
                    ) : (
                        <p>Chưa phát sinh nghĩa vụ thanh toán.</p>
                    )}
                    {selfStep ? (
                        <>
                            <p>Checkpoint của bạn: {selfStep.status}</p>
                            <MultiImageUploadField
                                label="Ảnh bằng chứng"
                                hint="Ảnh được bỏ EXIF, resize và chuyển định dạng tối ưu trước khi lưu private."
                                images={[]}
                                loading={box.uploading}
                                progress={box.progress}
                                onChange={(event) =>
                                    box.upload(event.target.files, selfStep.id)
                                }
                                max={10}
                            />
                            <BaseTextarea
                                rows="3"
                                value={note}
                                onChange={(event) => setNote(event.target.value)}
                                placeholder="Ghi chú bàn giao không chứa mật khẩu, OTP hoặc thông tin liên hệ"
                            />
                            <GamingButton
                                type="button"
                                onClick={() =>
                                    box.submitHandover(data.self_role, note)
                                }
                                disabled={!["ready", "changes_requested"].includes(
                                    selfStep.status,
                                )}
                            >
                                Gửi bàn giao cho Admin
                            </GamingButton>
                        </>
                    ) : null}
                </PageSection>

                <PageSection
                    title="Lịch sử Box"
                    description="Lịch sử đã được ẩn thông tin định danh của hai bên."
                >
                    {eventItems.length ? (
                        <DefinitionGrid items={eventItems} />
                    ) : (
                        <p>Chưa có sự kiện.</p>
                    )}
                </PageSection>

                {data.status === "inspection" ? (
                    <PageSection
                        title="Xác nhận hoặc tranh chấp"
                        description="Chỉ xác nhận khi bạn đã nhận đúng tài sản. Hết hạn sẽ chuyển Admin xử lý, không tự động quyết toán."
                    >
                        <div className="escrow-box-inline-actions">
                            <GamingButton
                                type="button"
                                variant="primary"
                                onClick={box.confirmReceipt}
                                disabled={data.self_received}
                            >
                                Tôi đã nhận đúng tài sản
                            </GamingButton>
                            <GamingButton
                                type="button"
                                variant="danger"
                                onClick={() =>
                                    box.openDispute(
                                        "asset_mismatch",
                                        "Tài sản nhận được không đúng điều khoản đã xác nhận.",
                                    )
                                }
                            >
                                Mở tranh chấp
                            </GamingButton>
                        </div>
                    </PageSection>
                ) : null}
            </PageStack>

            {data.can_update || data.can_cancel || data.can_clone ? (
                <div
                    className="escrow-box-footer-actions"
                    role="group"
                    aria-label="Thao tác vòng đời Box"
                >
                    {data.can_update ? (
                        <GamingButton
                            type="button"
                            variant="primary"
                            onClick={() =>
                                navigate(`/account/escrow-boxes/${id}/edit`)
                            }
                        >
                            Cập nhật
                        </GamingButton>
                    ) : null}
                    {data.can_clone ? (
                        <GamingButton
                            type="button"
                            variant="primary"
                            onClick={cloneBox}
                        >
                            Sao chép thành box mới
                        </GamingButton>
                    ) : null}
                    {data.can_cancel ? (
                        <GamingButton
                            type="button"
                            variant="danger"
                            onClick={box.cancel}
                        >
                            Hủy box
                        </GamingButton>
                    ) : null}
                </div>
            ) : null}
        </PageShell>
    );
}

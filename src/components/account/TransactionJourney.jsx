import PageSection from "../base/PageSection";
import GamingButton from "../base/GamingButton";
import { formatMoney } from "../../utils/format";

export default function TransactionJourney({ journey, onAction, loading }) {
    const lifecycle = journey?.lifecycle || {};
    const checklist = journey?.workflow_checklist || [];
    const next = lifecycle.next_action;
    const guidance = lifecycle.guidance || [];

    return (
        <PageSection
            className="purchase-next-action"
            title="Bước tiếp theo"
            description={
                lifecycle.status?.label
                    ? `Trạng thái: ${lifecycle.status.label}`
                    : "Theo dõi tiến trình giao dịch"
            }
        >
            {next ? (
                <div className="purchase-next-action__hero">
                    <div>
                        <b>{next.label}</b>
                        <p>Hoàn thành bước này để giao dịch tiếp tục.</p>
                    </div>
                    {!["pay", "accept_document"].includes(next.key) ? (
                        <GamingButton
                            variant="primary"
                            loading={loading === next.key}
                            onClick={() => onAction(next.key)}
                        >
                            {next.label}
                        </GamingButton>
                    ) : null}
                </div>
            ) : (
                <p>
                    Hiện không có thao tác bắt buộc. Bạn vẫn có thể theo dõi
                    timeline và thông báo.
                </p>
            )}
            {!!guidance.length && (
                <div className="purchase-guidance-list">
                    {guidance.map((item) => (
                        <article key={item.key} className={`purchase-guidance-item is-${item.status || "info"}`}>
                            <b>{item.label}</b>
                            {item.message ? <p>{item.message}</p> : null}
                            <div className="purchase-guidance-item__facts">
                                {item.value != null ? <span>Cần trả: {formatMoney(item.value)}</span> : null}
                                {item.rental_amount != null ? <span>Tiền thuê: {formatMoney(item.rental_amount)}</span> : null}
                                {item.deposit_amount != null ? <span>Tiền cọc: {formatMoney(item.deposit_amount)}</span> : null}
                                {item.deduction_amount != null ? <span>Khấu trừ: {formatMoney(item.deduction_amount)}</span> : null}
                                {item.refundable_amount != null ? <span>Hoàn lại: {formatMoney(item.refundable_amount)}</span> : null}
                                {item.due_at ? <span>Hạn: {new Date(item.due_at).toLocaleString("vi-VN")}</span> : null}
                            </div>
                        </article>
                    ))}
                </div>
            )}
            <ol className="purchase-journey-list">
                {checklist.map((item) => (
                    <li key={item.key} className={`is-${item.status}`}>
                        <b>{item.label}</b>
                        <span>{item.detail}</span>
                    </li>
                ))}
            </ol>
            {!!lifecycle.blocking_reasons?.length && (
                <div className="purchase-blocking-reasons">
                    <b>Điều kiện chưa hoàn tất</b>
                    {lifecycle.blocking_reasons.slice(0, 3).map((reason) => (
                        <p key={reason}>{reason}</p>
                    ))}
                </div>
            )}
        </PageSection>
    );
}

import PageSection from "../base/PageSection";
import GamingButton from "../base/GamingButton";

export default function TransactionJourney({ journey, onAction, loading }) {
    const lifecycle = journey?.lifecycle || {};
    const checklist = journey?.workflow_checklist || [];
    const next = lifecycle.next_action;

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

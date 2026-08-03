import GamingButton from "../base/GamingButton";
import StatusBadge from "../base/StatusBadge";
import { transactionRepository } from "../../services/repositories";
import { formatMoney } from "../../utils/format";
import { statusLabel, valueLabel } from "../../utils/labels";
import { actionablePaymentStatuses } from "../../config/marketplace/purchaseDetail";

export default function TransactionPaymentTimeline({
    transaction,
    items,
    acting,
    run,
    openBankPayment,
}) {
    if (!items.length) return <p>Chưa có khoản thanh toán trong nhóm này.</p>;

    return (
        <ol className="mbn-payment-timeline">
            {items.map((payment, index) => {
                const actionable = actionablePaymentStatuses.has(payment.status);
                const dueLabel = payment.period_start
                    ? `${payment.period_start} → ${payment.period_end || "—"}`
                    : `Hạn ${payment.due_date || "—"}`;

                return (
                    <li
                        key={payment.id}
                        className={`mbn-payment-timeline__item${actionable ? " is-actionable" : ""}`}
                    >
                        <span className="mbn-payment-timeline__marker">
                            {index + 1}
                        </span>
                        <article className="mbn-payment-item">
                            <div className="mbn-payment-item__main">
                                <b>{payment.code}</b>
                                <span>
                                    {valueLabel(payment.component_type)}
                                    {payment.installment_number
                                        ? ` · kỳ ${payment.installment_number}`
                                        : ""}
                                    {payment.cycle_number
                                        ? ` · chu kỳ ${payment.cycle_number}`
                                        : ""}
                                </span>
                                <small>{dueLabel}</small>
                            </div>
                            <strong>{formatMoney(payment.amount)}</strong>
                            <div className="mbn-payment-item__status">
                                <StatusBadge status={payment.status} />
                                <small>{statusLabel(payment.settlement_status)}</small>
                            </div>
                            {transaction.current_role === "buyer" && actionable ? (
                                <div className="mbn-payment-item__actions">
                                    <GamingButton
                                        size="sm"
                                        loading={acting === `wallet-${payment.id}`}
                                        onClick={() =>
                                            run(
                                                () =>
                                                    transactionRepository.submitPayment(
                                                        transaction.id,
                                                        payment.id,
                                                        {
                                                            payment_method: "wallet",
                                                            reference: `WALLET-${transaction.code}-${payment.id}`,
                                                        },
                                                    ),
                                                `wallet-${payment.id}`,
                                            )
                                        }
                                    >
                                        Trả bằng số dư
                                    </GamingButton>
                                    <GamingButton
                                        size="sm"
                                        variant="secondary"
                                        loading={acting === `qr-${payment.id}`}
                                        onClick={() => openBankPayment(payment)}
                                    >
                                        Chuyển khoản
                                    </GamingButton>
                                </div>
                            ) : null}
                        </article>
                    </li>
                );
            })}
        </ol>
    );
}

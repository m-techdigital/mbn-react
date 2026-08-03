import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../components/base/PageShell";
import PageSection, {
    DefinitionGrid,
    MetricGrid,
    PageColumns,
    PageStack,
} from "../components/base/PageSection";
import StatusBadge from "../components/base/StatusBadge";
import GamingButton from "../components/base/GamingButton";
import GamingModal from "../components/base/GamingModal";
import FormField from "../components/base/FormField";
import { useRemoteData } from "../hooks/useRemoteData";
import { useMarketplaceOptions } from "../hooks/useMarketplaceOptions";
import { transactionRepository } from "../services/repositories";
import { formatMoney } from "../utils/format";
import { statusLabel, valueLabel } from "../utils/labels";
import TransactionDocuments from "../components/documents/TransactionDocuments";
import TransactionAssetSnapshots from "../components/account/TransactionAssetSnapshots";
import TransactionJourney from "../components/account/TransactionJourney";
import MarketplaceImage from "../components/base/MarketplaceImage";
import { BaseInput } from "../components/base/FormControls";
import { usePurchaseDetailActions } from "../hooks/marketplace/usePurchaseDetailActions";
import { rentalMoneyBreakdown } from "../utils/rentalMoney";
import {
    actionablePaymentStatuses,
    buildPurchaseMetrics,
    comparePayments,
    formatDateTime as dateTime,
    purchaseActionLabels as actionLabels,
} from "../config/marketplace/purchaseDetail";

export default function PurchaseDetailPage() {
    const { id } = useParams();
    const { disputeOutcomeLabels } = useMarketplaceOptions();
    const {
        data: transaction,
        loading,
        error,
        reload,
    } = useRemoteData(() => transactionRepository.show(id), [id], {
        queryKey: "purchase-detail",
        staleTime: 10000,
    });
    const {
        acting,
        notice,
        bankPayment,
        bankQr,
        bankReference,
        setBankReference,
        run,
        openBankPayment,
        confirmBankPayment,
        closeBankPayment,
    } = usePurchaseDetailActions(transaction, reload);

    const actions = transaction?.allowed_actions || [];
    const sortedPayments = useMemo(
        () => [...(transaction?.payments || [])].sort(comparePayments),
        [transaction?.payments],
    );
    const duePayments = sortedPayments.filter((item) =>
        actionablePaymentStatuses.has(item.status),
    );
    const completedPayments = sortedPayments.filter(
        (item) => !actionablePaymentStatuses.has(item.status),
    );

    const metrics = buildPurchaseMetrics(transaction);
    const rentalMoney = rentalMoneyBreakdown({
        rentalAmount: transaction?.transaction_value,
        depositAmount: transaction?.deposit_amount,
        deductionAmount: transaction?.rental_deposit_deduction_amount,
    });

    const productAttributes =
        transaction?.product?.attributes &&
        typeof transaction.product.attributes === "object"
            ? transaction.product.attributes
            : {};
    const accountDetails = transaction
        ? [
              {
                  label: "Tên tài khoản / nhân vật",
                  value: transaction.product?.name || "—",
              },
              {
                  label: "Trò chơi",
                  value: valueLabel(
                      transaction.product?.game_code ||
                          transaction.product?.product_type ||
                          "—",
                  ),
              },
              {
                  label: "Máy chủ",
                  value:
                      transaction.product?.server_name ||
                      productAttributes.server ||
                      "—",
              },
              {
                  label: "Cấp độ",
                  value:
                      transaction.product?.level ||
                      productAttributes.level ||
                      "—",
              },
              { label: "Mã sản phẩm", value: transaction.product?.code || "—" },
              {
                  label: "Loại giao dịch",
                  value: valueLabel(transaction.transaction_type),
              },
              ...Object.entries(productAttributes)
                  .filter(
                      ([key]) =>
                          ![
                              "server",
                              "level",
                              "password",
                              "account_password",
                              "secret",
                              "pin",
                          ].includes(key),
                  )
                  .slice(0, 6)
                  .map(([key, value]) => ({
                      label: valueLabel(key),
                      value:
                          typeof value === "boolean"
                              ? value
                                  ? "Có"
                                  : "Không"
                              : String(value ?? "—"),
                  })),
          ]
        : [];

    const transactionDetails = transaction
        ? [
              {
                  label: "Người mua / thuê",
                  value: transaction.buyer?.name || "—",
              },
              {
                  label: "Người bán / cho thuê",
                  value: transaction.seller?.name || "—",
              },
              {
                  label: "Hình thức",
                  value: valueLabel(transaction.purchase_mode),
              },
              {
                  label: "Thanh toán bằng ví",
                  value: formatMoney(transaction.wallet_paid_amount || 0),
              },
              {
                  label: "Phí người mua",
                  value: formatMoney(transaction.buyer_fee_amount || 0),
              },
              {
                  label: "Phí người bán",
                  value: formatMoney(transaction.seller_fee_amount || 0),
              },
              {
                  label: "Thuế trên phí",
                  value: formatMoney(transaction.tax_amount || 0),
              },
              ...(transaction.current_role === "seller"
                  ? [
                        {
                            label: "Số tiền ròng dự kiến",
                            value: formatMoney(
                                transaction.seller_net_amount || 0,
                            ),
                        },
                    ]
                  : []),
              ...(transaction.transaction_type === "rental"
                  ? [
                        {
                            label: "Kỳ hạn thuê",
                            value: `${transaction.rental_period_count || "—"} ${valueLabel(transaction.rental_period_unit)}`,
                        },
                        {
                            label: "Thời gian thuê",
                            value: `${dateTime(transaction.rental_start_at)} → ${dateTime(transaction.rental_end_at)}`,
                        },
                        {
                            label: "Cách thu tiền",
                            value: valueLabel(transaction.rental_billing_mode),
                        },
                        {
                            label: "Tiền thuê",
                            value: formatMoney(rentalMoney.rentalAmount),
                        },
                        {
                            label: "Tiền cọc",
                            value: formatMoney(rentalMoney.depositAmount),
                        },
                        {
                            label: "Cần thanh toán ban đầu",
                            value: formatMoney(rentalMoney.initialAmount),
                        },
                        {
                            label: "Khấu trừ tiền cọc",
                            value: formatMoney(rentalMoney.deductionAmount),
                        },
                        {
                            label: "Số tiền cọc hoàn lại",
                            value: formatMoney(rentalMoney.refundableAmount),
                        },
                    ]
                  : []),
              ...(transaction.purchase_mode === "installment"
                  ? [
                        {
                            label: "Số kỳ trả góp",
                            value: transaction.installment_count || "—",
                        },
                        {
                            label: "Khoảng cách kỳ",
                            value: `${transaction.installment_interval_count || "—"} ${valueLabel(transaction.installment_interval_unit)}`,
                        },
                    ]
                  : []),
          ]
        : [];

    const renderPayments = (items) => (
        <div className="mbn-payment-list">
            {items.map((payment) => (
                <article
                    key={payment.id}
                    className={`mbn-payment-item${actionablePaymentStatuses.has(payment.status) ? " is-actionable" : ""}`}
                >
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
                        <small>
                            {payment.period_start
                                ? `${payment.period_start} → ${payment.period_end || "—"}`
                                : `Hạn ${payment.due_date || "—"}`}
                        </small>
                    </div>
                    <strong>{formatMoney(payment.amount)}</strong>
                    <div className="mbn-payment-item__status">
                        <StatusBadge status={payment.status} />
                        <small>{statusLabel(payment.settlement_status)}</small>
                    </div>
                    {transaction.current_role === "buyer" &&
                    actionablePaymentStatuses.has(payment.status) ? (
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
            ))}
        </div>
    );

    return (
        <PageShell
            title={`Chi tiết giao dịch ${transaction?.code || ""}`}
            description="Theo dõi dòng tiền, kỳ hạn, bàn giao, hoàn trả và tranh chấp."
            loading={loading}
            error={error}
            onReload={reload}
            width="wide"
        >
            {transaction ? (
                <PageStack>
                    <PageSection className="mbn-transaction-hero" tone="accent">
                        <div className="mbn-transaction-hero__content">
                            <div>
                                <span>
                                    {valueLabel(transaction.transaction_type)}
                                </span>
                                <h2>
                                    {transaction.product?.name ||
                                        "Tài khoản trò chơi"}
                                </h2>
                                <p>
                                    Mã giao dịch: <b>{transaction.code}</b> ·
                                    Vai trò:{" "}
                                    <b>
                                        {transaction.current_role === "seller"
                                            ? "Người bán / cho thuê"
                                            : "Người mua / thuê"}
                                    </b>
                                </p>
                            </div>
                            <div className="mbn-transaction-hero__status">
                                <span>Trạng thái giao dịch</span>
                                <StatusBadge status={transaction.status} />
                            </div>
                        </div>
                    </PageSection>
                    {notice ? (
                        <div className="purchase-detail-notice">{notice}</div>
                    ) : null}
                    <MetricGrid items={metrics} />
                    <PageColumns
                        ratio="wide-left"
                        className="purchase-detail-workspace"
                    >
                        <PageStack>
                            <PageSection
                                title="Thông tin tài khoản trò chơi"
                                description="Thông tin nhận diện tài khoản gắn cố định với giao dịch, kể cả sau khi hoàn tất."
                            >
                                <div className="purchase-game-summary">
                                    <MarketplaceImage
                                        src={
                                            transaction.product?.image_url ||
                                            transaction.product?.image_urls?.[0]
                                        }
                                        alt={
                                            transaction.product?.name ||
                                            "Tài khoản trò chơi"
                                        }
                                    />
                                    <DefinitionGrid items={accountDetails} />
                                </div>
                            </PageSection>
                            <PageSection title="Thông tin giao dịch">
                                <DefinitionGrid items={transactionDetails} />
                            </PageSection>
                            {transaction.transaction_type === "rental" &&
                            (Number(
                                transaction.rental_deposit_deduction_amount ||
                                    0,
                            ) > 0 ||
                                Number(transaction.refunded_amount || 0) >
                                    0) ? (
                                <PageSection
                                    title="Quyết toán tiền cọc"
                                    description="Số tiền cọc được đối chiếu sau hoàn trả. Khấu trừ chỉ áp dụng khi có chi phí hoặc thiệt hại được quản trị viên ghi rõ."
                                >
                                    <DefinitionGrid
                                        items={[
                                            {
                                                label: "Tiền cọc ban đầu",
                                                value: formatMoney(
                                                    transaction.deposit_amount ||
                                                        0,
                                                ),
                                            },
                                            {
                                                label: "Số tiền khấu trừ",
                                                value: formatMoney(
                                                    transaction.rental_deposit_deduction_amount ||
                                                        0,
                                                ),
                                            },
                                            {
                                                label: "Số tiền cọc đã hoàn",
                                                value: formatMoney(
                                                    Math.max(
                                                        0,
                                                        Number(
                                                            transaction.deposit_amount ||
                                                                0,
                                                        ) -
                                                            Number(
                                                                transaction.rental_deposit_deduction_amount ||
                                                                    0,
                                                            ),
                                                    ),
                                                ),
                                            },
                                            {
                                                label: "Căn cứ khấu trừ",
                                                value:
                                                    transaction.rental_deposit_deduction_note ||
                                                    "Không phát sinh khấu trừ tiền cọc",
                                            },
                                        ]}
                                    />
                                </PageSection>
                            ) : null}
                            <TransactionDocuments
                                transactionId={transaction.id}
                                transactionCode={transaction.code}
                            />
                            <PageSection
                                title="Các khoản thanh toán"
                                description="Các khoản cần xử lý được ưu tiên trước, sau đó sắp theo kỳ và ngày đến hạn."
                            >
                                {duePayments.length ? (
                                    <div className="purchase-payment-group">
                                        <div className="purchase-payment-group__heading">
                                            <b>Cần thanh toán</b>
                                            <span>
                                                {duePayments.length} khoản
                                            </span>
                                        </div>
                                        {renderPayments(duePayments)}
                                    </div>
                                ) : null}
                                {completedPayments.length ? (
                                    <div className="purchase-payment-group">
                                        <div className="purchase-payment-group__heading">
                                            <b>Đã xử lý</b>
                                            <span>
                                                {completedPayments.length} khoản
                                            </span>
                                        </div>
                                        {renderPayments(completedPayments)}
                                    </div>
                                ) : null}
                                {!sortedPayments.length ? (
                                    <p className="mbn-empty-inline">
                                        Chưa có khoản thanh toán nào cho giao
                                        dịch này.
                                    </p>
                                ) : null}
                                {duePayments.length ? (
                                    <p className="payment-due-warning">
                                        Bạn còn {duePayments.length} khoản chưa
                                        hoàn tất. Khoản quá hạn có thể làm chậm
                                        bàn giao hoặc gia hạn thuê.
                                    </p>
                                ) : null}
                            </PageSection>
                            <TransactionAssetSnapshots
                                transactionId={transaction.id}
                                transactionType={transaction.transaction_type}
                            />
                        </PageStack>
                        <PageStack className="purchase-detail-sidebar">
                            <TransactionJourney
                                journey={transaction.journey}
                                loading={acting}
                                onAction={(action) =>
                                    run(
                                        () =>
                                            transactionRepository.action(
                                                transaction.id,
                                                action,
                                            ),
                                        action,
                                    )
                                }
                            />
                            {actions.length ? (
                                <PageSection
                                    className="purchase-detail-action-section"
                                    title="Thao tác tiếp theo"
                                    description="Chỉ hiển thị các thao tác phù hợp với trạng thái hiện tại."
                                >
                                    <div className="purchase-detail-actions">
                                        {actions
                                            .filter(
                                                (action) =>
                                                    action !== "open_dispute" &&
                                                    action !== "cancel",
                                            )
                                            .map((action) => (
                                                <GamingButton
                                                    key={action}
                                                    variant="primary"
                                                    loading={acting === action}
                                                    onClick={() =>
                                                        run(
                                                            () =>
                                                                transactionRepository.action(
                                                                    transaction.id,
                                                                    action,
                                                                ),
                                                            action,
                                                        )
                                                    }
                                                >
                                                    {actionLabels[action] ||
                                                        valueLabel(action)}
                                                </GamingButton>
                                            ))}
                                        {actions.includes("open_dispute") ? (
                                            <GamingButton
                                                variant="secondary"
                                                loading={acting === "dispute"}
                                                onClick={() =>
                                                    run(
                                                        () =>
                                                            transactionRepository.openDispute(
                                                                transaction.id,
                                                                {
                                                                    reason: "other",
                                                                    description:
                                                                        "Khách hàng yêu cầu quản trị viên kiểm tra giao dịch.",
                                                                    evidence:
                                                                        [],
                                                                },
                                                            ),
                                                        "dispute",
                                                    )
                                                }
                                            >
                                                Mở yêu cầu tranh chấp
                                            </GamingButton>
                                        ) : null}
                                        <Link
                                            className="mbn-button mbn-button--secondary"
                                            to="/account/cases"
                                        >
                                            <span className="mbn-button__label">
                                                Trung tâm yêu cầu
                                            </span>
                                        </Link>
                                        <Link
                                            className="mbn-button mbn-button--secondary"
                                            to="/policies/tranh-chap-khieu-nai"
                                        >
                                            <span className="mbn-button__label">
                                                Xem quy trình tranh chấp
                                            </span>
                                        </Link>
                                    </div>
                                </PageSection>
                            ) : null}
                            <PageSection
                                title="Tiến trình giao dịch"
                                description="Lịch sử sự kiện của cả hai bên theo thứ tự thời gian."
                            >
                                <ol className="transaction-timeline">
                                    {(transaction.events || []).map((event) => {
                                        const outcome = event.metadata?.outcome;
                                        return (
                                            <li
                                                className="is-done"
                                                key={event.id}
                                            >
                                                <b>{event.title}</b>
                                                <span>
                                                    {event.description ||
                                                        dateTime(
                                                            event.created_at,
                                                        )}
                                                </span>
                                                {outcome ? (
                                                    <small>
                                                        Kết quả:{" "}
                                                        {disputeOutcomeLabels[
                                                            outcome
                                                        ] ||
                                                            valueLabel(outcome)}
                                                    </small>
                                                ) : null}
                                            </li>
                                        );
                                    })}
                                </ol>
                            </PageSection>
                        </PageStack>
                    </PageColumns>
                </PageStack>
            ) : null}
            <GamingModal
                open={Boolean(bankPayment)}
                title="THANH TOÁN CHUYỂN KHOẢN"
                onClose={closeBankPayment}
                width={500}
                footer={
                    <>
                        <GamingButton
                            variant="danger"
                            onClick={closeBankPayment}
                        >
                            Hủy
                        </GamingButton>
                        <GamingButton
                            variant="primary"
                            loading={acting === `bank-${bankPayment?.id}`}
                            onClick={confirmBankPayment}
                        >
                            Tôi đã chuyển khoản
                        </GamingButton>
                    </>
                }
            >
                {bankQr ? (
                    <div className="payment-qr-modal">
                        <MarketplaceImage
                            src={bankQr.qr_url}
                            alt="Mã QR thanh toán"
                        />
                        <DefinitionGrid
                            items={[
                                {
                                    label: "Ngân hàng",
                                    value:
                                        bankQr.bank?.bank_name ||
                                        bankQr.bank?.name,
                                },
                                {
                                    label: "Số tài khoản",
                                    value: bankQr.bank?.account_no,
                                },
                                {
                                    label: "Chủ tài khoản",
                                    value: bankQr.bank?.account_name,
                                },
                                {
                                    label: "Số tiền",
                                    value: formatMoney(
                                        bankQr.amount || bankPayment?.amount,
                                    ),
                                },
                                {
                                    label: "Nội dung",
                                    value: bankQr.transfer_content,
                                },
                            ]}
                        />
                        <FormField
                            label="Mã giao dịch ngân hàng"
                            hint="Không bắt buộc nếu biên nhận không có mã tham chiếu."
                        >
                            <BaseInput
                                value={bankReference}
                                onChange={(event) =>
                                    setBankReference(event.target.value)
                                }
                                placeholder="Nhập mã tham chiếu trên biên nhận"
                            />
                        </FormField>
                    </div>
                ) : null}
            </GamingModal>
        </PageShell>
    );
}

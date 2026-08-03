import { QrcodeOutlined } from "@ant-design/icons";
import GamingButton from "../base/GamingButton";
import GamingModal, { ModalFooterNote } from "../base/GamingModal";
import { BaseInput } from "../base/FormControls";
import { formatMoney } from "../../utils/format";
import PurchasePolicyPanel from "./PurchasePolicyPanel";

export default function GamePurchaseModal({
    account,
    amountDueNow,
    code,
    deposit,
    discountPercent,
    finalPaymentAmount,
    hasOriginalPrice,
    initialPaymentAmount,
    item,
    listingType,
    onClose,
    onLogin,
    onSetPaymentMethod,
    onSetShowPolicy,
    onSubmit,
    originalPrice,
    paymentMethod,
    price,
    product,
    purchaseOpen,
    purchaseTab,
    selectedRate,
    showPolicy,
    submitting,
}) {
    const title =
        listingType === "rental"
            ? "XÁC NHẬN THUÊ TÀI KHOẢN"
            : purchaseTab === "deposit"
              ? "ĐẶT CỌC TÀI KHOẢN"
              : purchaseTab === "installment"
                ? "MUA TÀI KHOẢN TRẢ GÓP"
                : purchaseTab === "qr"
                  ? "MUA TÀI KHOẢN BẰNG MÃ QR"
                  : "XÁC NHẬN MUA TÀI KHOẢN";

    return (
        <GamingModal
            open={purchaseOpen}
            title={title}
            onClose={onClose}
            width={purchaseTab === "qr" ? 460 : 500}
            className="purchase-gaming-modal"
            bodyClassName="purchase-gaming-modal__body"
            footer={
                <>
                    <ModalFooterNote>
                        {account
                            ? "Kiểm tra kỹ thông tin trước khi xác nhận."
                            : "Bạn chưa đăng nhập. Hãy đăng nhập để mua."}
                    </ModalFooterNote>
                    <GamingButton
                        variant="danger"
                        size="md"
                        className="modal-action-button"
                        onClick={onClose}
                    >
                        Hủy
                    </GamingButton>
                    <GamingButton
                        variant="primary"
                        size="md"
                        className="modal-action-button"
                        disabled={submitting}
                        loading={submitting}
                        onClick={account ? onSubmit : onLogin}
                    >
                        {account ? "Thanh toán" : "Đăng nhập"}
                    </GamingButton>
                </>
            }
        >
            {listingType === "sale" &&
                (purchaseTab === "installment" ||
                    purchaseTab === "deposit") && (
                    <div className="purchase-mode-tabs">
                        <button
                            type="button"
                            className={!showPolicy ? "active" : ""}
                            onClick={() => onSetShowPolicy(false)}
                        >
                            THÔNG TIN
                        </button>
                        <button
                            type="button"
                            className={showPolicy ? "active" : ""}
                            onClick={() => onSetShowPolicy(true)}
                        >
                            {purchaseTab === "installment"
                                ? "QUY ĐỊNH TRẢ GÓP"
                                : "QUY ĐỊNH ĐẶT CỌC"}
                        </button>
                    </div>
                )}

            {!showPolicy && (
                <>
                    <div className="purchase-info-table">
                        <div>
                            <b>Mã số</b>
                            <span>{item?.code || code}</span>
                        </div>
                        <div>
                            <b>Tên game</b>
                            <span>{product.name || item?.title || "—"}</span>
                        </div>
                        <div>
                            <b>Nhà phát hành</b>
                            <span>TeaMobi</span>
                        </div>
                        {listingType === "rental" && (
                            <>
                                <div>
                                    <b>Kỳ hạn thuê</b>
                                    <span>
                                        {selectedRate?.label ||
                                            `${item?.minimum_rental_period || 1} ${item?.rental_price_unit || "ngày"}`}
                                    </span>
                                </div>
                                <div>
                                    <b>Cách thu tiền</b>
                                    <span>
                                        {item?.rental_billing_mode ===
                                        "periodic"
                                            ? "Theo từng chu kỳ"
                                            : "Thu trước toàn kỳ"}
                                    </span>
                                </div>
                                <div>
                                    <b>Tiền thuê</b>
                                    <span>{formatMoney(price)}</span>
                                </div>
                                <div>
                                    <b>Tiền cọc</b>
                                    <span>{formatMoney(deposit)}</span>
                                </div>
                                <div>
                                    <b>Cần thanh toán khi tạo thuê</b>
                                    <span className="money-highlight">
                                        {formatMoney(amountDueNow)}
                                    </span>
                                </div>
                            </>
                        )}
                        <div className="purchase-price-row">
                            <b>
                                <span>Mức giá</span>
                                {discountPercent > 0 && (
                                    <em>Giảm giá: {discountPercent}%</em>
                                )}
                            </b>
                            <span>
                                {hasOriginalPrice && (
                                    <del>{formatMoney(originalPrice)}</del>
                                )}
                                <strong>{formatMoney(price)}</strong>
                            </span>
                        </div>
                        {purchaseTab === "installment" && (
                            <>
                                <div>
                                    <b>Cần thanh toán lần đầu</b>
                                    <span className="money-highlight">
                                        {formatMoney(initialPaymentAmount)}
                                    </span>
                                </div>
                                <div>
                                    <b>Cần thanh toán cuối cùng</b>
                                    <span>{formatMoney(finalPaymentAmount)}</span>
                                </div>
                                <div>
                                    <b>Điều kiện hủy</b>
                                    <span>Phụ thuộc trạng thái thanh toán và hồ sơ giao dịch.</span>
                                </div>
                                <div>
                                    <b>Hạn thanh toán</b>
                                    <span>1 tháng kể từ ngày trả góp</span>
                                </div>
                            </>
                        )}
                        {purchaseTab === "deposit" && (
                            <>
                                <div>
                                    <b>Số tiền đặt cọc</b>
                                    <span className="money-highlight">
                                        {formatMoney(deposit)}
                                    </span>
                                </div>
                                <div>
                                    <b>Cần thanh toán cuối cùng</b>
                                    <span>{formatMoney(finalPaymentAmount)}</span>
                                </div>
                                <div>
                                    <b>Điều kiện hủy</b>
                                    <span>Phụ thuộc trạng thái giao dịch và thỏa thuận đặt cọc.</span>
                                </div>
                                <div>
                                    <b>Hạn thanh toán</b>
                                    <span>7 ngày kể từ ngày đặt cọc</span>
                                </div>
                            </>
                        )}
                        {purchaseTab === "info" && listingType === "sale" && (
                            <div>
                                <b>Cần thanh toán khi mua</b>
                                <span className="money-highlight">
                                    {formatMoney(amountDueNow)}
                                </span>
                            </div>
                        )}
                        {purchaseTab === "qr" && (
                            <div>
                                <b>Cần thanh toán qua QR</b>
                                <span className="money-highlight">
                                    {formatMoney(amountDueNow)}
                                </span>
                            </div>
                        )}
                    </div>

                    {purchaseTab !== "qr" && (
                        <div className="purchase-payment-methods">
                            <label>
                                <BaseInput
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === "balance"}
                                    onChange={() =>
                                        onSetPaymentMethod("balance")
                                    }
                                />
                                <span />
                                Thanh toán bằng số dư (
                                {formatMoney(account?.balance || 0)})
                            </label>
                            <label>
                                <BaseInput
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === "bank"}
                                    onChange={() => onSetPaymentMethod("bank")}
                                />
                                <span />
                                Thanh toán bằng chuyển khoản
                            </label>
                        </div>
                    )}

                    {(purchaseTab === "qr" || paymentMethod === "bank") && (
                        <div className="purchase-bank-guidance">
                            <QrcodeOutlined />
                            <div>
                                <b>
                                    Mã QR được tạo ngay sau khi tạo giao dịch
                                </b>
                                <p>
                                    Hệ thống sinh QR đúng số tiền và nội dung
                                    chuyển khoản. Không chuyển khoản theo thông
                                    tin gửi riêng bên ngoài MBN.
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}

            {showPolicy ? (
                <PurchasePolicyPanel purchaseTab={purchaseTab} />
            ) : null}
        </GamingModal>
    );
}

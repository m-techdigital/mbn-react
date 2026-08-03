import {
    HeartFilled,
    HeartOutlined,
    QrcodeOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import AccountCard from "../components/account/AccountCard";
import { games } from "../data/catalog";
import PageShell from "../components/base/PageShell";
import { useRemoteData } from "../hooks/useRemoteData";
import { gameRepository, trustRepository } from "../services/repositories";
import { arrayData, formatMoney, imageOf } from "../utils/format";
import { useAuth } from "../context/AuthContext";
import GamingModal, { ModalFooterNote } from "../components/base/GamingModal";
import GamingButton from "../components/base/GamingButton";
import EmptyState from "../components/base/EmptyState";
import { showToast } from "../utils/toast";
import { getUserFacingError } from "../utils/userFacingError";
import MarketplaceImage from "../components/base/MarketplaceImage";
import { BaseInput } from "../components/base/FormControls";
import GameDetailGallery from "../components/marketplace/GameDetailGallery";
import { useGamePurchaseFlow } from "../hooks/marketplace/useGamePurchaseFlow";

const typeByPath = (path) =>
    path.includes("ninja-school")
        ? "ninjas"
        : path.includes("ngoc-rong")
          ? "dragonBalls"
          : "avatars";
const normalizeOfferMode = (mode) =>
    mode === "sell" ? "sale" : mode === "rent" ? "rental" : mode;

export default function GameDetailPage() {
    const { code } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const type = typeByPath(location.pathname);
    const { customer, user } = useAuth();
    const account = customer || user;
    const {
        data: item,
        loading,
        error,
        reload,
    } = useRemoteData(() => gameRepository[type].show(code), [type, code], {
        queryKey: "game-detail",
        staleTime: 60000,
    });
    const {
        data: recommendationPage,
        loading: recommendationsLoading,
        error: recommendationsError,
        reload: reloadRecommendations,
    } = useRemoteData(
        () => gameRepository[type].list({ per_page: 9, status: "published" }),
        [type, code],
        {
            queryKey: "game-recommendations",
            staleTime: 30000,
            keepPreviousData: true,
        },
    );
    const [activeSlide, setActiveSlide] = useState(0);
    const [slideDirection, setSlideDirection] = useState("next");
    const product = useMemo(() => item ?? {}, [item]);
    const productRecord = item?.product || product;
    const productMetadata = productRecord?.metadata || {};
    const availableTypes = useMemo(
        () => [
            ...new Set(
                (item?.offer_modes || item?.transaction_types || [])
                    .map(normalizeOfferMode)
                    .filter((mode) => ["sale", "rental"].includes(mode)),
            ),
        ],
        [item?.offer_modes, item?.transaction_types],
    );
    const [transactionType, setTransactionType] = useState("sale");
    const listingType = transactionType;
    const rentalRates = item?.rental_rates || item?.rentalRates || [];
    const [selectedRateId, setSelectedRateId] = useState(null);
    const selectedRate =
        rentalRates.find(
            (rate) => String(rate.id) === String(selectedRateId),
        ) ||
        rentalRates.find((rate) => rate.is_default) ||
        rentalRates[0] ||
        null;
    const price =
        listingType === "rental"
            ? selectedRate?.price || item?.rental_price
            : item?.sale_price;
    const {
        purchaseOpen,
        purchaseTab,
        paymentMethod,
        showPolicy,
        submitting,
        instantQr,
        instantTransactionId,
        openLogin,
        openTransaction,
        transact,
        setPurchaseOpen,
        setPurchaseTab,
        setPaymentMethod,
        setShowPolicy,
        setInstantQr,
        setInstantTransactionId,
    } = useGamePurchaseFlow({
        item,
        account,
        selectedRate,
        listingType,
        navigate,
    });
    const [favorite, setFavorite] = useState(false);
    useEffect(() => {
        setActiveSlide(0);
        setSelectedRateId(null);
        setTransactionType(availableTypes.includes("sale") ? "sale" : "rental");
    }, [availableTypes, item?.id]);
    useEffect(() => {
        if (!item?.id) return;
        if (account)
            trustRepository
                .favorites({ per_page: 100 })
                .then((payload) => {
                    const rows = payload?.data || payload || [];
                    setFavorite(
                        rows.some(
                            (row) => String(row.product_id) === String(item.id),
                        ),
                    );
                })
                .catch(() => {});
    }, [item?.id, account]);
    const toggleFavorite = async () => {
        if (!account) {
            openLogin();
            return;
        }
        try {
            if (favorite) await trustRepository.unfavorite(item.id);
            else await trustRepository.favorite(item.id);
            setFavorite((value) => !value);
            showToast(
                "success",
                favorite ? "Đã bỏ lưu sản phẩm." : "Đã lưu sản phẩm.",
            );
        } catch (requestError) {
            showToast(
                "error",
                getUserFacingError(
                    requestError,
                    "Không thể cập nhật tin đã lưu.",
                ),
            );
        }
    };

    const images = useMemo(() => {
        const source =
            product?.images?.map((entry) => entry.url || entry) ||
            item?.images?.map?.((entry) => entry.url || entry) ||
            [];
        const fallback = imageOf(product || item || {});
        const unique = [...new Set(source.filter(Boolean))];
        return unique.length ? unique : [fallback];
    }, [product, item]);

    const game = games.find((entry) => entry.key === type);
    const suggestions = arrayData(recommendationPage)
        .filter(
            (entry) =>
                String(entry.id) !== String(item?.id) &&
                entry.status !== "reserved",
        )
        .slice(0, 8);

    const originalPrice = item?.original_price || Number(price || 0) * 1.2;
    const normalizedPrice = Number(price || 0);
    const deposit = Number(
        selectedRate?.deposit_amount ??
            (listingType === "rental"
                ? item?.rental_deposit_amount
                : item?.sale_deposit_amount) ??
            normalizedPrice * 0.3,
    );
    const initialPaymentAmount =
        purchaseTab === "installment"
            ? Number(item?.minimum_initial_payment || normalizedPrice * 0.7)
            : purchaseTab === "deposit"
              ? deposit
              : normalizedPrice;
    const finalPaymentAmount = Math.max(
        0,
        normalizedPrice -
            (purchaseTab === "deposit" || purchaseTab === "installment"
                ? initialPaymentAmount
                : normalizedPrice),
    );
    const amountDueNow =
        listingType === "rental"
            ? normalizedPrice + deposit
            : initialPaymentAmount;
    const detailRows = [
        ["Phái", item?.gender || productMetadata.gender || "Chưa cập nhật"],
        ["Cấp độ", item?.level || productMetadata.level || "Chưa cập nhật"],
        ["Vũ khí", item?.weapon || productMetadata.weapon || "Chưa cập nhật"],
        ["Máy chủ", item?.server || productMetadata.server || "Chưa cập nhật"],
        [
            "Mô tả",
            item?.description ||
                productRecord?.description ||
                "Chưa có mô tả chi tiết.",
        ],
    ];

    const previousSlide = () => {
        setSlideDirection("prev");
        setActiveSlide(
            (current) => (current - 1 + images.length) % images.length,
        );
    };
    const nextSlide = () => {
        setSlideDirection("next");
        setActiveSlide((current) => (current + 1) % images.length);
    };
    const selectSlide = (index) => {
        setSlideDirection(index > activeSlide ? "next" : "prev");
        setActiveSlide(index);
    };

    return (
        <PageShell
            title={item?.title || `Nick game - Mã số: ${code}`}
            loading={loading}
            loadingVariant="detail"
            error={error}
            onReload={reload}
            width="wide"
            className="game-detail-page"
        >
            {item && (
                <>
                    <div className="detail-layout original-detail v6-detail">
                        <GameDetailGallery
                            images={images}
                            activeSlide={activeSlide}
                            slideDirection={slideDirection}
                            onPrevious={previousSlide}
                            onNext={nextSlide}
                            onSelect={selectSlide}
                        />

                        <section className="detail-card original-detail-card v6-detail-card">
                            <h3>Thông tin chi tiết</h3>
                            <div className="detail-info-table">
                                {detailRows.map(([label, value]) => (
                                    <div key={label}>
                                        <b>{label}</b>
                                        <span>{value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="detail-price-row">
                                <div>
                                    <small>Giá niêm yết</small>
                                    <del>{formatMoney(originalPrice)}</del>
                                </div>
                                <div>
                                    <small>
                                        {selectedRate?.label ||
                                            "Mức giá hiện tại"}
                                    </small>
                                    <strong>{formatMoney(price)}</strong>
                                </div>
                            </div>
                            {availableTypes.length > 1 && (
                                <div className="transaction-type-selector">
                                    <b>Chọn loại giao dịch</b>
                                    <div>
                                        {availableTypes.map((type) => (
                                            <button
                                                type="button"
                                                key={type}
                                                className={
                                                    transactionType === type
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    setTransactionType(type)
                                                }
                                            >
                                                {type === "rental"
                                                    ? "Cho thuê"
                                                    : "Bán"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {listingType === "rental" &&
                                rentalRates.length > 0 && (
                                    <div className="rental-rate-selector">
                                        <b>Chọn kỳ hạn thuê</b>
                                        <div>
                                            {rentalRates.map((rate) => (
                                                <button
                                                    type="button"
                                                    key={rate.id}
                                                    className={
                                                        String(
                                                            selectedRate?.id,
                                                        ) === String(rate.id)
                                                            ? "active"
                                                            : ""
                                                    }
                                                    onClick={() =>
                                                        setSelectedRateId(
                                                            rate.id,
                                                        )
                                                    }
                                                >
                                                    <span>{rate.label}</span>
                                                    <strong>
                                                        {formatMoney(
                                                            rate.price,
                                                        )}
                                                    </strong>
                                                    <small>
                                                        Cọc{" "}
                                                        {formatMoney(
                                                            rate.deposit_amount ??
                                                                item?.rental_deposit_amount ??
                                                                0,
                                                        )}
                                                    </small>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            <div className="detail-action-grid">
                                <GamingButton
                                    variant="secondary"
                                    icon={
                                        favorite ? (
                                            <HeartFilled />
                                        ) : (
                                            <HeartOutlined />
                                        )
                                    }
                                    onClick={toggleFavorite}
                                >
                                    {favorite
                                        ? "Đã lưu sản phẩm"
                                        : "Lưu sản phẩm"}
                                </GamingButton>
                                <GamingButton
                                    variant="primary"
                                    icon={<QrcodeOutlined />}
                                    onClick={() => openTransaction("qr")}
                                >
                                    Thanh toán QR
                                </GamingButton>
                                <GamingButton
                                    icon={<ShoppingCartOutlined />}
                                    onClick={() => openTransaction("info")}
                                >
                                    {listingType === "rental"
                                        ? "Thuê ngay"
                                        : "Mua ngay"}
                                </GamingButton>
                                {listingType === "sale" &&
                                    item?.installment_enabled && (
                                        <GamingButton
                                            onClick={() =>
                                                openTransaction("installment")
                                            }
                                        >
                                            Mua trả góp
                                        </GamingButton>
                                    )}
                                {listingType === "sale" &&
                                    Number(
                                        listingType === "rental"
                                            ? item?.rental_deposit_amount
                                            : item?.sale_deposit_amount || 0,
                                    ) > 0 && (
                                        <GamingButton
                                            onClick={() =>
                                                openTransaction("deposit")
                                            }
                                        >
                                            Đặt cọc giữ tài khoản
                                        </GamingButton>
                                    )}
                            </div>
                            <div className="contact-buttons">
                                <GamingButton variant="contact">
                                    Nhắn tin Zalo
                                </GamingButton>
                                <GamingButton variant="contact">
                                    Messenger
                                </GamingButton>
                            </div>
                        </section>
                    </div>

                    <div
                        className="mobile-purchase-dock"
                        role="region"
                        aria-label="Thao tác mua hoặc thuê"
                    >
                        <div>
                            <small>Mức giá</small>
                            <strong>{formatMoney(price)}</strong>
                        </div>
                        <GamingButton
                            variant="secondary"
                            size="md"
                            onClick={() => openTransaction("qr")}
                        >
                            QR
                        </GamingButton>
                        <GamingButton
                            variant="primary"
                            size="md"
                            onClick={() => openTransaction("info")}
                        >
                            {listingType === "rental"
                                ? "Thuê ngay"
                                : "Mua ngay"}
                        </GamingButton>
                    </div>

                    <section className="suggested-panel v6-suggested-panel">
                        <div className="legacy-section-title">
                            TÀI KHOẢN GỢI Ý
                        </div>
                        {recommendationsLoading ? (
                            <div
                                className="recommendation-loading"
                                role="status"
                            >
                                Đang tải tài khoản phù hợp…
                            </div>
                        ) : recommendationsError ? (
                            <EmptyState
                                compact
                                title="Không tải được tài khoản gợi ý"
                                description="Kết nối dữ liệu đang gián đoạn."
                                actionLabel="Thử lại"
                                onAction={reloadRecommendations}
                            />
                        ) : suggestions.length ? (
                            <div className="recommendation-list-grid">
                                {suggestions.map((entry) => (
                                    <AccountCard
                                        item={entry}
                                        basePath={game?.path || "/"}
                                        key={entry.id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                compact
                                title="Chưa có tài khoản gợi ý"
                                description="Các tài khoản đang mở bán cùng trò chơi sẽ xuất hiện tại đây."
                            />
                        )}
                    </section>

                    <GamingModal
                        open={purchaseOpen}
                        title={
                            listingType === "rental"
                                ? "XÁC NHẬN THUÊ TÀI KHOẢN"
                                : purchaseTab === "deposit"
                                  ? "ĐẶT CỌC TÀI KHOẢN"
                                  : purchaseTab === "installment"
                                    ? "MUA TÀI KHOẢN TRẢ GÓP"
                                    : purchaseTab === "qr"
                                      ? "MUA TÀI KHOẢN BẰNG MÃ QR"
                                      : "XÁC NHẬN MUA TÀI KHOẢN"
                        }
                        onClose={() => setPurchaseOpen(false)}
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
                                    onClick={() => setPurchaseOpen(false)}
                                >
                                    Hủy
                                </GamingButton>
                                <GamingButton
                                    variant="primary"
                                    size="md"
                                    className="modal-action-button"
                                    disabled={submitting}
                                    loading={submitting}
                                    onClick={account ? transact : openLogin}
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
                                        onClick={() => setShowPolicy(false)}
                                    >
                                        THÔNG TIN
                                    </button>
                                    <button
                                        type="button"
                                        className={showPolicy ? "active" : ""}
                                        onClick={() => setShowPolicy(true)}
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
                                        <span>
                                            {product.name || item?.title || "—"}
                                        </span>
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
                                                <b>Tiền cọc hoàn lại</b>
                                                <span>
                                                    {formatMoney(deposit)}
                                                </span>
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
                                            <em>Giảm giá: 20%</em>
                                        </b>
                                        <span>
                                            <del>
                                                {formatMoney(originalPrice)}
                                            </del>
                                            <strong>
                                                {formatMoney(price)}
                                            </strong>
                                        </span>
                                    </div>
                                    {purchaseTab === "installment" && (
                                        <>
                                            <div>
                                                <b>Cần thanh toán lần đầu</b>
                                                <span className="money-highlight">
                                                    {formatMoney(
                                                        initialPaymentAmount,
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                <b>Cần thanh toán cuối cùng</b>
                                                <span>
                                                    {formatMoney(
                                                        finalPaymentAmount,
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                <b>Hoàn tiền khi hủy</b>
                                                <span>
                                                    {formatMoney(
                                                        initialPaymentAmount *
                                                            0.5,
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                <b>Hạn thanh toán</b>
                                                <span>
                                                    1 tháng kể từ ngày trả góp
                                                </span>
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
                                                <span>
                                                    {formatMoney(
                                                        finalPaymentAmount,
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                <b>Hoàn tiền khi hủy</b>
                                                <span>
                                                    {formatMoney(deposit * 0.2)}
                                                </span>
                                            </div>
                                            <div>
                                                <b>Hạn thanh toán</b>
                                                <span>
                                                    7 ngày kể từ ngày đặt cọc
                                                </span>
                                            </div>
                                        </>
                                    )}
                                    {purchaseTab === "info" &&
                                        listingType === "sale" && (
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
                                                checked={
                                                    paymentMethod === "balance"
                                                }
                                                onChange={() =>
                                                    setPaymentMethod("balance")
                                                }
                                            />
                                            <span />
                                            Thanh toán bằng số dư (
                                            {formatMoney(account?.balance || 0)}
                                            )
                                        </label>
                                        <label>
                                            <BaseInput
                                                type="radio"
                                                name="payment"
                                                checked={
                                                    paymentMethod === "bank"
                                                }
                                                onChange={() =>
                                                    setPaymentMethod("bank")
                                                }
                                            />
                                            <span />
                                            Thanh toán bằng chuyển khoản
                                        </label>
                                    </div>
                                )}

                                {(purchaseTab === "qr" ||
                                    paymentMethod === "bank") && (
                                    <div className="purchase-bank-guidance">
                                        <QrcodeOutlined />
                                        <div>
                                            <b>
                                                Mã QR được tạo ngay sau khi tạo
                                                giao dịch
                                            </b>
                                            <p>
                                                Hệ thống sinh QR đúng số tiền và
                                                nội dung chuyển khoản. Không
                                                chuyển khoản theo thông tin gửi
                                                riêng bên ngoài MBN.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {showPolicy && purchaseTab === "installment" && (
                            <div className="purchase-policy">
                                <h3>QUY ĐỊNH MUA TRẢ GÓP</h3>
                                <p>
                                    - Thanh toán trước <b>70%</b> giá trị Nick,
                                    bạn sẽ nhận được{" "}
                                    <b>Tài khoản và Mật khẩu</b>.
                                </p>
                                <p>
                                    - Hạn thanh toán: <b>1 tháng</b> kể từ ngày
                                    trả góp.
                                </p>
                                <p>
                                    - Số tiền thanh toán cuối cùng là phần còn
                                    lại sau khi trừ khoản đã thanh toán lần đầu.
                                </p>
                                <p>
                                    - Phí trả góp: <b>0%</b>.
                                </p>
                                <p>
                                    - Hoàn tất 100% giá trị Nick để nhận mã PIN
                                    chuyển đăng ký SIM nếu có.
                                </p>
                                <p>
                                    - Nếu hủy trước hạn, hoàn lại{" "}
                                    <b>50% số tiền đã thanh toán</b>.
                                </p>
                                <p>
                                    - Nếu quá hạn, giao dịch bị hủy và hoàn lại{" "}
                                    <b>30% số tiền đã thanh toán</b>.
                                </p>
                                <div className="purchase-policy__note">
                                    <b>Ví dụ:</b> Nick giá 1.000.000đ → thanh
                                    toán trước 700.000đ. Nếu hủy trước hạn nhận
                                    lại 350.000đ; nếu quá hạn nhận lại 210.000đ.
                                </div>
                            </div>
                        )}

                        {showPolicy && purchaseTab === "deposit" && (
                            <div className="purchase-policy">
                                <h3>QUY ĐỊNH ĐẶT CỌC</h3>
                                <p>
                                    - Đặt cọc ban đầu <b>30%</b> giá trị tài
                                    khoản để giữ Nick.
                                </p>
                                <p>
                                    - Thời gian thanh toán phần còn lại:{" "}
                                    <b>7 ngày</b>.
                                </p>
                                <p>
                                    - Số tiền thanh toán cuối cùng là phần còn
                                    lại sau khi trừ khoản đặt cọc đã ghi nhận.
                                </p>
                                <p>
                                    - Phí đặt cọc: <b>0%</b>.
                                </p>
                                <p>
                                    - Nếu quá hạn, giao dịch bị hủy và chỉ hoàn
                                    lại <b>20% số tiền đã đặt cọc</b>.
                                </p>
                                <div className="purchase-policy__note">
                                    <b>Ví dụ:</b> Nick giá 1.000.000đ → đặt cọc
                                    trước 300.000đ. Nếu hủy hoặc quá hạn, số
                                    tiền hoàn theo chính sách hiển thị.
                                </div>
                            </div>
                        )}
                    </GamingModal>

                    <GamingModal
                        open={Boolean(instantQr)}
                        title="QUÉT MÃ QR ĐỂ THANH TOÁN"
                        onClose={() => {
                            setInstantQr(null);
                            setInstantTransactionId(null);
                        }}
                        width={520}
                        className="instant-payment-modal"
                        footer={
                            <>
                                <ModalFooterNote>
                                    QR đã gắn đúng số tiền và mã tham chiếu của
                                    giao dịch.
                                </ModalFooterNote>
                                <GamingButton
                                    variant="secondary"
                                    onClick={() => {
                                        setInstantQr(null);
                                        setInstantTransactionId(null);
                                    }}
                                >
                                    Đóng
                                </GamingButton>
                                <GamingButton
                                    variant="primary"
                                    onClick={() =>
                                        navigate(
                                            `/account/purchases/${instantTransactionId}`,
                                        )
                                    }
                                >
                                    Xem giao dịch
                                </GamingButton>
                            </>
                        }
                    >
                        {instantQr ? (
                            <div className="instant-payment-qr">
                                <MarketplaceImage
                                    src={instantQr.qr_url}
                                    alt="Mã QR thanh toán giao dịch"
                                />
                                <div className="instant-payment-qr__details">
                                    <div>
                                        <span>Ngân hàng</span>
                                        <b>
                                            {instantQr.bank?.bank_name ||
                                                instantQr.bank?.name ||
                                                "—"}
                                        </b>
                                    </div>
                                    <div>
                                        <span>Số tài khoản</span>
                                        <b>
                                            {instantQr.bank?.account_no || "—"}
                                        </b>
                                    </div>
                                    <div>
                                        <span>Chủ tài khoản</span>
                                        <b>
                                            {instantQr.bank?.account_name ||
                                                "—"}
                                        </b>
                                    </div>
                                    <div>
                                        <span>Số tiền</span>
                                        <b>
                                            {formatMoney(
                                                instantQr.amount ||
                                                    instantQr.payment?.amount,
                                            )}
                                        </b>
                                    </div>
                                    <div>
                                        <span>Nội dung</span>
                                        <b>
                                            {instantQr.transfer_content ||
                                                instantQr.payment?.code}
                                        </b>
                                    </div>
                                </div>
                                <p>
                                    Chuyển đúng số tiền và nội dung trên. Sau
                                    khi chuyển, mở chi tiết giao dịch để gửi mã
                                    tham chiếu đối soát.
                                </p>
                            </div>
                        ) : null}
                    </GamingModal>
                </>
            )}
        </PageShell>
    );
}

import "../styles/pages/detail.css";
import {
    HeartFilled,
    HeartOutlined,
    QrcodeOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router";
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
import { normalizeOfferMode } from "../utils/offerModes";
import MarketplaceImage from "../components/base/MarketplaceImage";
import GameDetailGallery from "../components/marketplace/GameDetailGallery";
import GamePurchaseModal from "../components/marketplace/GamePurchaseModal";
import { useGamePurchaseFlow } from "../hooks/marketplace/useGamePurchaseFlow";
import { rentalMoneyBreakdown } from "../utils/rentalMoney";

const typeByPath = (path) =>
    path.includes("ninja-school")
        ? "ninjas"
        : path.includes("ngoc-rong")
          ? "dragonBalls"
          : "avatars";
const hasValue = (value) => value !== undefined && value !== null && value !== "";
const firstDefined = (...values) =>
    values.find((value) => value !== undefined && value !== null && value !== "");
const numberValue = (...values) => Number(firstDefined(...values, 0) || 0);
const ratePrice = (rate) =>
    firstDefined(rate?.price, rate?.amount, rate?.rental_price);
const rateDeposit = (rate) =>
    firstDefined(rate?.deposit_amount, rate?.rental_deposit_amount);
const productAttributes = (record) =>
    record?.attributes && typeof record.attributes === "object"
        ? record.attributes
        : {};
const inferOfferTypes = (record) => {
    const explicitTypes = [
        ...(record?.transaction_types || []),
        ...(record?.offer_modes || []),
    ]
        .map(normalizeOfferMode)
        .filter((mode) => ["sale", "rental"].includes(mode));
    const inferredTypes = [];
    if (
        record?.sale_enabled === true ||
        hasValue(record?.sale_price) ||
        record?.installment_enabled
    )
        inferredTypes.push("sale");
    if (
        record?.rental_enabled === true ||
        hasValue(record?.rental_price) ||
        (record?.rental_rates || record?.rentalRates || []).length > 0
    )
        inferredTypes.push("rental");

    return [...new Set([...explicitTypes, ...inferredTypes])];
};

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
    const attributes = productAttributes(productRecord);
    const availableTypes = useMemo(
        () => inferOfferTypes(item),
        [item],
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
            ? numberValue(
                  ratePrice(selectedRate),
                  item?.rental_price,
                  item?.price,
              )
            : numberValue(item?.sale_price, item?.price);
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

    const originalPrice = numberValue(item?.original_price, price);
    const normalizedPrice = Number(price || 0);
    const hasOriginalPrice = originalPrice > normalizedPrice;
    const deposit = Number(
        firstDefined(
            rateDeposit(selectedRate),
            listingType === "rental"
                ? firstDefined(item?.rental_deposit_amount, item?.deposit_amount)
                : item?.sale_deposit_amount,
            0,
        ),
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
    const rentalMoney = rentalMoneyBreakdown({ rentalAmount: normalizedPrice, depositAmount: deposit });
    const amountDueNow =
        listingType === "rental"
            ? rentalMoney.initialAmount
            : initialPaymentAmount;
    const discountPercent = Number(item?.active_discount || 0);
    const detailRows = [
        [
            "Phái",
            firstDefined(
                item?.gender,
                item?.class,
                attributes.class,
                attributes.sex,
                productMetadata.gender,
                productMetadata.class,
                "Chưa cập nhật",
            ),
        ],
        [
            "Cấp độ",
            firstDefined(item?.level, productRecord?.level, "Chưa cập nhật"),
        ],
        [
            "Vũ khí",
            firstDefined(
                item?.weapon,
                attributes.weapon,
                productMetadata.weapon,
                "Chưa cập nhật",
            ),
        ],
        [
            "Máy chủ",
            firstDefined(
                item?.server,
                item?.server_name,
                productRecord?.server_name,
                productMetadata.server,
                "Chưa cập nhật",
            ),
        ],
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
                                    {hasOriginalPrice ? (
                                        <del>{formatMoney(originalPrice)}</del>
                                    ) : (
                                        <strong>{formatMoney(price)}</strong>
                                    )}
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
                                                            ratePrice(rate),
                                                        )}
                                                    </strong>
                                                    <small>
                                                        Cọc{" "}
                                                        {formatMoney(
                                                            firstDefined(
                                                                rate.deposit_amount,
                                                                rate.rental_deposit_amount,
                                                                item?.rental_deposit_amount ??
                                                                    item?.deposit_amount,
                                                                0,
                                                            ),
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

                    <GamePurchaseModal
                        account={account}
                        amountDueNow={amountDueNow}
                        code={code}
                        deposit={deposit}
                        discountPercent={discountPercent}
                        finalPaymentAmount={finalPaymentAmount}
                        hasOriginalPrice={hasOriginalPrice}
                        initialPaymentAmount={initialPaymentAmount}
                        item={item}
                        listingType={listingType}
                        onClose={() => setPurchaseOpen(false)}
                        onLogin={openLogin}
                        onSetPaymentMethod={setPaymentMethod}
                        onSetShowPolicy={setShowPolicy}
                        onSubmit={transact}
                        originalPrice={originalPrice}
                        paymentMethod={paymentMethod}
                        price={price}
                        product={product}
                        purchaseOpen={purchaseOpen}
                        purchaseTab={purchaseTab}
                        selectedRate={selectedRate}
                        showPolicy={showPolicy}
                        submitting={submitting}
                    />

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

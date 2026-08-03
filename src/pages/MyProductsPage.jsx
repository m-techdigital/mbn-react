import { Link } from "react-router-dom";

import EmptyState from "../components/base/EmptyState";
import GamingButton from "../components/base/GamingButton";
import MarketplaceImage from "../components/base/MarketplaceImage";
import PageSection from "../components/base/PageSection";
import PageShell from "../components/base/PageShell";
import StatusBadge from "../components/base/StatusBadge";
import { useRemoteData } from "../hooks/useRemoteData";
import { productRepository } from "../services/repositories";
import { arrayData, formatMoney } from "../utils/format";
import { valueLabel } from "../utils/labels";

export default function MyProductsPage() {
    const { data, loading, error, reload } = useRemoteData(
        () => productRepository.mine({ per_page: 50 }),
        [],
        { queryKey: "my-products", staleTime: 15000 },
    );
    const rows = arrayData(data);

    return (
        <PageShell
            title="Sản phẩm của tôi"
            description="Quản lý sản phẩm và các loại giao dịch được hỗ trợ."
            loading={loading}
            loadingVariant="list"
            error={error}
            onReload={reload}
            width="wide"
            actions={
                <Link to="/account/products/new">
                    <GamingButton variant="primary" size="sm">
                        Đăng sản phẩm
                    </GamingButton>
                </Link>
            }
        >
            <PageSection
                title="Danh sách sản phẩm"
                description={`${rows.length} sản phẩm được tìm thấy.`}
            >
                {rows.length ? (
                    <section className="seller-products-grid">
                        {rows.map((item) => (
                            <article
                                className="seller-product-card"
                                key={item.id}
                            >
                                <MarketplaceImage
                                    src={
                                        item.image_url ||
                                        "/images/mock/accounts/ninja-1.jpg"
                                    }
                                    alt={item.name}
                                />
                                <div>
                                    <StatusBadge
                                        status={
                                            item.approval_status || item.status
                                        }
                                    />
                                    <h2>{item.name}</h2>
                                    <p>
                                        {item.game_code} · {item.product_type}
                                    </p>
                                    <dl>
                                        <div>
                                            <dt>Loại giao dịch</dt>
                                            <dd>
                                                {(item.offer_modes || [])
                                                    .map((type) =>
                                                        valueLabel(type),
                                                    )
                                                    .concat(
                                                        item.installment_enabled
                                                            ? ["Trả góp"]
                                                            : [],
                                                    )
                                                    .join(", ") || "—"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>Giá bán</dt>
                                            <dd>
                                                {item.sale_enabled
                                                    ? formatMoney(
                                                          item.sale_price,
                                                      )
                                                    : "—"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>Giá thuê</dt>
                                            <dd>
                                                {item.rental_enabled
                                                    ? formatMoney(
                                                          item.rental_price,
                                                      )
                                                    : "—"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>Mã sản phẩm</dt>
                                            <dd>{item.code}</dd>
                                        </div>
                                    </dl>
                                    {item.rejection_reason ? (
                                        <p className="seller-product-card__reason">
                                            Lý do từ chối:{" "}
                                            {item.rejection_reason}
                                        </p>
                                    ) : null}
                                </div>
                            </article>
                        ))}
                    </section>
                ) : !loading ? (
                    <EmptyState
                        title="Chưa có sản phẩm"
                        description="Các sản phẩm đã gửi sẽ xuất hiện tại đây sau khi được tạo."
                    />
                ) : null}
            </PageSection>
        </PageShell>
    );
}

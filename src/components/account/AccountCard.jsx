import { ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { formatMoney, imageOf } from "../../utils/format";
import AsyncImage from "../base/AsyncImage";

const metaItems = (item) => [
    ["Mã số", item.code || item.id],
    ["Máy chủ", item.server || item.product?.metadata?.server || "—"],
    ["Cấp độ", item.level || item.product?.metadata?.level || "—"],
];

export default function AccountCard({ item, basePath }) {
    const code = item.code || item.id;
    const product = item.product || item;
    const currentPrice =
        item.rental_enabled && !item.sale_enabled
            ? item.rental_price
            : item.sale_price || item.selling_price || item.price;
    const oldPrice = item.original_price || item.selling_price;
    const discount = Number(item.active_discount || 0);

    return (
        <article className="account-card">
            <Link to={`${basePath}/${code}`} className="account-image">
                <AsyncImage
                    src={imageOf(product)}
                    alt={`Mã ${code}`}
                    loading="lazy"
                    decoding="async"
                />
                <span className="account-image-topline">
                    <b>Lv: {item.level || product.metadata?.level || "—"}</b>
                    <b>Sv: {item.server || product.metadata?.server || "—"}</b>
                </span>
                <span
                    className={`listing-chip ${item.rental_enabled && !item.sale_enabled ? "rental" : ""}`}
                >
                    {item.rental_enabled && !item.sale_enabled
                        ? "CHO THUÊ"
                        : "ĐANG BÁN"}
                </span>
            </Link>
            <div className="account-card-body">
                <div className="account-description">
                    {item.description ||
                        product.description ||
                        product.name ||
                        "Tài khoản game đã kiểm tra thông tin"}
                </div>
                <div className="account-stats">
                    {metaItems(item).map(([label, value]) => (
                        <div key={label}>
                            <span>{label}</span>
                            <b>{value}</b>
                        </div>
                    ))}
                </div>
                <div className="account-footer">
                    <div className="account-price">
                        {discount > 0 && <em>-{discount}%</em>}
                        <span>
                            {discount > 0 && oldPrice ? (
                                <del>{formatMoney(oldPrice)}</del>
                            ) : null}
                            <b>{formatMoney(currentPrice)}</b>
                        </span>
                    </div>
                    <Link
                        className="view-account-button"
                        to={`${basePath}/${code}`}
                    >
                        <span>Xem tài khoản</span>
                        <ArrowRightOutlined />
                    </Link>
                </div>
            </div>
        </article>
    );
}

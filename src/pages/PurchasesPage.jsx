import { Link } from "react-router";
import PageShell from "../components/base/PageShell";
import PageSection from "../components/base/PageSection";
import ResponsiveDataTable from "../components/base/ResponsiveDataTable";
import StatusBadge from "../components/base/StatusBadge";
import { useRemoteData } from "../hooks/useRemoteData";
import { transactionRepository } from "../services/repositories";
import { arrayData, formatMoney } from "../utils/format";
import { valueLabel } from "../utils/labels";

export default function PurchasesPage() {
    const { data, loading, error, reload } = useRemoteData(
        () =>
            transactionRepository.list({
                page: 1,
                per_page: 50,
                role: "buyer",
            }),
        [],
        { queryKey: "purchases", staleTime: 15000 },
    );
    const rows = arrayData(data);
    const columns = [
        {
            key: "code",
            title: "Mã giao dịch",
            dataIndex: "code",
            className: "is-code",
            width: "154px",
        },
        {
            key: "type",
            title: "Loại",
            width: "134px",
            render: (_, row) => valueLabel(row.transaction_type),
        },
        {
            key: "product",
            title: "Tài khoản trò chơi",
            render: (_, row) => (
                <span
                    className="mbn-cell-clamp"
                    title={row.product?.name || ""}
                >
                    {row.product?.name || "—"}
                </span>
            ),
        },
        {
            key: "partner",
            title: "Đối tác",
            width: "170px",
            render: (_, row) => (
                <span className="mbn-cell-clamp" title={row.seller?.name || ""}>
                    {row.seller?.name || "—"}
                </span>
            ),
        },
        {
            key: "total",
            title: "Tổng tiền",
            width: "142px",
            align: "right",
            render: (_, row) => (
                <strong className="money-value">
                    {formatMoney(row.total_payable)}
                </strong>
            ),
        },
        {
            key: "status",
            title: "Trạng thái",
            width: "192px",
            render: (_, row) => <StatusBadge status={row.status} />,
        },
        {
            key: "action",
            title: "Thao tác",
            fixed: "right",
            className: "is-action",
            width: "88px",
            align: "center",
            render: (_, row) => (
                <Link
                    className="table-view-link"
                    to={`/account/purchases/${row.id}`}
                >
                    Xem
                </Link>
            ),
        },
    ];

    return (
        <PageShell
            title="Giao dịch mua và thuê"
            description="Theo dõi thanh toán, bàn giao, hoàn trả, tài liệu và khiếu nại của từng giao dịch."
            loading={loading}
            loadingVariant="table"
            error={error}
            onReload={reload}
            width="wide"
        >
            <PageSection
                title="Danh sách giao dịch"
                description={`${rows.length} giao dịch được tìm thấy.`}
            >
                <ResponsiveDataTable
                    columns={columns}
                    rows={rows}
                    emptyText="Chưa có giao dịch mua hoặc thuê"
                />
            </PageSection>
        </PageShell>
    );
}

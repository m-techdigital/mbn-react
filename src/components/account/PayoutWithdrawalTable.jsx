import GamingButton from "../base/GamingButton";
import ResponsiveDataTable from "../base/ResponsiveDataTable";
import StatusBadge from "../base/StatusBadge";
import { payoutRepository } from "../../services/repositories";
import { formatMoney } from "../../utils/format";

export default function PayoutWithdrawalTable({ rows, busy, submit }) {
    const columns = [
        { key: "code", title: "Mã yêu cầu", dataIndex: "code" },
        { key: "amount", title: "Số tiền yêu cầu", dataIndex: "amount", render: formatMoney },
        { key: "net", title: "Thực nhận", dataIndex: "net_amount", render: formatMoney },
        {
            key: "account",
            title: "Tài khoản nhận",
            render: (_, row) => `${row.payout_account?.bank_name || ""} • ${row.payout_account?.account_number || ""}`,
        },
        { key: "status", title: "Trạng thái", dataIndex: "status", render: (value) => <StatusBadge status={value} /> },
        {
            key: "submitted_at",
            title: "Ngày gửi",
            dataIndex: "submitted_at",
            render: (value) => (value ? new Date(value).toLocaleString("vi-VN") : "—"),
        },
        {
            key: "actions",
            title: "Thao tác",
            render: (_, row) =>
                row.status === "submitted" ? (
                    <GamingButton
                        size="small"
                        variant="secondary"
                        loading={busy === `cancel-${row.id}`}
                        onClick={() => submit(
                            `cancel-${row.id}`,
                            () => payoutRepository.cancelWithdrawal(row.id),
                            "Đã hủy yêu cầu rút tiền.",
                        )}
                    >
                        Hủy yêu cầu
                    </GamingButton>
                ) : "—",
        },
    ];

    return (
        <ResponsiveDataTable
            columns={columns}
            rows={rows}
            rowKey="id"
            minWidth={900}
            emptyText="Chưa có yêu cầu rút tiền."
        />
    );
}

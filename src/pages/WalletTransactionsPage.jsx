import PageShell from '../components/base/PageShell';
import PageSection, { MetricGrid, PageStack } from '../components/base/PageSection';
import ResponsiveDataTable from '../components/base/ResponsiveDataTable';
import StatusBadge from '../components/base/StatusBadge';
import { useRemoteData } from '../hooks/useRemoteData';
import { walletRepository } from '../services/repositories';
import { formatMoney } from '../utils/format';
import { valueLabel } from '../utils/labels';

export default function WalletTransactionsPage() {
  const { data, loading, error, reload } = useRemoteData(() => walletRepository.transactions({ page: 1, per_page: 100 }), [], { queryKey: 'wallet-transactions', staleTime: 15000 });
  const rows = data?.data || [];
  const wallet = data?.wallet || {};
  const columns = [
    { key: 'time', title: 'Thời gian', dataIndex: 'occurred_at', width: '168px', render: (value) => value ? new Date(value).toLocaleString('vi-VN') : '—' },
    { key: 'type', title: 'Nghiệp vụ', dataIndex: 'type', className: 'is-truncate', render: (value, row) => <div className="table-primary-cell"><b>{valueLabel(value)}</b><small>{row.balance_bucket === 'held' ? 'Khoản tạm giữ' : 'Khoản khả dụng'} · {row.external_reference || row.code}</small></div> },
    { key: 'amount', title: 'Số tiền', dataIndex: 'amount', width: '132px', align: 'right', render: (value, row) => <strong className={row.direction === 'debit' ? 'money-out' : 'money-in'}>{row.direction === 'debit' ? '-' : '+'}{formatMoney(value)}</strong> },
    { key: 'before', title: 'Số dư trước', width: '132px', align: 'right', render: (_, row) => formatMoney((row.balance_bucket === 'held' ? row.held_before : row.available_before) || 0) },
    { key: 'after', title: 'Số dư sau', width: '132px', align: 'right', render: (_, row) => formatMoney((row.balance_bucket === 'held' ? row.held_after : row.available_after) || 0) },
    { key: 'status', title: 'Trạng thái', dataIndex: 'status', width: '150px', render: (value) => <StatusBadge status={value} /> },
  ];

  const metrics = [
    { label: 'Số dư khả dụng', value: formatMoney(wallet.available_balance || 0), description: 'Có thể dùng để thanh toán' },
    { label: 'Đang tạm giữ', value: formatMoney(wallet.held_balance || 0), description: 'Chờ hoàn tất hoặc đối soát', tone: 'warning' },
    { label: 'Tổng số dư', value: formatMoney(wallet.total_balance || 0), description: 'Khả dụng và tạm giữ' },
    { label: 'Tổng tiền vào', value: formatMoney(wallet.lifetime_credit || 0), tone: 'success' },
    { label: 'Tổng tiền ra', value: formatMoney(wallet.lifetime_debit || 0), tone: 'danger' },
  ];

  return <PageShell title="Ví và biến động số dư" description="Theo dõi tiền khả dụng, tiền đang tạm giữ và lịch sử trước/sau của từng giao dịch." loading={loading} loadingVariant="table" error={error} onReload={reload} width="wide">
    <PageStack>
      <MetricGrid items={metrics} />
      <PageSection title="Lịch sử biến động" description="Mọi thay đổi đều ghi nhận số dư trước và sau theo đúng khoản khả dụng hoặc tạm giữ.">
        <ResponsiveDataTable columns={columns} rows={rows} emptyText="Chưa có biến động số dư" />
      </PageSection>
    </PageStack>
  </PageShell>;
}

import PageShell from '../components/base/PageShell';
import PageSection, { MetricGrid, PageStack } from '../components/base/PageSection';
import ResponsiveDataTable from '../components/base/ResponsiveDataTable';
import StatusBadge from '../components/base/StatusBadge';
import { useRemoteData } from '../hooks/useRemoteData';
import { walletRepository } from '../services/repositories';
import { formatMoney } from '../utils/format';
import { valueLabel } from '../utils/labels';

export default function WalletTransactionsPage() {
  const { data, loading, error, reload } = useRemoteData(
    () => walletRepository.transactions({ page: 1, per_page: 100 }),
    [],
    { queryKey: 'wallet-transactions', staleTime: 15000 },
  );
  const rows = data?.data || [];
  const wallet = data?.wallet || {};

  const columns = [
    {
      key: 'time',
      title: 'Thời gian',
      dataIndex: 'occurred_at',
      width: '160px',
      render: (value) => value ? new Date(value).toLocaleString('vi-VN') : '—',
    },
    {
      key: 'type',
      title: 'Nghiệp vụ',
      dataIndex: 'type',
      className: 'is-truncate',
      render: (value, row) => (
        <div className="table-primary-cell">
          <b>{valueLabel(value)}</b>
          <small>{row.balance_bucket === 'held' ? 'Khoản tạm giữ' : 'Khoản khả dụng'}</small>
        </div>
      ),
    },
    {
      key: 'amount',
      title: 'Số tiền',
      dataIndex: 'amount',
      width: '132px',
      align: 'right',
      render: (value, row) => (
        <strong className={row.direction === 'debit' ? 'money-out' : 'money-in'}>
          {row.direction === 'debit' ? '-' : '+'}{formatMoney(value)}
        </strong>
      ),
    },
    {
      key: 'balance',
      title: 'Số dư sau',
      dataIndex: 'balance_after',
      width: '132px',
      align: 'right',
      render: (value) => formatMoney(value || 0),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      dataIndex: 'status',
      width: '142px',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const metrics = [
    {
      label: 'Số dư khả dụng',
      value: formatMoney(wallet.available_balance || 0),
      description: 'Có thể dùng để thanh toán',
    },
    {
      label: 'Đang tạm giữ',
      value: formatMoney(wallet.held_balance || 0),
      description: 'Chờ giao dịch hoàn tất hoặc đối soát',
      tone: 'warning',
    },
    {
      label: 'Tổng số dư',
      value: formatMoney(wallet.total_balance || 0),
      description: 'Khả dụng và tạm giữ',
    },
  ];

  return (
    <PageShell
      title="Ví và biến động số dư"
      description="Theo dõi số dư và các khoản phát sinh liên quan trực tiếp đến tài khoản của bạn."
      loading={loading}
      loadingVariant="table"
      error={error}
      onReload={reload}
      width="wide"
      className="wallet-page"
    >
      <PageStack>
        <MetricGrid items={metrics} className="wallet-page__metrics" />
        <PageSection
          className="wallet-page__ledger"
          title="Lịch sử biến động"
          description="Chỉ hiển thị thông tin cần thiết để bạn kiểm tra khoản tiền và trạng thái xử lý."
        >
          <ResponsiveDataTable
            columns={columns}
            rows={rows}
            minWidth={680}
            emptyText="Chưa có biến động số dư"
          />
        </PageSection>
      </PageStack>
    </PageShell>
  );
}

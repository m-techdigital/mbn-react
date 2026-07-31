import PageShell from '../components/base/PageShell';
import PageSection, { MetricGrid, PageStack } from '../components/base/PageSection';
import ResponsiveDataTable from '../components/base/ResponsiveDataTable';
import { PrimaryTextCell } from '../components/base/ContentPrimitives';
import StatusBadge from '../components/base/StatusBadge';
import { useRemoteData } from '../hooks/useRemoteData';
import { walletRepository } from '../services/repositories';
import { formatMoney } from '../utils/format';
import { valueLabel } from '../utils/labels';

export default function WalletTransactionsPage() {
  const { data, loading, error, reload } = useRemoteData(() => walletRepository.transactions({ page: 1, per_page: 100 }), [], { queryKey: 'wallet-transactions', staleTime: 15000 });
  const rows = data?.data || []; const wallet = data?.wallet || {};
  const columns = [
    { key:'time', title:'Thời gian', dataIndex:'occurred_at', width:'160px', render:v=>v?new Date(v).toLocaleString('vi-VN'):'—' },
    { key:'type', title:'Nghiệp vụ', dataIndex:'type', render:(v,row)=><PrimaryTextCell title={valueLabel(v)} description={row.balance_bucket === 'held' ? 'Khoản tạm giữ' : 'Khoản khả dụng'} /> },
    { key:'before', title:'Số dư trước', dataIndex:'balance_before', width:'132px', align:'right', render:v=>formatMoney(v||0) },
    { key:'amount', title:'Biến động', dataIndex:'amount', width:'132px', align:'right', render:(v,row)=><strong className={row.direction==='debit'?'money-out':'money-in'}>{row.direction==='debit'?'-':'+'}{formatMoney(v)}</strong> },
    { key:'after', title:'Số dư sau', dataIndex:'balance_after', width:'132px', align:'right', render:v=>formatMoney(v||0) },
    { key:'status', title:'Trạng thái', dataIndex:'status', width:'142px', render:v=><StatusBadge status={v}/> },
  ];
  const metrics=[
    {label:'Số dư khả dụng',value:formatMoney(wallet.available_balance||0),description:'Có thể dùng để thanh toán'},
    {label:'Đang tạm giữ',value:formatMoney(wallet.held_balance||0),description:'Đang bảo đảm cho giao dịch',tone:'warning'},
    {label:'Nạp tiền chờ xác nhận',value:formatMoney(wallet.pending_deposit_balance||0),description:'Chứng từ đang chờ đối soát',tone:'warning'},
    {label:'Tổng số dư trong ví',value:formatMoney(wallet.total_balance||0),description:'Khả dụng và tạm giữ'},
  ];
  return <PageShell title="Ví và biến động số dư" description="Theo dõi số dư trước, biến động và số dư sau của từng nghiệp vụ." loading={loading} loadingVariant="table" error={error} onReload={reload} width="wide" className="wallet-page">
    <PageStack><MetricGrid items={metrics} className="wallet-page__metrics"/><PageSection title="Lịch sử biến động" description="Các yêu cầu nạp tiền đang chờ được tách riêng khỏi số dư khả dụng."><ResponsiveDataTable caption="Lịch sử biến động số dư" columns={columns} rows={rows} rowKey="id" minWidth={940} emptyText="Chưa có biến động số dư."/></PageSection></PageStack>
  </PageShell>;
}

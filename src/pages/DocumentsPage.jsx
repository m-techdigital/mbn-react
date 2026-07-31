import { useState } from 'react';
import PageShell from '../components/base/PageShell';
import GamingButton from '../components/base/GamingButton';
import ActionGroup from '../components/base/ActionGroup';
import BaseChoice from '../components/base/BaseChoice';
import GamingLink from '../components/base/GamingLink';
import ResponsiveDataTable from '../components/base/ResponsiveDataTable';
import StatusBadge from '../components/base/StatusBadge';
import GamingModal from '../components/base/GamingModal';
import { documentRepository } from '../services/repositories';
import { useRemoteData } from '../hooks/useRemoteData';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import { getUserFacingError } from '../utils/userFacingError';
import { valueLabel } from '../utils/labels';

const statement = 'Tôi đã đọc toàn bộ tài liệu, kiểm tra thông tin giao dịch và đồng ý xác nhận bằng phương thức điện tử trên hệ thống.';

export default function DocumentsPage() {
  const { customer } = useAuth();
  const { data, loading, error, reload } = useRemoteData(() => documentRepository.mine(), [], { queryKey: 'documents', staleTime: 30000 });
  const documents = data?.data || data || [];
  const [working, setWorking] = useState('');
  const [preview, setPreview] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const isAccepted = (document) => Boolean(document?.accepted_by_current_customer || document?.acceptances?.some((item) => item.customer_id === customer?.id));

  const view = async (document) => {
    setWorking(`view-${document.id}`);
    try {
      const result = await documentRepository.preview(document.id);
      setPreview({ ...result, id: document.id, accepted_by_current_customer: isAccepted(document) || result?.accepted_by_current_customer });
      setAgreed(false);
    } catch (errorValue) {
      showToast('error', getUserFacingError(errorValue, 'Không thể mở tài liệu.'));
    } finally {
      setWorking('');
    }
  };

  const download = async (documentItem) => {
    setWorking(`download-${documentItem.id}`);
    try {
      const blob = await documentRepository.download(documentItem.id);
      const url = URL.createObjectURL(blob);
      const anchor = window.document.createElement('a');
      anchor.href = url;
      anchor.download = `${documentItem.code}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setWorking('');
    }
  };

  const accept = async () => {
    if (!preview || preview.accepted_by_current_customer || !agreed) return;
    setWorking(`accept-${preview.id}`);
    try {
      await documentRepository.accept(preview.id, { accepted_terms: true, acceptance_statement: statement });
      setPreview((current) => ({ ...current, accepted_by_current_customer: true }));
      setAgreed(false);
      showToast('success', 'Đã ghi nhận xác nhận điện tử.');
      await reload();
    } catch (errorValue) {
      showToast('error', getUserFacingError(errorValue, 'Không thể xác nhận tài liệu.'));
    } finally {
      setWorking('');
    }
  };

  const alreadyAccepted = Boolean(preview?.accepted_by_current_customer);

  const columns = [
    {
      key: 'type',
      title: 'Loại tài liệu',
      width: '180px',
      render: (_, document) => <div className="table-primary-cell"><b>{valueLabel(document.document_type, document.title)}</b><small>{document.code}</small></div>,
    },
    {
      key: 'title',
      title: 'Tên tài liệu',
      width: 'minmax(240px,1fr)',
      render: (_, document) => <div className="table-primary-cell"><b>{document.title}</b><small>Phiên bản {document.version}</small></div>,
    },
    {
      key: 'transaction',
      title: 'Giao dịch',
      width: '170px',
      render: (_, document) => document.transaction?.code || '—',
    },
    {
      key: 'acceptances',
      title: 'Xác nhận',
      width: '150px',
      align: 'center',
      render: (_, document) => <div className="document-table__acceptance"><b>{(document.acceptances || []).length}/2 bên</b>{isAccepted(document) ? <StatusBadge status="confirmed">Bạn đã xác nhận</StatusBadge> : <span>Chưa xác nhận</span>}</div>,
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '286px',
      fixed: 'right',
      render: (_, document) => {
        const accepted = isAccepted(document);
        return <ActionGroup className="document-table__actions" columns="three">
          <GamingButton size="sm" variant="secondary" loading={working === `view-${document.id}`} onClick={() => view(document)}>{accepted ? 'Xem tài liệu' : 'Xem và xác nhận'}</GamingButton>
          <GamingButton size="sm" variant="secondary" loading={working === `download-${document.id}`} onClick={() => download(document)}>Tải PDF</GamingButton>
          <GamingLink size="sm" variant="secondary" to={`/account/purchases/${document.transaction_id}`}>Mở giao dịch</GamingLink>
        </ActionGroup>;
      },
    },
  ];

  return <PageShell title="Hồ sơ tài liệu" description="Hợp đồng, phụ lục và biên bản được phát hành theo từng giao dịch." loading={loading} loadingVariant="table" error={error} onReload={reload} width="wide">
    <ResponsiveDataTable
      className="document-table"
      columns={columns}
      rows={documents}
      rowKey="id"
      minWidth={1020}
      caption="Danh sách tài liệu điện tử được phát hành theo từng giao dịch. Vuốt ngang bảng trên điện thoại để xem đầy đủ thông tin."
      emptyText="Chưa có tài liệu."
    />
    <GamingModal
      open={Boolean(preview)}
      title={preview?.title || 'Xem tài liệu'}
      onClose={() => setPreview(null)}
      width={920}
      footer={preview ? <><GamingButton variant="secondary" onClick={() => setPreview(null)}>Đóng</GamingButton><GamingButton disabled={alreadyAccepted || !agreed} loading={working === `accept-${preview.id}`} onClick={accept}>{alreadyAccepted ? 'Đã xác nhận' : 'Xác nhận điện tử'}</GamingButton></> : null}
    >
      <div className="mbn-document-preview" dangerouslySetInnerHTML={{ __html: preview?.html || '' }} />
      {alreadyAccepted ? <div className="document-accepted-banner">Bạn đã xác nhận tài liệu này. Không cần xác nhận lại.</div> : <BaseChoice className="document-acceptance" label={statement} checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />}
    </GamingModal>
  </PageShell>;
}

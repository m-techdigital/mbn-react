import { getUserFacingError } from '../../utils/userFacingError';
import { useCallback, useEffect, useState } from 'react';
import GamingButton from '../base/GamingButton';
import ActionGroup from '../base/ActionGroup';
import PageSection from '../base/PageSection';
import GamingModal from '../base/GamingModal';
import BaseChoice from '../base/BaseChoice';
import ResponsiveDataTable from '../base/ResponsiveDataTable';
import StatusBadge from '../base/StatusBadge';
import { documentRepository } from '../../services/repositories';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../utils/toast';
import { valueLabel } from '../../utils/labels';

const statement='Tôi đã đọc toàn bộ tài liệu, kiểm tra thông tin giao dịch và đồng ý xác nhận bằng phương thức điện tử trên hệ thống.';

export default function TransactionDocuments({ transactionId }) {
  const { customer } = useAuth();
  const [documents,setDocuments]=useState([]),[loading,setLoading]=useState(true),[working,setWorking]=useState(''),[preview,setPreview]=useState(null),[notice,setNotice]=useState(''),[agreed,setAgreed]=useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      setDocuments(await documentRepository.transaction(transactionId));
    } catch (error) {
      setNotice(getUserFacingError(error, 'Không thể tải hồ sơ tài liệu.'));
    } finally {
      setLoading(false);
    }
  }, [transactionId]);

  useEffect(() => {
    load();
  }, [load]);
  const view=async d=>{setWorking(`view-${d.id}`);try{const data=await documentRepository.preview(d.id);setPreview({...data,id:d.id});setAgreed(false);}finally{setWorking('')}};
  const accept=async d=>{if(!agreed)return;setWorking(`accept-${d.id}`);try{await documentRepository.accept(d.id,{accepted_terms:true,acceptance_statement:statement});showToast('success','Đã ghi nhận xác nhận điện tử.');setNotice('');setPreview(current=>({...current,accepted_by_current_customer:true}));setAgreed(false);await load();}catch(e){showToast('error',getUserFacingError(e, 'Không thể xác nhận tài liệu.'));}finally{setWorking('')}};
  const download=async d=>{setWorking(`download-${d.id}`);try{const blob=await documentRepository.download(d.id);const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${d.code}.pdf`;a.click();URL.revokeObjectURL(url);}finally{setWorking('')}};
  const currentDocument=documents.find(item=>item.id===preview?.id);
  const alreadyAccepted=Boolean(preview?.accepted_by_current_customer||currentDocument?.accepted_by_current_customer||currentDocument?.acceptances?.some(item=>item.customer_id===customer?.id));
  const columns = [
    {
      key: 'document',
      title: 'Tài liệu',
      width: 'minmax(250px,1fr)',
      render: (_, document) => <div className="table-primary-cell"><b>{valueLabel(document.document_type, document.title)}</b><small>{document.code} · Phiên bản {document.version}</small></div>,
    },
    {
      key: 'acceptances',
      title: 'Xác nhận',
      width: '150px',
      align: 'center',
      render: (_, document) => {
        const accepted = Boolean(document.accepted_by_current_customer || document.acceptances?.some((item) => item.customer_id === customer?.id));
        return <div className="document-table__acceptance"><b>{(document.acceptances || []).length}/2 bên</b>{accepted ? <StatusBadge status="confirmed">Đã xác nhận</StatusBadge> : <span>Chưa xác nhận</span>}</div>;
      },
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '220px',
      fixed: 'right',
      render: (_, document) => {
        const accepted = Boolean(document.accepted_by_current_customer || document.acceptances?.some((item) => item.customer_id === customer?.id));
        return <ActionGroup className="document-table__actions document-table__actions--compact" columns="two">
          <GamingButton size="sm" variant="secondary" loading={working === `view-${document.id}`} onClick={() => view(document)}>{accepted ? 'Xem tài liệu' : 'Xem và xác nhận'}</GamingButton>
          <GamingButton size="sm" variant="secondary" loading={working === `download-${document.id}`} onClick={() => download(document)}>Tải PDF</GamingButton>
        </ActionGroup>;
      },
    },
  ];

  return <PageSection className="transaction-documents" title="Hợp đồng và biên bản" description="Hồ sơ điện tử được phát hành theo trạng thái giao dịch." actions={<GamingButton size="sm" variant="secondary" loading={loading} onClick={load}>Tải lại</GamingButton>}>
    {notice && <p className="transaction-documents__notice">{notice}</p>}
    {loading ? <p className="transaction-documents__loading">Đang đồng bộ tài liệu...</p> : <ResponsiveDataTable columns={columns} rows={documents} rowKey="id" minWidth={720} emptyText="Chưa có tài liệu phù hợp với trạng thái giao dịch hiện tại." />}
    <GamingModal open={!!preview} title={preview?.title || 'Xem tài liệu'} onClose={() => setPreview(null)} width={920} footer={preview ? <><GamingButton variant="secondary" onClick={() => setPreview(null)}>Đóng</GamingButton><GamingButton disabled={alreadyAccepted || !agreed} loading={working === `accept-${preview.id}`} onClick={() => accept(preview)}>{alreadyAccepted ? 'Đã xác nhận' : 'Xác nhận điện tử'}</GamingButton></> : null}>
      <div className="mbn-document-preview" dangerouslySetInnerHTML={{ __html: preview?.html || '' }} />
      {alreadyAccepted ? <div className="document-accepted-banner">Bạn đã xác nhận tài liệu này.</div> : <BaseChoice className="document-acceptance" label={statement} checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />}
    </GamingModal>
  </PageSection>;
}

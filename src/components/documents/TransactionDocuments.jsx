import { getUserFacingError } from '../../utils/userFacingError';
import { useCallback, useEffect, useState } from 'react';
import GamingButton from '../base/GamingButton';
import ActionGroup from '../base/ActionGroup';
import PageSection from '../base/PageSection';
import GamingModal from '../base/GamingModal';
import BaseChoice from '../base/BaseChoice';
import StatusBadge from '../base/StatusBadge';
import { documentRepository } from '../../services/repositories';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../utils/toast';
import { valueLabel } from '../../utils/labels';

const statement = 'Tôi đã đọc toàn bộ tài liệu, kiểm tra thông tin giao dịch và đồng ý xác nhận bằng phương thức điện tử trên hệ thống.';

export default function TransactionDocuments({ transactionId, transactionCode }) {
  const { customer } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState('');
  const [preview, setPreview] = useState(null);
  const [notice, setNotice] = useState('');
  const [agreed, setAgreed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setDocuments(await documentRepository.transaction(transactionId));
      setNotice('');
    } catch (error) {
      setNotice(getUserFacingError(error, 'Không thể tải hồ sơ của giao dịch.'));
    } finally {
      setLoading(false);
    }
  }, [transactionId]);

  useEffect(() => { load(); }, [load]);

  const view = async (document) => {
    setWorking(`view-${document.id}`);
    try {
      const data = await documentRepository.preview(document.id);
      setPreview({ ...data, id: document.id });
      setAgreed(false);
    } catch (error) {
      showToast('error', getUserFacingError(error, 'Không thể mở tài liệu.'));
    } finally {
      setWorking('');
    }
  };

  const accept = async (document) => {
    if (!agreed) return;
    setWorking(`accept-${document.id}`);
    try {
      await documentRepository.accept(document.id, { accepted_terms: true, acceptance_statement: statement });
      showToast('success', 'Đã ghi nhận xác nhận điện tử.');
      setNotice('');
      setPreview((current) => ({ ...current, accepted_by_current_customer: true }));
      setAgreed(false);
      await load();
    } catch (error) {
      showToast('error', getUserFacingError(error, 'Không thể xác nhận tài liệu.'));
    } finally {
      setWorking('');
    }
  };

  const download = async (item) => {
    setWorking(`download-${item.id}`);
    try {
      const blob = await documentRepository.download(item.id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${item.code}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showToast('error', getUserFacingError(error, 'Không thể tải tài liệu.'));
    } finally {
      setWorking('');
    }
  };

  const currentDocument = documents.find((item) => item.id === preview?.id);
  const alreadyAccepted = Boolean(preview?.accepted_by_current_customer || currentDocument?.accepted_by_current_customer || currentDocument?.acceptances?.some((item) => item.customer_id === customer?.id));

  return <PageSection className="transaction-documents transaction-documents--attached" title="Hồ sơ giao dịch" description={`Chỉ hiển thị hồ sơ và biên bản được phát hành cho giao dịch ${transactionCode || ''}.`} actions={<GamingButton size="sm" variant="secondary" loading={loading} onClick={load}>Tải lại</GamingButton>}>
    {notice ? <p className="transaction-documents__notice">{notice}</p> : null}
    {loading ? <p className="transaction-documents__loading">Đang tải hồ sơ giao dịch...</p> : null}
    {!loading && !documents.length ? <p className="mbn-empty-inline">Chưa có hồ sơ hoặc biên bản được phát hành cho giao dịch này.</p> : null}
    {!loading && documents.length ? <div className="transaction-documents__attached-list">{documents.map((document) => {
      const accepted = Boolean(document.accepted_by_current_customer || document.acceptances?.some((item) => item.customer_id === customer?.id));
      return <article key={document.id} className="transaction-document-card">
        <div className="transaction-document-card__content">
          <span>{valueLabel(document.document_type, 'Tài liệu giao dịch')}</span>
          <b>{document.title || valueLabel(document.document_type)}</b>
          <small>{document.code} · Phiên bản {document.version}</small>
        </div>
        <div className="transaction-document-card__status">
          <b>{(document.acceptances || []).length}/2 bên</b>
          {accepted ? <StatusBadge status="confirmed">Đã xác nhận</StatusBadge> : <StatusBadge status="pending">Chờ xác nhận</StatusBadge>}
        </div>
        <ActionGroup className="transaction-document-card__actions" columns="two">
          <GamingButton size="sm" variant="secondary" loading={working === `view-${document.id}`} onClick={() => view(document)}>{accepted ? 'Xem tài liệu' : 'Xem và xác nhận'}</GamingButton>
          <GamingButton size="sm" variant="secondary" loading={working === `download-${document.id}`} onClick={() => download(document)}>Tải PDF</GamingButton>
        </ActionGroup>
      </article>;
    })}</div> : null}
    <GamingModal open={Boolean(preview)} title={preview?.title || 'Xem tài liệu'} onClose={() => setPreview(null)} width={920} footer={preview ? <><GamingButton variant="secondary" onClick={() => setPreview(null)}>Đóng</GamingButton><GamingButton disabled={alreadyAccepted || !agreed} loading={working === `accept-${preview.id}`} onClick={() => accept(preview)}>{alreadyAccepted ? 'Đã xác nhận' : 'Xác nhận điện tử'}</GamingButton></> : null}>
      <div className="mbn-document-preview" dangerouslySetInnerHTML={{ __html: preview?.html || '' }} />
      {alreadyAccepted ? <div className="document-accepted-banner">Bạn đã xác nhận tài liệu này.</div> : <BaseChoice className="document-acceptance" label={statement} checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />}
    </GamingModal>
  </PageSection>;
}

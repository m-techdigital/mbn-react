import { useCallback, useEffect, useState } from 'react';
import PageSection from '../base/PageSection';
import FormField from '../base/FormField';
import GamingButton from '../base/GamingButton';
import BaseForm from '../base/BaseForm';
import MultiImageUploadField from '../base/MultiImageUploadField';
import StatusBadge from '../base/StatusBadge';
import { marketplaceOperationsRepository, mediaRepository } from '../../services/repositories';
import { showToast } from '../../utils/toast';
import { getUserFacingError } from '../../utils/userFacingError';
import { BaseSelect, BaseTextarea } from '../base/FormControls';

const stageLabels = {
  before_handover: 'Trước bàn giao', after_handover: 'Sau bàn giao', before_return: 'Trước hoàn trả', after_return: 'Sau hoàn trả',
};

export default function TransactionAssetSnapshots({ transactionId, transactionType }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ stage: 'before_handover', images: [], note: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); const [progress, setProgress] = useState(0);
  const load = useCallback(async () => { try { setItems(await marketplaceOperationsRepository.snapshots(transactionId) || []); } catch { setItems([]); } }, [transactionId]);
  useEffect(() => { if (transactionId && transactionType === 'rental') load(); }, [load, transactionId, transactionType]);
  if (transactionType !== 'rental') return null;
  const submit = async (event) => {
    event.preventDefault(); setLoading(true);
    try { await marketplaceOperationsRepository.storeSnapshot(transactionId, form); showToast('success', 'Đã lưu biên bản hiện trạng.'); setForm((value) => ({ ...value, images: [], note: '' })); await load(); }
    catch (error) { showToast('error', getUserFacingError(error, 'Không thể lưu biên bản hiện trạng.')); }
    finally { setLoading(false); }
  };
  return <PageSection title="Biên bản hiện trạng" description="Lưu ảnh và thông tin tài khoản trước/sau bàn giao hoặc hoàn trả để bảo vệ cả hai bên.">
    <div className="asset-snapshot-list">{items.map((item) => <article key={item.id}><div><b>{stageLabels[item.stage] || item.stage}</b><small>{item.captured_at ? new Date(item.captured_at).toLocaleString('vi-VN') : '—'}</small></div><StatusBadge status="generated">{item.images?.length || 0} ảnh</StatusBadge>{item.note ? <p>{item.note}</p> : null}</article>)}</div>
    <BaseForm className="mbn-form-stack" onSubmit={submit}>
      <FormField label="Giai đoạn"><BaseSelect value={form.stage} onChange={(event) => setForm((value) => ({ ...value, stage: event.target.value }))}>{Object.entries(stageLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</BaseSelect></FormField>
      <MultiImageUploadField label="Ảnh hiện trạng" images={form.images} loading={uploading} progress={progress} max={10} onChange={async (event) => { const files = Array.from(event.target.files || []); if (!files.length) return; setUploading(true); try { const result = await mediaRepository.uploadImages(files, setProgress); const urls = result?.urls || result?.data?.map?.((item) => item.url) || []; setForm((value) => ({ ...value, images: [...value.images, ...urls].slice(0, 10) })); } catch (error) { showToast('error', getUserFacingError(error, 'Không thể tải ảnh hiện trạng.')); } finally { setUploading(false); setProgress(0); event.target.value = ''; } }} onRemove={(index) => setForm((value) => ({ ...value, images: value.images.filter((_, itemIndex) => itemIndex !== index) }))} />
      <FormField label="Ghi chú"><BaseTextarea value={form.note} onChange={(event) => setForm((value) => ({ ...value, note: event.target.value }))} placeholder="Cấp độ, vật phẩm quan trọng, tiền trong game, trạng thái bảo mật..." /></FormField>
      <GamingButton type="submit" variant="primary" loading={loading} disabled={!form.images.length}>Lưu biên bản hiện trạng</GamingButton>
    </BaseForm>
  </PageSection>;
}

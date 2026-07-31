import { useState } from 'react';
import PageSection from '../base/PageSection';
import BaseForm, { BaseFormActions } from '../base/BaseForm';
import FormField from '../base/FormField';
import GamingButton from '../base/GamingButton';
import { trustRepository } from '../../services/repositories';
import { showToast } from '../../utils/toast';
import { getUserFacingError } from '../../utils/userFacingError';
import { BaseSelect, BaseTextarea } from '../base/FormControls';
export default function TransactionReviewForm({ transactionId, status }) {
  const [form, setForm] = useState({ rating: 5, comment: '', criteria: { accuracy: 5, speed: 5, support: 5 } }); const [busy, setBusy] = useState(false);
  if (status !== 'completed') return null;
  const submit = async (event) => { event.preventDefault(); setBusy(true); try { await trustRepository.review(transactionId, form); showToast('success', 'Đã lưu đánh giá giao dịch.'); } catch (error) { showToast('error', getUserFacingError(error)); } finally { setBusy(false); } };
  return <PageSection title="Đánh giá giao dịch" description="Đánh giá chỉ được ghi nhận sau khi giao dịch hoàn tất."><BaseForm className="mbn-form-stack" onSubmit={submit}><div className="mbn-base-form__grid mbn-base-form__grid--3">{[['accuracy','Đúng mô tả'],['speed','Tốc độ'],['support','Hỗ trợ']].map(([key,label]) => <FormField key={key} label={label}><BaseSelect value={form.criteria[key]} onChange={(event) => setForm((value) => ({ ...value, criteria: { ...value.criteria, [key]: Number(event.target.value) } }))}>{[5,4,3,2,1].map((score) => <option key={score} value={score}>{score}/5</option>)}</BaseSelect></FormField>)}</div><FormField label="Điểm tổng"><BaseSelect value={form.rating} onChange={(event) => setForm((value) => ({ ...value, rating: Number(event.target.value) }))}>{[5,4,3,2,1].map((score) => <option key={score} value={score}>{score}/5</option>)}</BaseSelect></FormField><FormField label="Nhận xét"><BaseTextarea value={form.comment} onChange={(event) => setForm((value) => ({ ...value, comment: event.target.value }))} /></FormField><BaseFormActions><GamingButton type="submit" loading={busy}>Lưu đánh giá</GamingButton></BaseFormActions></BaseForm></PageSection>;
}

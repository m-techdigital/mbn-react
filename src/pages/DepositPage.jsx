import { useEffect, useState } from 'react';
import PageShell from '../components/base/PageShell';
import GamingButton from '../components/base/GamingButton';
import PageSection, { PageColumns } from '../components/base/PageSection';
import StatusBadge from '../components/base/StatusBadge';
import MoneyInput from '../components/base/MoneyInput';
import ImageUploadField from '../components/base/ImageUploadField';
import FormField from '../components/base/FormField';
import { walletRepository } from '../services/repositories';
import { formatMoney } from '../utils/format';
import { getUserFacingError } from '../utils/userFacingError';
import { showToast } from '../utils/toast';
import { statusLabel } from '../utils/labels';
import MarketplaceImage from '../components/base/MarketplaceImage';
import { BaseInput } from '../components/base/FormControls';

const MIN_DEPOSIT_AMOUNT = 10000;
const MAX_DEPOSIT_AMOUNT = 100000000;

export default function DepositPage(){
  const [amount,setAmount]=useState(200000);
  const [amountError,setAmountError]=useState('');
  const [request,setRequest]=useState(null);
  const [proof,setProof]=useState(null);
  const [reference,setReference]=useState('');
  const [loading,setLoading]=useState(false);
  const [previewUrl,setPreviewUrl]=useState('');
  useEffect(()=>{if(!proof){setPreviewUrl('');return undefined}const url=URL.createObjectURL(proof);setPreviewUrl(url);return()=>URL.revokeObjectURL(url)},[proof]);

  const create=async()=>{
    if(amount < MIN_DEPOSIT_AMOUNT){setAmountError(`Số tiền nạp tối thiểu là ${formatMoney(MIN_DEPOSIT_AMOUNT)}.`);return}
    if(amount > MAX_DEPOSIT_AMOUNT){setAmountError(`Số tiền nạp tối đa là ${formatMoney(MAX_DEPOSIT_AMOUNT)}.`);return}
    setAmountError('');
    setLoading(true);
    try{
      const data=await walletRepository.bankTopup({amount,payment_method:'bank'});
      setRequest(data);
      showToast('success','Đã tạo yêu cầu nạp tiền. Vui lòng chuyển khoản đúng thông tin hiển thị.');
    }catch(error){showToast('error',getUserFacingError(error,'Không thể tạo yêu cầu nạp tiền.'))}
    finally{setLoading(false)}
  };

  const submit=async()=>{
    if(!proof){showToast('warning','Vui lòng chọn ảnh biên nhận chuyển khoản.');return}
    setLoading(true);
    try{
      const data=await walletRepository.submitDepositProof(request.id,proof,{external_reference:reference,note:'Khách hàng đã gửi chứng từ chuyển khoản.'});
      setRequest(data);
      setProof(null);
      showToast('success','Đã gửi chứng từ. Yêu cầu đang chờ quản trị viên đối soát.');
    }catch(error){showToast('error',getUserFacingError(error,'Không thể gửi chứng từ.'))}
    finally{setLoading(false)}
  };

  const meta=request?.metadata||{};
  const bank=meta.bank||{};
  return <PageShell title="Nạp tiền qua ngân hàng" description="Tạo yêu cầu, chuyển khoản đúng nội dung và gửi ảnh biên nhận để quản trị viên đối soát.">
    <PageColumns className="deposit-flow" ratio="wide-left">
      <PageSection className="deposit-form-card">
        <div className="deposit-step-title"><span>1</span><div><h2>Tạo yêu cầu nạp tiền</h2><p>Chọn số tiền trước khi lấy thông tin chuyển khoản.</p></div></div>
        <FormField label="Số tiền muốn nạp" hint={`Tối thiểu ${formatMoney(MIN_DEPOSIT_AMOUNT)}. Số tiền sẽ được định dạng tự động.`} error={amountError} required><MoneyInput id="deposit-amount" value={amount} min={MIN_DEPOSIT_AMOUNT} max={MAX_DEPOSIT_AMOUNT} disabled={Boolean(request)} onChange={(next)=>{setAmount(next);if(next>=MIN_DEPOSIT_AMOUNT)setAmountError('')}} /></FormField>
        {!request&&<GamingButton block variant="primary" loading={loading} onClick={create}>Tạo yêu cầu nạp tiền</GamingButton>}
        {request&&<>
          <div className={`deposit-status deposit-status--${request.status}`}><StatusBadge status={request.status}>{statusLabel(request.status, 'Đang xử lý')}</StatusBadge><span>Mã yêu cầu: {request.code}</span></div>
          <div className="deposit-payment-grid">
            <div className="deposit-qr"><MarketplaceImage src={meta.qr_url} alt="Mã QR chuyển khoản"/><small>Quét mã bằng ứng dụng ngân hàng</small></div>
            <div className="bank-transfer-card"><div><span>Ngân hàng</span><b>{bank.bank_name||bank.name}</b></div><div><span>Số tài khoản</span><b>{bank.account_no}</b></div><div><span>Chủ tài khoản</span><b>{bank.account_name}</b></div><div><span>Số tiền</span><b>{formatMoney(request.amount)}</b></div><div><span>Nội dung</span><b>{meta.transfer_content}</b></div></div>
          </div>
          {['draft','rejected'].includes(request.status)&&<div className="deposit-proof">
            <div className="deposit-step-title"><span>2</span><div><h2>Gửi chứng từ chuyển khoản</h2><p>Ảnh phải nhìn rõ số tiền, thời gian và mã giao dịch ngân hàng.</p></div></div>
            <ImageUploadField label="Ảnh biên nhận" value={previewUrl} fileName={proof?.name || ''} hint="Ảnh phải nhìn rõ số tiền, thời gian và mã giao dịch." onChange={setProof} onRemove={()=>setProof(null)} />
            <FormField label="Mã giao dịch ngân hàng" hint="Không bắt buộc, nhưng giúp đối soát nhanh hơn."><BaseInput value={reference} onChange={event=>setReference(event.target.value)} placeholder="Nhập mã giao dịch"/></FormField>
            <GamingButton block variant="primary" loading={loading} onClick={submit}>Gửi chứng từ đối soát</GamingButton>
          </div>}
        </>}
      </PageSection>
      <PageSection className="deposit-guide-card" title="Quy trình xác nhận" description="Thực hiện đúng thứ tự để yêu cầu được đối soát nhanh."><ol><li>Tạo yêu cầu và dùng đúng thông tin hiển thị.</li><li>Chuyển khoản đúng số tiền, đúng nội dung.</li><li>Tải ảnh biên nhận lên hệ thống.</li><li>Quản trị viên kiểm tra tiền về và xác nhận.</li><li>Số dư được cộng, lịch sử trước–sau được lưu tự động.</li></ol><p>Không chuyển khoản theo thông tin được gửi riêng ngoài hệ thống.</p></PageSection>
    </PageColumns>
  </PageShell>
}

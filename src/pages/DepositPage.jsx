import { useCallback, useEffect, useState } from 'react';
import PageShell from '../components/base/PageShell';
import GamingButton from '../components/base/GamingButton';
import PageSection, { DefinitionGrid, PageColumns, PageStack } from '../components/base/PageSection';
import { StepHeading } from '../components/base/ContentPrimitives';
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
import ResponsiveDataTable from '../components/base/ResponsiveDataTable';
import GamingModal from '../components/base/GamingModal';
import { applyValidationError, clearFieldError } from '../utils/formValidation';

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
  const [errors,setErrors]=useState({});
  const [deposits,setDeposits]=useState([]);
  const [depositDetail,setDepositDetail]=useState(null);
  const [listLoading,setListLoading]=useState(true);
  const loadDeposits=useCallback(async()=>{setListLoading(true);try{const payload=await walletRepository.deposits({per_page:50});setDeposits(payload?.data||payload||[]);}catch(error){showToast('error',getUserFacingError(error,'Không thể tải danh sách yêu cầu nạp tiền.'));}finally{setListLoading(false)}},[]);
  useEffect(()=>{loadDeposits();},[loadDeposits]);
  useEffect(()=>{if(!proof){setPreviewUrl('');return undefined}const url=URL.createObjectURL(proof);setPreviewUrl(url);return()=>URL.revokeObjectURL(url)},[proof]);

  const create=async()=>{
    if(amount < MIN_DEPOSIT_AMOUNT){setAmountError(`Số tiền nạp tối thiểu là ${formatMoney(MIN_DEPOSIT_AMOUNT)}.`);return}
    if(amount > MAX_DEPOSIT_AMOUNT){setAmountError(`Số tiền nạp tối đa là ${formatMoney(MAX_DEPOSIT_AMOUNT)}.`);return}
    setAmountError(''); setErrors({});
    setLoading(true);
    try{
      const data=await walletRepository.bankTopup({amount,payment_method:'bank'});
      setRequest(data);
      await loadDeposits();
      showToast('success','Đã tạo yêu cầu nạp tiền. Vui lòng chuyển khoản đúng thông tin hiển thị.');
    }catch(error){const result=applyValidationError(error,setErrors);showToast('error',Object.keys(result.errors).length?'Thông tin yêu cầu nạp tiền chưa hợp lệ. Vui lòng kiểm tra trường được đánh dấu.':getUserFacingError(error,'Không thể tạo yêu cầu nạp tiền.'))}
    finally{setLoading(false)}
  };

  const submit=async()=>{
    if(!proof){setErrors(current=>({...current,proof:'Vui lòng chọn ảnh biên nhận chuyển khoản.'}));showToast('warning','Vui lòng kiểm tra thông tin chứng từ.');return}
    setErrors({}); setLoading(true);
    try{
      const data=await walletRepository.submitDepositProof(request.id,proof,{external_reference:reference,note:'Khách hàng đã gửi chứng từ chuyển khoản.'});
      setRequest(data);
      setProof(null);
      await loadDeposits();
      showToast('success','Đã gửi chứng từ. Yêu cầu đang chờ quản trị viên đối soát.');
    }catch(error){const result=applyValidationError(error,setErrors);showToast('error',Object.keys(result.errors).length?'Chứng từ chưa hợp lệ. Vui lòng kiểm tra các trường được đánh dấu.':getUserFacingError(error,'Không thể gửi chứng từ.'))}
    finally{setLoading(false)}
  };

  const meta=request?.metadata||{};
  const bank=meta.bank||{};
  const depositColumns=[
    {key:'code',title:'Mã yêu cầu',dataIndex:'code',width:'150px'},
    {key:'amount',title:'Số tiền',dataIndex:'amount',align:'right',render:value=><strong>{formatMoney(value)}</strong>},
    {key:'status',title:'Trạng thái',dataIndex:'status',render:value=><StatusBadge status={value}/>},
    {key:'occurred_at',title:'Ngày tạo',dataIndex:'occurred_at',render:value=>value?new Date(value).toLocaleString('vi-VN'):'—'},
    {key:'action',title:'Chi tiết',align:'center',render:(_,row)=><button type="button" className="table-view-link" onClick={async()=>{try{setDepositDetail(await walletRepository.deposit(row.id));}catch(error){showToast('error',getUserFacingError(error,'Không thể tải chi tiết yêu cầu.'));}}}>Xem</button>},
  ];
  const detailMeta=depositDetail?.metadata||{}; const detailBank=detailMeta.bank||{};
  return <PageShell title="Nạp tiền qua ngân hàng" description="Tạo và theo dõi yêu cầu nạp tiền riêng. Chỉ yêu cầu được xác nhận mới xuất hiện trong biến động số dư." width="wide">
    <PageStack>
      <PageColumns className="deposit-overview-shell"><PageSection className="deposit-overview-table" title="Tạo yêu cầu và quy trình xác nhận" description="Hai phần được đặt trong cùng một bảng quy trình để theo dõi rõ ràng, không làm lệch bố cục.">
        <div className="deposit-overview-table__grid">
          <article className="deposit-overview-table__cell">
            <StepHeading number="1" title="Tạo yêu cầu nạp tiền" description="Chọn số tiền trước khi lấy thông tin chuyển khoản." />
            <FormField label="Số tiền muốn nạp" hint={`Tối thiểu ${formatMoney(MIN_DEPOSIT_AMOUNT)}. Số tiền sẽ được định dạng tự động.`} error={amountError || errors.amount} required><MoneyInput id="deposit-amount" value={amount} min={MIN_DEPOSIT_AMOUNT} max={MAX_DEPOSIT_AMOUNT} disabled={Boolean(request)} onChange={(next)=>{setAmount(next);if(next>=MIN_DEPOSIT_AMOUNT)setAmountError('');clearFieldError(setErrors,'amount')}} /></FormField>
            {!request&&<GamingButton block variant="primary" loading={loading} onClick={create}>Tạo yêu cầu nạp tiền</GamingButton>}
            {request&&<>
              <div className={`deposit-status deposit-status--${request.status}`}><StatusBadge status={request.status}>{statusLabel(request.status, 'Đang xử lý')}</StatusBadge><span>Mã yêu cầu: {request.code}</span></div>
              <div className="deposit-payment-stack"><div className="deposit-qr"><MarketplaceImage src={meta.qr_url} alt="Mã QR chuyển khoản"/><small>Quét mã bằng ứng dụng ngân hàng</small></div><div className="bank-transfer-card"><div><span>Ngân hàng</span><b>{bank.bank_name||bank.name}</b></div><div><span>Số tài khoản</span><b>{bank.account_no}</b></div><div><span>Chủ tài khoản</span><b>{bank.account_name}</b></div><div><span>Số tiền</span><b>{formatMoney(request.amount)}</b></div><div><span>Nội dung</span><b>{meta.transfer_content}</b></div></div></div>
              {['draft','rejected'].includes(request.status)&&<div className="deposit-proof"><StepHeading number="2" title="Gửi chứng từ chuyển khoản" description="Ảnh phải nhìn rõ số tiền, thời gian và mã giao dịch ngân hàng." /><ImageUploadField label="Ảnh biên nhận" value={previewUrl} fileName={proof?.name || ''} hint="Ảnh phải nhìn rõ số tiền, thời gian và mã giao dịch." error={errors.proof} onChange={(file)=>{setProof(file);clearFieldError(setErrors,'proof')}} onRemove={()=>setProof(null)} /><FormField label="Mã giao dịch ngân hàng" error={errors.external_reference} hint="Không bắt buộc, nhưng giúp đối soát nhanh hơn."><BaseInput value={reference} onChange={event=>{setReference(event.target.value);clearFieldError(setErrors,'external_reference')}} placeholder="Nhập mã giao dịch"/></FormField><GamingButton block variant="primary" loading={loading} onClick={submit}>Gửi chứng từ đối soát</GamingButton></div>}
            </>}
          </article>
          <article className="deposit-overview-table__cell deposit-overview-table__process">
            <StepHeading number="2" title="Quy trình xác nhận" description="Yêu cầu được quản lý riêng tới khi tiền thực sự được đối soát." />
            <div className="deposit-process-table" role="table" aria-label="Quy trình xác nhận"><div role="row"><b role="cell">1</b><span role="cell">Tạo yêu cầu và dùng đúng thông tin hiển thị.</span></div><div role="row"><b role="cell">2</b><span role="cell">Chuyển khoản đúng số tiền và nội dung.</span></div><div role="row"><b role="cell">3</b><span role="cell">Tải ảnh biên nhận lên hệ thống.</span></div><div role="row"><b role="cell">4</b><span role="cell">Quản trị viên kiểm tra tiền về.</span></div><div role="row"><b role="cell">5</b><span role="cell">Chỉ sau khi xác nhận, số dư và biến động ví mới được cập nhật.</span></div></div>
          </article>
        </div>
      </PageSection></PageColumns>
      <PageSection title="Danh sách yêu cầu nạp tiền" description="Yêu cầu đang chờ, bị từ chối và đã xác nhận được quản lý tại đây; không trộn với biến động ví."><ResponsiveDataTable columns={depositColumns} rows={deposits} loading={listLoading} rowKey="id" emptyText="Chưa có yêu cầu nạp tiền."/></PageSection>
    </PageStack>
    <GamingModal open={Boolean(depositDetail)} title={depositDetail?.code ? `CHI TIẾT ${depositDetail.code}` : 'CHI TIẾT YÊU CẦU NẠP TIỀN'} onClose={()=>setDepositDetail(null)} width={620} footer={<GamingButton variant="secondary" onClick={()=>setDepositDetail(null)}>Đóng</GamingButton>}>
      {depositDetail?<div className="deposit-detail-modal"><div className="deposit-qr"><MarketplaceImage src={detailMeta.qr_url} alt="Mã QR yêu cầu nạp tiền"/></div><DefinitionGrid items={[{label:'Trạng thái',value:<StatusBadge status={depositDetail.status}/>},{label:'Số tiền',value:formatMoney(depositDetail.amount)},{label:'Ngân hàng',value:detailBank.bank_name||detailBank.name||'—'},{label:'Số tài khoản',value:detailBank.account_no||'—'},{label:'Chủ tài khoản',value:detailBank.account_name||'—'},{label:'Nội dung chuyển khoản',value:detailMeta.transfer_content||'—'},{label:'Mã giao dịch ngân hàng',value:depositDetail.external_reference||'—'},{label:'Ngày tạo',value:depositDetail.occurred_at?new Date(depositDetail.occurred_at).toLocaleString('vi-VN'):'—'},{label:'Phản hồi đối soát',value:depositDetail.review_note||'Chưa có'}]}/>{depositDetail.proof_image_url?<MarketplaceImage src={depositDetail.proof_image_url} alt="Ảnh biên nhận"/>:null}</div>:null}
    </GamingModal>
  </PageShell>
}

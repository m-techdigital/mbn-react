import { useEffect, useMemo, useState } from 'react';
import PageShell from '../components/base/PageShell';
import PageSection, { PageColumns, PageStack, DefinitionGrid } from '../components/base/PageSection';
import BaseForm, { BaseFormActions } from '../components/base/BaseForm';
import FormField from '../components/base/FormField';
import MoneyInput from '../components/base/MoneyInput';
import GamingButton from '../components/base/GamingButton';
import StatusBadge from '../components/base/StatusBadge';
import ResponsiveDataTable from '../components/base/ResponsiveDataTable';
import { payoutRepository } from '../services/repositories';
import { showToast } from '../utils/toast';
import { getUserFacingError } from '../utils/userFacingError';
import { formatMoney } from '../utils/format';
import { BaseInput, BaseSelect, BaseTextarea } from '../components/base/FormControls';

export default function PayoutPage(){
 const [data,setData]=useState({verification:null,accounts:[],withdrawals:{data:[]}}); const [busy,setBusy]=useState('');
 const [verify,setVerify]=useState({document_type:'citizen_id',document_number:'',document_front_url:'',document_back_url:'',selfie_url:''});
 const [account,setAccount]=useState({bank_code:'',bank_name:'',account_name:'',account_number:'',is_default:true});
 const [withdraw,setWithdraw]=useState({payout_account_id:'',amount:'',note:''});
 const load=async()=>{try{setData(await payoutRepository.overview());}catch(e){showToast('error',getUserFacingError(e,'Không thể tải thông tin nhận tiền.'));}};
 useEffect(()=>{load();},[]);
 const verifiedAccounts=useMemo(()=>data.accounts?.filter(x=>x.status==='verified')||[],[data.accounts]);
 const submit=async(type,fn)=>{setBusy(type);try{await fn();showToast('success','Đã gửi yêu cầu.');await load();}catch(e){showToast('error',getUserFacingError(e,'Không thể gửi yêu cầu.'));}finally{setBusy('');}};
 const columns=[{key:'code',title:'Mã',dataIndex:'code'},{key:'amount',title:'Số tiền',dataIndex:'amount',render:value=>formatMoney(value)},{key:'account',title:'Tài khoản nhận',render:(_,row)=>`${row.payout_account?.bank_name||''} • ${row.payout_account?.account_number||''}`},{key:'status',title:'Trạng thái',dataIndex:'status',render:value=><StatusBadge status={value}/>},{key:'submitted_at',title:'Ngày gửi',dataIndex:'submitted_at',render:value=>value?new Date(value).toLocaleString('vi-VN'):'—'}];
 return <PageShell title="Xác minh và rút tiền" description="Xác minh người bán, quản lý tài khoản nhận tiền và theo dõi yêu cầu rút tiền." width="wide">
  <PageColumns ratio="balanced">
   <PageStack>
    <PageSection title="Xác minh người bán" description="Hồ sơ xác minh là điều kiện bắt buộc trước khi rút tiền.">
     <DefinitionGrid items={[{label:'Trạng thái',value:<StatusBadge status={data.verification?.status||'unverified'}/>},{label:'Ghi chú',value:data.verification?.review_note||'—'}]}/>
     {data.verification?.status!=='verified'?<BaseForm onSubmit={e=>{e.preventDefault();submit('verify',()=>payoutRepository.submitVerification(verify));}}>
      <FormField label="Loại giấy tờ"><BaseSelect value={verify.document_type} onChange={e=>setVerify(v=>({...v,document_type:e.target.value}))}><option value="citizen_id">Căn cước công dân</option><option value="passport">Hộ chiếu</option></BaseSelect></FormField>
      <FormField label="Số giấy tờ" required><BaseInput value={verify.document_number} onChange={e=>setVerify(v=>({...v,document_number:e.target.value}))} required/></FormField>
      <FormField label="Ảnh mặt trước (URL)" required><BaseInput value={verify.document_front_url} onChange={e=>setVerify(v=>({...v,document_front_url:e.target.value}))} required/></FormField>
      <FormField label="Ảnh mặt sau (URL)"><BaseInput value={verify.document_back_url} onChange={e=>setVerify(v=>({...v,document_back_url:e.target.value}))}/></FormField>
      <FormField label="Ảnh chân dung cầm giấy tờ (URL)" required><BaseInput value={verify.selfie_url} onChange={e=>setVerify(v=>({...v,selfie_url:e.target.value}))} required/></FormField>
      <BaseFormActions><GamingButton type="submit" variant="primary" loading={busy==='verify'} block>Gửi hồ sơ xác minh</GamingButton></BaseFormActions>
     </BaseForm>:null}
    </PageSection>
    <PageSection title="Tài khoản nhận tiền" description="Tài khoản mới cần được quản trị viên xác minh trước khi sử dụng.">
     <BaseForm onSubmit={e=>{e.preventDefault();submit('account',()=>payoutRepository.addAccount(account));}}>
      <FormField label="Mã ngân hàng" required><BaseInput value={account.bank_code} onChange={e=>setAccount(v=>({...v,bank_code:e.target.value.toUpperCase()}))} required/></FormField>
      <FormField label="Tên ngân hàng" required><BaseInput value={account.bank_name} onChange={e=>setAccount(v=>({...v,bank_name:e.target.value}))} required/></FormField>
      <FormField label="Tên chủ tài khoản" required><BaseInput value={account.account_name} onChange={e=>setAccount(v=>({...v,account_name:e.target.value.toUpperCase()}))} required/></FormField>
      <FormField label="Số tài khoản" required><BaseInput value={account.account_number} onChange={e=>setAccount(v=>({...v,account_number:e.target.value}))} required inputMode="numeric"/></FormField>
      <BaseFormActions><GamingButton type="submit" loading={busy==='account'} block>Thêm tài khoản nhận tiền</GamingButton></BaseFormActions>
     </BaseForm>
     <DefinitionGrid items={(data.accounts||[]).map(x=>({label:x.bank_name,value:<>{x.account_number} · <StatusBadge status={x.status}/></>}))}/>
    </PageSection>
   </PageStack>
   <PageStack>
    <PageSection title="Tạo yêu cầu rút tiền" description="Số tiền sẽ được chuyển sang số dư tạm giữ ngay khi gửi yêu cầu.">
     <BaseForm onSubmit={e=>{e.preventDefault();submit('withdraw',()=>payoutRepository.withdraw({...withdraw,idempotency_key:`mbn-${Date.now()}`}));}}>
      <FormField label="Tài khoản nhận tiền" required><BaseSelect value={withdraw.payout_account_id} onChange={e=>setWithdraw(v=>({...v,payout_account_id:e.target.value}))} required><option value="">Chọn tài khoản đã xác minh</option>{verifiedAccounts.map(x=><option key={x.id} value={x.id}>{x.bank_name} • {x.account_number}</option>)}</BaseSelect></FormField>
      <FormField label="Số tiền rút" hint="Tối thiểu 50.000 đ" required><MoneyInput value={withdraw.amount} onChange={value=>setWithdraw(v=>({...v,amount:value}))}/></FormField>
      <FormField label="Ghi chú"><BaseTextarea value={withdraw.note} onChange={e=>setWithdraw(v=>({...v,note:e.target.value}))}/></FormField>
      <BaseFormActions><GamingButton type="submit" variant="primary" loading={busy==='withdraw'} block disabled={data.verification?.status!=='verified'||!verifiedAccounts.length}>Gửi yêu cầu rút tiền</GamingButton></BaseFormActions>
     </BaseForm>
    </PageSection>
    <PageSection title="Lịch sử rút tiền"><ResponsiveDataTable columns={columns} rows={data.withdrawals?.data||[]} rowKey="id" minWidth={760}/></PageSection>
   </PageStack>
  </PageColumns>
 </PageShell>;
}

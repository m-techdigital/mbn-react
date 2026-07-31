import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageShell from '../components/base/PageShell';
import { profileRepository } from '../services/repositories';
import { getUserFacingError } from '../utils/userFacingError';
export default function VerifyEmailPage(){const [params]=useSearchParams();const [notice,setNotice]=useState('Đang xác nhận địa chỉ thư điện tử...');useEffect(()=>{const token=params.get('token');if(!token){setNotice('Liên kết xác nhận không hợp lệ.');return;}profileRepository.verifyEmail({token}).then(()=>setNotice('Đã xác nhận địa chỉ thư điện tử mới.')).catch(e=>setNotice(getUserFacingError(e,'Liên kết xác nhận không hợp lệ hoặc đã hết hạn.')));},[params]);return <PageShell title="Xác nhận thư điện tử"><section className="security-form-card"><p>{notice}</p><Link to="/account/profile">Quay lại hồ sơ</Link></section></PageShell>;}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BaseForm, { BaseFormActions } from '../base/BaseForm';
import FormField from '../base/FormField';
import BaseChoice from '../base/BaseChoice';
import GamingButton from '../base/GamingButton';
import GamingModal from '../base/GamingModal';
import PasswordField from '../base/PasswordField';
import { getSupportCode, getUserFacingError } from '../../utils/userFacingError';
import { BaseInput } from '../base/FormControls';
import { validationErrorsFrom } from '../../utils/formValidation';

const loginInitial = { username: '', password: '', remember: true };
const registerInitial = { name: '', username: '', password: '', password_confirmation: '', phone: '', email: '' };

export default function AuthModal({ open, initialMode = 'login', onClose }) {
  const { login, verifyTwoFactor, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loginData, setLoginData] = useState(loginInitial);
  const [registerData, setRegisterData] = useState(registerInitial);
  const [twoFactor, setTwoFactor] = useState({ required: false, challenge_token: '', code: '' });
  const showDemoAccounts = import.meta.env.DEV && import.meta.env.VITE_DATA_MODE === 'mock' && import.meta.env.VITE_SHOW_DEMO_ACCOUNTS === 'true';
  const demoAccounts = [
    ['customer', 'Người mua', 'Kiểm tra mua thẳng, trả góp, hoàn trả thuê'],
    ['seller', 'Người bán', 'Kiểm tra tin chờ duyệt, tin bị từ chối và đơn đã bán'],
    ['renter', 'Người thuê', 'Kiểm tra giao dịch thuê đang hoạt động'],
    ['lessor', 'Người cho thuê', 'Kiểm tra bàn giao và hoàn trả tài khoản thuê'],
    ['dispute', 'Khách khiếu nại', 'Kiểm tra giao dịch đang tranh chấp'],
  ];

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setError('');
      setErrors({});
      setTwoFactor({ required: false, challenge_token: '', code: '' });
    }
  }, [open, initialMode]);

  const validate = (kind, values) => {
    const next = {};
    if (!values.username?.trim()) next.username = 'Vui lòng nhập tên đăng nhập hoặc thư điện tử.';
    if (!values.password) next.password = 'Vui lòng nhập mật khẩu.';
    if (kind === 'register') {
      if (!values.name?.trim()) next.name = 'Vui lòng nhập tên hiển thị.';
      if (String(values.password || '').length < 8) next.password = 'Mật khẩu phải có ít nhất 8 ký tự.';
      if (values.password_confirmation !== values.password) next.password_confirmation = 'Mật khẩu nhập lại chưa khớp.';
      if (!values.phone?.trim()) next.phone = 'Vui lòng nhập số điện thoại.';
      if (!/^\S+@\S+\.\S+$/.test(values.email || '')) next.email = 'Địa chỉ thư điện tử chưa hợp lệ.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (kind, values) => {
    if (!validate(kind, values)) return;
    setBusy(true);
    setError('');
    try {
      const result = await (kind === 'login' ? login(values) : register(values));
      if (kind === 'login' && result?.two_factor_required) {
        setTwoFactor({ required: true, challenge_token: result.challenge_token, code: '' });
        return;
      }
      onClose();
    } catch (requestError) {
      const serverErrors = validationErrorsFrom(requestError);
      if (Object.keys(serverErrors).length) setErrors(serverErrors);
      const supportCode = getSupportCode(requestError);
      const messageText = getUserFacingError(requestError, 'Không thể xử lý yêu cầu lúc này. Vui lòng thử lại sau.');
      const status = Number(requestError?.response?.status || 0);
      setError(Object.keys(serverErrors).length ? 'Thông tin chưa hợp lệ. Vui lòng kiểm tra các trường được đánh dấu.' : supportCode && status >= 500 ? `${messageText} Mã hỗ trợ: ${supportCode}` : messageText);
    } finally {
      setBusy(false);
    }
  };


  const submitTwoFactor = async (event) => {
    event.preventDefault();
    if (!twoFactor.code.trim()) return setErrors({ code: 'Vui lòng nhập mã xác thực.' });
    setBusy(true); setError(''); setErrors({});
    try { await verifyTwoFactor({ challenge_token: twoFactor.challenge_token, code: twoFactor.code }); onClose(); }
    catch (requestError) { const serverErrors = validationErrorsFrom(requestError); if (Object.keys(serverErrors).length) setErrors(serverErrors); setError(Object.keys(serverErrors).length ? 'Mã xác thực chưa hợp lệ.' : getUserFacingError(requestError, 'Mã xác thực không đúng hoặc đã hết hạn.')); }
    finally { setBusy(false); }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setErrors({});
  };

  return (
    <GamingModal
      open={open}
      title={twoFactor.required ? 'XÁC THỰC HAI LỚP' : mode === 'login' ? 'ĐĂNG NHẬP TÀI KHOẢN' : 'ĐĂNG KÝ TÀI KHOẢN'}
      onClose={onClose}
      width={450}
      className="auth-gaming-modal"
      bodyClassName="auth-gaming-modal__body"
    >
      {error ? <div className="mbn-form-alert is-error" role="alert">{error}</div> : null}
      {twoFactor.required ? (
        <BaseForm className="auth-gaming-form" onSubmit={submitTwoFactor}>
          <div className="mbn-form-alert">Nhập mã 6 số từ ứng dụng xác thực hoặc một mã khôi phục.</div>
          <FormField label="Mã xác thực" required error={errors.code}><BaseInput value={twoFactor.code} onChange={(event) => setTwoFactor((value) => ({ ...value, code: event.target.value }))} inputMode="numeric" autoComplete="one-time-code" autoFocus /></FormField>
          <BaseFormActions><GamingButton type="button" variant="secondary" onClick={() => setTwoFactor({ required:false, challenge_token:'', code:'' })}>Quay lại</GamingButton><GamingButton type="submit" variant="primary" loading={busy}>Xác nhận</GamingButton></BaseFormActions>
        </BaseForm>
      ) : mode === 'login' ? (
        <BaseForm className="auth-gaming-form" onSubmit={(event) => { event.preventDefault(); submit('login', loginData); }}>
          {showDemoAccounts ? (
            <div className="demo-account-panel">
              <strong>Tài khoản kiểm thử nhanh</strong>
              <p>Mật khẩu chung: <b>change-me</b></p>
              <div className="demo-account-grid">
                {demoAccounts.map(([username, label, description]) => (
                  <button key={username} type="button" onClick={() => submit('login', { username, password: 'change-me', remember: true })}>
                    <b>{label}</b><span>{username}</span><small>{description}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <FormField label="Tài khoản" required error={errors.username}>
            <BaseInput value={loginData.username} onChange={(event) => setLoginData((current) => ({ ...current, username: event.target.value }))} placeholder="Tên đăng nhập hoặc thư điện tử" autoComplete="username" />
          </FormField>
          <FormField label="Mật khẩu" required error={errors.password}>
            <PasswordField value={loginData.password} onChange={(event) => setLoginData((current) => ({ ...current, password: event.target.value }))} placeholder="Mật khẩu" autoComplete="current-password" />
          </FormField>
          <div className="auth-gaming-row">
            <BaseChoice label="Lưu đăng nhập" checked={loginData.remember} onChange={(event) => setLoginData((current) => ({ ...current, remember: event.target.checked }))} />
            <div className="auth-link-group"><button type="button" className="auth-gaming-link" onClick={() => { onClose(); navigate('/forgot-password'); }}>Quên mật khẩu?</button><button type="button" className="auth-gaming-switch" onClick={() => switchMode('register')}>Đăng ký</button></div>
          </div>
          <GamingButton type="submit" variant="primary" block loading={busy}>Đăng nhập</GamingButton>
        </BaseForm>
      ) : (
        <BaseForm className="auth-gaming-form auth-gaming-form--register" onSubmit={(event) => { event.preventDefault(); submit('register', registerData); }}>
          <FormField label="Tên hiển thị" required error={errors.name}><BaseInput value={registerData.name} onChange={(event) => setRegisterData((current) => ({ ...current, name: event.target.value }))} placeholder="Ví dụ: Nguyễn Văn An" autoComplete="name" /></FormField>
          <FormField label="Tên đăng nhập" required error={errors.username}><BaseInput value={registerData.username} onChange={(event) => setRegisterData((current) => ({ ...current, username: event.target.value }))} placeholder="Tên dùng để đăng nhập" autoComplete="username" /></FormField>
          <FormField label="Mật khẩu" hint="Tối thiểu 8 ký tự." required error={errors.password}><PasswordField value={registerData.password} onChange={(event) => setRegisterData((current) => ({ ...current, password: event.target.value }))} placeholder="Nhập mật khẩu" autoComplete="new-password" /></FormField>
          <FormField label="Nhập lại mật khẩu" required error={errors.password_confirmation}><PasswordField value={registerData.password_confirmation} onChange={(event) => setRegisterData((current) => ({ ...current, password_confirmation: event.target.value }))} placeholder="Nhập lại mật khẩu" autoComplete="new-password" /></FormField>
          <FormField label="Số điện thoại" required error={errors.phone}><BaseInput value={registerData.phone} onChange={(event) => setRegisterData((current) => ({ ...current, phone: event.target.value }))} placeholder="Số điện thoại liên hệ" inputMode="tel" autoComplete="tel" /></FormField>
          <FormField label="Địa chỉ thư điện tử" required error={errors.email}><BaseInput type="email" value={registerData.email} onChange={(event) => setRegisterData((current) => ({ ...current, email: event.target.value }))} placeholder="vidu@example.com" inputMode="email" autoComplete="email" /></FormField>
          <BaseFormActions><GamingButton type="button" variant="secondary" onClick={() => switchMode('login')}>Đăng nhập</GamingButton><GamingButton type="submit" variant="primary" loading={busy}>Đăng ký</GamingButton></BaseFormActions>
        </BaseForm>
      )}
    </GamingModal>
  );
}

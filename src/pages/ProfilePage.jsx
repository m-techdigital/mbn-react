import { useEffect, useState } from 'react';
import PageShell from '../components/base/PageShell';
import PageSection, { DefinitionGrid, PageColumns, PageStack } from '../components/base/PageSection';
import GamingButton from '../components/base/GamingButton';
import FormField from '../components/base/FormField';
import BaseForm, { BaseFormActions } from '../components/base/BaseForm';
import ImageUploadField from '../components/base/ImageUploadField';
import PasswordField from '../components/base/PasswordField';
import StatusBadge from '../components/base/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { profileRepository } from '../services/repositories';
import { getUserFacingError } from '../utils/userFacingError';
import { showToast } from '../utils/toast';
import MarketplaceImage from '../components/base/MarketplaceImage';
import { BaseInput } from '../components/base/FormControls';
import { applyValidationError, clearFieldError } from '../utils/formValidation';

export default function ProfilePage() {
  const { customer, refreshCustomer, logout } = useAuth();
  const [profile, setProfile] = useState({ name: '', phone: '', avatar_url: '' });
  const [avatarName, setAvatarName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [busy, setBusy] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [reloading, setReloading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [emailErrors, setEmailErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => setProfile({ name: customer?.name || '', phone: customer?.phone || '', avatar_url: customer?.avatar_url || '' }), [customer]);

  const uploadAvatar = async (file) => {
    if (!file) return;
    setAvatarName(file.name); setBusy('avatar'); setProfileErrors((current) => ({ ...current, avatar: '' }));
    try {
      const updated = await profileRepository.updateAvatar(file, setUploadProgress);
      setProfile((value) => ({ ...value, avatar_url: updated?.avatar_url || '' }));
      await refreshCustomer();
      showToast('success', 'Đã cập nhật ảnh đại diện.');
    } catch (exception) {
      const { errors } = applyValidationError(exception, setProfileErrors);
      showToast('error', Object.keys(errors).length ? 'Không thể cập nhật ảnh đại diện. Vui lòng kiểm tra tệp đã chọn.' : getUserFacingError(exception, 'Không thể cập nhật ảnh đại diện.'));
    } finally { setBusy(''); setUploadProgress(0); }
  };

  const saveProfile = async (event) => {
    event.preventDefault(); setBusy('profile'); setProfileErrors({});
    try { await profileRepository.update(profile); await refreshCustomer(); showToast('success', 'Đã cập nhật thông tin cá nhân.'); }
    catch (exception) { const { errors } = applyValidationError(exception, setProfileErrors); showToast('error', Object.keys(errors).length ? 'Thông tin cá nhân chưa hợp lệ. Vui lòng kiểm tra các trường được đánh dấu.' : getUserFacingError(exception, 'Không thể cập nhật hồ sơ.')); }
    finally { setBusy(''); }
  };
  const requestEmail = async (event) => {
    event.preventDefault(); setBusy('email'); setEmailErrors({});
    try { await profileRepository.requestEmailChange({ email: newEmail }); showToast('success', 'Đã gửi liên kết xác nhận đến địa chỉ thư điện tử mới.'); setNewEmail(''); }
    catch (exception) { const { errors } = applyValidationError(exception, setEmailErrors); showToast('error', Object.keys(errors).length ? 'Địa chỉ thư điện tử chưa hợp lệ.' : getUserFacingError(exception, 'Không thể gửi yêu cầu đổi địa chỉ thư điện tử.')); }
    finally { setBusy(''); }
  };
  const changePassword = async (event) => {
    event.preventDefault(); setBusy('password'); setPasswordErrors({});
    try { await profileRepository.changePassword(password); showToast('success', 'Đã đổi mật khẩu. Vui lòng đăng nhập lại.'); await logout(); window.dispatchEvent(new CustomEvent('mbn:open-auth', { detail: { mode: 'login' } })); }
    catch (exception) { const { errors } = applyValidationError(exception, setPasswordErrors); showToast('error', Object.keys(errors).length ? 'Thông tin mật khẩu chưa hợp lệ. Vui lòng kiểm tra các trường được đánh dấu.' : getUserFacingError(exception, 'Không thể đổi mật khẩu.')); }
    finally { setBusy(''); }
  };

  const reloadProfile = async () => {
    setReloading(true);
    try { await refreshCustomer(); }
    finally { setReloading(false); }
  };

  return <PageShell title="Hồ sơ khách hàng" description="Quản lý thông tin cá nhân, ảnh đại diện, địa chỉ thư điện tử và mật khẩu." onReload={reloadProfile} loading={reloading} loadingVariant="profile" width="wide" className="profile-page-v46">
    <PageColumns ratio="profile">
      <PageSection title="Thông tin cá nhân" description="Thông tin hiển thị trên tin đăng và giao dịch.">
        <div className="mbn-profile-summary">
          <div className="mbn-profile-summary__avatar">{profile.avatar_url ? <MarketplaceImage src={profile.avatar_url} alt="Ảnh đại diện" /> : (customer?.name || 'K').charAt(0).toUpperCase()}</div>
          <div className="mbn-profile-summary__copy"><strong>{customer?.name || 'Khách hàng'}</strong><span>{customer?.code || 'Chưa có mã khách hàng'}</span></div>
        </div>
        <BaseForm className="mbn-form-stack" onSubmit={saveProfile}>
          <FormField label="Tên khách hàng" required error={profileErrors.name}><BaseInput value={profile.name} onChange={(event) => { setProfile((value) => ({ ...value, name: event.target.value })); clearFieldError(setProfileErrors, 'name'); }} required /></FormField>
          <FormField label="Số điện thoại" error={profileErrors.phone}><BaseInput value={profile.phone} onChange={(event) => { setProfile((value) => ({ ...value, phone: event.target.value })); clearFieldError(setProfileErrors, 'phone'); }} inputMode="tel" /></FormField>
          <ImageUploadField label="Ảnh đại diện" value={profile.avatar_url} fileName={avatarName} loading={busy === 'avatar'} progress={uploadProgress} circular error={profileErrors.avatar || profileErrors.avatar_url} onChange={uploadAvatar} onRemove={() => { setProfile((value) => ({ ...value, avatar_url: '' })); setAvatarName(''); }} />
          <DefinitionGrid className="mbn-profile-meta" items={[{ label: 'Tên đăng nhập', value: customer?.username || '—' }, { label: 'Trạng thái', value: <StatusBadge status={customer?.status} context="account" /> }]} />
          <BaseFormActions align="stretch"><GamingButton type="submit" variant="primary" block loading={busy === 'profile'}>Lưu thông tin cá nhân</GamingButton></BaseFormActions>
        </BaseForm>
      </PageSection>
      <PageStack>
        <PageSection title="Địa chỉ thư điện tử" description={`Địa chỉ hiện tại: ${customer?.email || 'Chưa thiết lập'}`}>
          <BaseForm className="mbn-form-stack" onSubmit={requestEmail}>
            <FormField label="Địa chỉ thư điện tử mới" error={emailErrors.email} hint="Địa chỉ mới chỉ được áp dụng sau khi bạn mở liên kết xác nhận trong hộp thư." required><BaseInput type="email" value={newEmail} onChange={(event) => { setNewEmail(event.target.value); clearFieldError(setEmailErrors, 'email'); }} required placeholder="vidu@example.com" /></FormField>
            <BaseFormActions align="stretch"><GamingButton type="submit" block loading={busy === 'email'}>Gửi liên kết xác nhận</GamingButton></BaseFormActions>
          </BaseForm>
        </PageSection>
        <PageSection title="Đổi mật khẩu" description="Sử dụng mật khẩu mạnh và không dùng lại mật khẩu của thư điện tử.">
          <BaseForm className="mbn-form-stack" onSubmit={changePassword}>
            <FormField label="Mật khẩu hiện tại" required error={passwordErrors.current_password}><PasswordField value={password.current_password} onChange={(event) => { setPassword((value) => ({ ...value, current_password: event.target.value })); clearFieldError(setPasswordErrors, 'current_password'); }} required /></FormField>
            <FormField label="Mật khẩu mới" error={passwordErrors.password} hint="Tối thiểu 8 ký tự." required><PasswordField value={password.password} onChange={(event) => { setPassword((value) => ({ ...value, password: event.target.value })); clearFieldError(setPasswordErrors, 'password'); }} minLength={8} required /></FormField>
            <FormField label="Nhập lại mật khẩu mới" required error={passwordErrors.password_confirmation}><PasswordField value={password.password_confirmation} onChange={(event) => { setPassword((value) => ({ ...value, password_confirmation: event.target.value })); clearFieldError(setPasswordErrors, 'password_confirmation'); }} minLength={8} required /></FormField>
            <BaseFormActions align="stretch"><GamingButton type="submit" variant="primary" block loading={busy === 'password'}>Đổi mật khẩu</GamingButton></BaseFormActions>
          </BaseForm>
        </PageSection>
      </PageStack>
    </PageColumns>
  </PageShell>;
}

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
import { mediaRepository, profileRepository } from '../services/repositories';
import { getUserFacingError } from '../utils/userFacingError';
import { showToast } from '../utils/toast';
import MarketplaceImage from '../components/base/MarketplaceImage';
import { BaseInput } from '../components/base/FormControls';

export default function ProfilePage() {
  const { customer, refreshCustomer, logout } = useAuth();
  const [profile, setProfile] = useState({ name: '', phone: '', avatar_url: '' });
  const [avatarName, setAvatarName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [busy, setBusy] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [reloading, setReloading] = useState(false);

  useEffect(() => setProfile({ name: customer?.name || '', phone: customer?.phone || '', avatar_url: customer?.avatar_url || '' }), [customer]);

  const uploadAvatar = async (file) => {
    if (!file) return;
    setAvatarName(file.name); setBusy('avatar');
    try {
      const result = await mediaRepository.uploadImages([file], setUploadProgress);
      const url = result?.urls?.[0] || result?.data?.[0]?.url || result?.[0]?.url;
      if (!url) throw new Error('Không nhận được đường dẫn ảnh.');
      setProfile((value) => ({ ...value, avatar_url: url }));
      showToast('success', 'Đã tải ảnh đại diện. Hãy lưu thông tin cá nhân để áp dụng.');
    } catch (exception) { showToast('error', getUserFacingError(exception, 'Không thể tải ảnh đại diện.')); }
    finally { setBusy(''); setUploadProgress(0); }
  };

  const saveProfile = async (event) => {
    event.preventDefault(); setBusy('profile');
    try { await profileRepository.update(profile); await refreshCustomer(); showToast('success', 'Đã cập nhật thông tin cá nhân.'); }
    catch (exception) { showToast('error', getUserFacingError(exception, 'Không thể cập nhật hồ sơ.')); }
    finally { setBusy(''); }
  };
  const requestEmail = async (event) => {
    event.preventDefault(); setBusy('email');
    try { await profileRepository.requestEmailChange({ email: newEmail }); showToast('success', 'Đã gửi liên kết xác nhận đến địa chỉ thư điện tử mới.'); setNewEmail(''); }
    catch (exception) { showToast('error', getUserFacingError(exception, 'Không thể gửi yêu cầu đổi địa chỉ thư điện tử.')); }
    finally { setBusy(''); }
  };
  const changePassword = async (event) => {
    event.preventDefault(); setBusy('password');
    try { await profileRepository.changePassword(password); showToast('success', 'Đã đổi mật khẩu. Vui lòng đăng nhập lại.'); await logout(); window.dispatchEvent(new CustomEvent('mbn:open-auth', { detail: { mode: 'login' } })); }
    catch (exception) { showToast('error', getUserFacingError(exception, 'Không thể đổi mật khẩu.')); }
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
          <FormField label="Tên khách hàng" required><BaseInput value={profile.name} onChange={(event) => setProfile((value) => ({ ...value, name: event.target.value }))} required /></FormField>
          <FormField label="Số điện thoại"><BaseInput value={profile.phone} onChange={(event) => setProfile((value) => ({ ...value, phone: event.target.value }))} inputMode="tel" /></FormField>
          <ImageUploadField label="Ảnh đại diện" value={profile.avatar_url} fileName={avatarName} loading={busy === 'avatar'} progress={uploadProgress} circular onChange={uploadAvatar} onRemove={() => { setProfile((value) => ({ ...value, avatar_url: '' })); setAvatarName(''); }} />
          <DefinitionGrid className="mbn-profile-meta" items={[{ label: 'Tên đăng nhập', value: customer?.username || '—' }, { label: 'Trạng thái', value: <StatusBadge status={customer?.status} context="account" /> }]} />
          <BaseFormActions align="stretch"><GamingButton type="submit" variant="primary" block loading={busy === 'profile'}>Lưu thông tin cá nhân</GamingButton></BaseFormActions>
        </BaseForm>
      </PageSection>
      <PageStack>
        <PageSection title="Địa chỉ thư điện tử" description={`Địa chỉ hiện tại: ${customer?.email || 'Chưa thiết lập'}`}>
          <BaseForm className="mbn-form-stack" onSubmit={requestEmail}>
            <FormField label="Địa chỉ thư điện tử mới" hint="Địa chỉ mới chỉ được áp dụng sau khi bạn mở liên kết xác nhận trong hộp thư." required><BaseInput type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} required placeholder="vidu@example.com" /></FormField>
            <BaseFormActions align="stretch"><GamingButton type="submit" block loading={busy === 'email'}>Gửi liên kết xác nhận</GamingButton></BaseFormActions>
          </BaseForm>
        </PageSection>
        <PageSection title="Đổi mật khẩu" description="Sử dụng mật khẩu mạnh và không dùng lại mật khẩu của thư điện tử.">
          <BaseForm className="mbn-form-stack" onSubmit={changePassword}>
            <FormField label="Mật khẩu hiện tại" required><PasswordField value={password.current_password} onChange={(event) => setPassword((value) => ({ ...value, current_password: event.target.value }))} required /></FormField>
            <FormField label="Mật khẩu mới" hint="Tối thiểu 8 ký tự." required><PasswordField value={password.password} onChange={(event) => setPassword((value) => ({ ...value, password: event.target.value }))} minLength={8} required /></FormField>
            <FormField label="Nhập lại mật khẩu mới" required><PasswordField value={password.password_confirmation} onChange={(event) => setPassword((value) => ({ ...value, password_confirmation: event.target.value }))} minLength={8} required /></FormField>
            <BaseFormActions align="stretch"><GamingButton type="submit" variant="primary" block loading={busy === 'password'}>Đổi mật khẩu</GamingButton></BaseFormActions>
          </BaseForm>
        </PageSection>
      </PageStack>
    </PageColumns>
  </PageShell>;
}

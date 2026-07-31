import { useCallback, useEffect, useMemo, useState } from 'react';
import PageShell from '../components/base/PageShell';
import PageSection, { PageStack } from '../components/base/PageSection';
import ResponsiveDataTable from '../components/base/ResponsiveDataTable';
import GamingButton from '../components/base/GamingButton';
import StatusBadge from '../components/base/StatusBadge';
import BaseForm, { BaseFormActions } from '../components/base/BaseForm';
import FormField from '../components/base/FormField';
import { trustRepository } from '../services/repositories';
import { showToast } from '../utils/toast';
import { getUserFacingError } from '../utils/userFacingError';
import { formatMoney } from '../utils/format';
import { BaseInput, BaseSelect, BaseTextarea } from '../components/base/FormControls';

const categoryLabels = {
  transaction: 'Giao dịch', payment: 'Thanh toán', handover: 'Bàn giao', rental_due: 'Hạn thuê', document: 'Tài liệu', case: 'Yêu cầu hỗ trợ', listing: 'Tin đăng', security: 'Bảo mật', marketing: 'Tin giới thiệu',
};
const dateTime = (value) => value ? new Date(value).toLocaleString('vi-VN') : '—';

export default function AccountTrustPage() {
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [twoFactorStatus, setTwoFactorStatus] = useState({ enabled: false });
  const [twoFactorSetup, setTwoFactorSetup] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorPassword, setTwoFactorPassword] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [busy, setBusy] = useState('');
  const [searchForm, setSearchForm] = useState({ name: '', keyword: '', product_type: 'ninja_school', notify: true });

  const load = useCallback(async () => {
    const [favoritePayload, reviewPayload, preferencePayload, sessionPayload, searchPayload, twoFactorPayload] = await Promise.all([
      trustRepository.favorites({ per_page: 100 }), trustRepository.reviews({ per_page: 100 }), trustRepository.preferences(), trustRepository.sessions(), trustRepository.savedSearches(), trustRepository.twoFactorStatus(),
    ]);
    setFavorites(favoritePayload?.data || favoritePayload || []);
    setReviews(reviewPayload?.data || reviewPayload || []);
    setPreferences(preferencePayload || []);
    setSessions(sessionPayload || []);
    setSavedSearches(searchPayload || []);
    setTwoFactorStatus(twoFactorPayload || { enabled: false });
  }, []);
  useEffect(() => { load().catch(() => {}); }, [load]);

  const removeFavorite = useCallback(async (listingId) => { setBusy(`favorite-${listingId}`); try { await trustRepository.unfavorite(listingId); await load(); } finally { setBusy(''); } }, [load]);
  const revoke = async (id) => { setBusy(`session-${id}`); try { await trustRepository.revokeSession(id); showToast('success', 'Đã thu hồi phiên đăng nhập.'); await load(); } catch (error) { showToast('error', getUserFacingError(error)); } finally { setBusy(''); } };
  const savePreferences = async () => { setBusy('preferences'); try { const result = await trustRepository.updatePreferences(preferences); setPreferences(result || []); showToast('success', 'Đã lưu tùy chọn thông báo.'); } catch (error) { showToast('error', getUserFacingError(error)); } finally { setBusy(''); } };
  const addSearch = async (event) => { event.preventDefault(); setBusy('search'); try { await trustRepository.saveSearch({ name: searchForm.name, filters: { keyword: searchForm.keyword, product_type: searchForm.product_type }, notify: searchForm.notify }); setSearchForm({ name: '', keyword: '', product_type: 'ninja_school', notify: true }); await load(); } catch (error) { showToast('error', getUserFacingError(error)); } finally { setBusy(''); } };

  const beginTwoFactor = async () => { setBusy('2fa-setup'); try { const data=await trustRepository.beginTwoFactorSetup(); setTwoFactorSetup(data); setRecoveryCodes([]); showToast('success','Đã tạo khóa xác thực.'); } catch(error){ showToast('error',getUserFacingError(error)); } finally { setBusy(''); } };
  const confirmTwoFactor = async (event) => { event.preventDefault(); setBusy('2fa-confirm'); try { const data=await trustRepository.confirmTwoFactor(twoFactorCode); setRecoveryCodes(data?.recovery_codes || []); setTwoFactorCode(''); setTwoFactorSetup(null); await load(); showToast('success','Đã bật xác thực hai lớp.'); } catch(error){ showToast('error',getUserFacingError(error)); } finally { setBusy(''); } };
  const regenerateCodes = async () => { setBusy('2fa-codes'); try { const data=await trustRepository.regenerateRecoveryCodes(twoFactorCode); setRecoveryCodes(data?.recovery_codes || []); setTwoFactorCode(''); } catch(error){ showToast('error',getUserFacingError(error)); } finally { setBusy(''); } };
  const disableTwoFactor = async () => { setBusy('2fa-disable'); try { await trustRepository.disableTwoFactor({ password: twoFactorPassword, code: twoFactorCode }); setTwoFactorPassword(''); setTwoFactorCode(''); setRecoveryCodes([]); await load(); showToast('success','Đã tắt xác thực hai lớp.'); } catch(error){ showToast('error',getUserFacingError(error)); } finally { setBusy(''); } };

  const removeSearch = async (id) => { setBusy(`search-${id}`); try { await trustRepository.deleteSearch(id); await load(); } finally { setBusy(''); } };

  const favoriteColumns = useMemo(() => [
    { key: 'listing', title: 'Tin đăng', width: 260, render: (_, row) => <div className="table-primary-cell"><b>{row.listing?.title || row.listing?.code}</b><small>{row.listing?.product?.name || 'Tài khoản trò chơi'}</small></div> },
    { key: 'seller', title: 'Người bán', width: 170, render: (_, row) => row.listing?.owner?.name || '—' },
    { key: 'price', title: 'Mức giá', width: 150, render: (_, row) => formatMoney(row.listing?.sale_price || row.listing?.rental_price || 0) },
    { key: 'status', title: 'Trạng thái', width: 140, render: (_, row) => <StatusBadge status={row.listing?.status} /> },
    { key: 'actions', title: 'Thao tác', fixed: 'right', width: 130, render: (_, row) => <GamingButton size="sm" variant="danger" loading={busy === `favorite-${row.listing_id}`} onClick={() => removeFavorite(row.listing_id)}>Bỏ lưu</GamingButton> },
  ], [busy, removeFavorite]);
  const reviewColumns = [
    { key: 'transaction', title: 'Giao dịch', width: 160, render: (_, row) => row.transaction?.code || '—' },
    { key: 'role', title: 'Quan hệ', width: 180, render: (_, row) => row.reviewer?.id === row.reviewee?.id ? '—' : `${row.reviewer?.name || 'Bạn'} → ${row.reviewee?.name || 'Đối tác'}` },
    { key: 'rating', title: 'Điểm', width: 100, render: (_, row) => `${row.rating}/5` },
    { key: 'comment', title: 'Nhận xét', width: 320, render: (_, row) => row.comment || 'Không có nhận xét' },
    { key: 'status', title: 'Trạng thái', width: 130, render: (_, row) => <StatusBadge status={row.status} /> },
  ];
  const sessionColumns = [
    { key: 'device', title: 'Thiết bị', width: 360, render: (_, row) => row.user_agent || 'Không xác định' },
    { key: 'ip', title: 'Địa chỉ IP', width: 160, render: (_, row) => row.ip_address || '—' },
    { key: 'last', title: 'Hoạt động gần nhất', width: 190, render: (_, row) => dateTime(row.last_used_at || row.created_at) },
    { key: 'expires', title: 'Hết hạn', width: 190, render: (_, row) => dateTime(row.expires_at) },
    { key: 'actions', title: 'Thao tác', fixed: 'right', width: 130, render: (_, row) => <GamingButton size="sm" variant="danger" loading={busy === `session-${row.id}`} onClick={() => revoke(row.id)}>Thu hồi</GamingButton> },
  ];
  const searchColumns = [
    { key: 'name', title: 'Tên bộ lọc', width: 180, render: (_, row) => <b>{row.name}</b> },
    { key: 'filters', title: 'Điều kiện', width: 340, render: (_, row) => JSON.stringify(row.filters || {}) },
    { key: 'notify', title: 'Cảnh báo', width: 120, render: (_, row) => row.notify ? 'Đang bật' : 'Đang tắt' },
    { key: 'actions', title: 'Thao tác', fixed: 'right', width: 120, render: (_, row) => <GamingButton size="sm" variant="danger" loading={busy === `search-${row.id}`} onClick={() => removeSearch(row.id)}>Xóa</GamingButton> },
  ];

  return <PageShell title="Tin đã lưu và bảo mật" description="Quản lý tin yêu thích, đánh giá, cảnh báo tìm kiếm, thông báo và các phiên đăng nhập." width="wide">
    <PageStack>
      <PageSection title="Tin đăng đã lưu" description="Các tài khoản bạn muốn theo dõi hoặc xem lại."><ResponsiveDataTable caption="Tin đăng đã lưu" columns={favoriteColumns} rows={favorites} rowKey="id" minWidth={920} emptyText="Chưa có tin đăng đã lưu." /></PageSection>
      <PageSection title="Đánh giá giao dịch"><ResponsiveDataTable caption="Đánh giá giao dịch" columns={reviewColumns} rows={reviews} rowKey="id" minWidth={880} emptyText="Chưa có đánh giá giao dịch." /></PageSection>
      <PageSection title="Bộ lọc và cảnh báo đã lưu"><BaseForm onSubmit={addSearch} className="mbn-form-stack"><div className="mbn-base-form__grid mbn-base-form__grid--3"><FormField label="Tên bộ lọc" required><BaseInput required value={searchForm.name} onChange={(event) => setSearchForm((value) => ({ ...value, name: event.target.value }))} /></FormField><FormField label="Từ khóa"><BaseInput value={searchForm.keyword} onChange={(event) => setSearchForm((value) => ({ ...value, keyword: event.target.value }))} /></FormField><FormField label="Trò chơi"><BaseSelect value={searchForm.product_type} onChange={(event) => setSearchForm((value) => ({ ...value, product_type: event.target.value }))}><option value="ninja_school">Ninja School</option><option value="dragon_ball">Ngọc Rồng</option><option value="avatar">Avatar</option></BaseSelect></FormField></div><BaseFormActions><GamingButton type="submit" loading={busy === 'search'}>Lưu bộ lọc</GamingButton></BaseFormActions></BaseForm><ResponsiveDataTable caption="Bộ lọc đã lưu" columns={searchColumns} rows={savedSearches} rowKey="id" minWidth={800} emptyText="Chưa có bộ lọc đã lưu." /></PageSection>
      <PageSection title="Tùy chọn thông báo" description="Thông báo bảo mật luôn được giữ trong ứng dụng và thư điện tử."><div className="notification-preference-grid">{preferences.map((item, index) => <article key={item.category}><b>{categoryLabels[item.category] || item.category}</b>{['in_app','email','push'].map((channel) => <label key={channel}><BaseInput type="checkbox" checked={Boolean(item[channel])} disabled={item.category === 'security' && channel !== 'push'} onChange={(event) => setPreferences((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, [channel]: event.target.checked } : row))} />{channel === 'in_app' ? 'Trong ứng dụng' : channel === 'email' ? 'Thư điện tử' : 'Thông báo đẩy'}</label>)}</article>)}</div><GamingButton loading={busy === 'preferences'} onClick={savePreferences}>Lưu tùy chọn</GamingButton></PageSection>

      <PageSection title="Xác thực hai lớp" description="Bảo vệ đăng nhập bằng ứng dụng xác thực. Mã khôi phục chỉ hiển thị một lần sau khi bật hoặc tạo lại.">
        <div className="two-factor-panel">
          <StatusBadge status={twoFactorStatus.enabled ? 'active' : 'disabled'} context="account">{twoFactorStatus.enabled ? 'Đang bật' : 'Chưa bật'}</StatusBadge>
          {!twoFactorStatus.enabled && !twoFactorSetup ? <GamingButton loading={busy === '2fa-setup'} onClick={beginTwoFactor}>Thiết lập xác thực hai lớp</GamingButton> : null}
          {twoFactorSetup ? <BaseForm onSubmit={confirmTwoFactor} className="mbn-form-stack"><div className="mbn-form-alert">Thêm khóa sau vào ứng dụng Authenticator, sau đó nhập mã 6 số để xác nhận.</div><FormField label="Khóa bí mật"><BaseInput readOnly value={twoFactorSetup.secret || ''} /></FormField><FormField label="Đường dẫn OTP"><BaseTextarea readOnly value={twoFactorSetup.otpauth_url || ''} rows={3} /></FormField><FormField label="Mã xác thực" required><BaseInput value={twoFactorCode} onChange={(event) => setTwoFactorCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" required /></FormField><BaseFormActions><GamingButton type="submit" variant="primary" loading={busy === '2fa-confirm'}>Bật xác thực hai lớp</GamingButton></BaseFormActions></BaseForm> : null}
          {twoFactorStatus.enabled ? <div className="mbn-form-stack"><FormField label="Mã xác thực hoặc mã khôi phục"><BaseInput value={twoFactorCode} onChange={(event) => setTwoFactorCode(event.target.value)} autoComplete="one-time-code" /></FormField><BaseFormActions><GamingButton loading={busy === '2fa-codes'} onClick={regenerateCodes}>Tạo lại mã khôi phục</GamingButton></BaseFormActions><FormField label="Mật khẩu hiện tại"><BaseInput type="password" value={twoFactorPassword} onChange={(event) => setTwoFactorPassword(event.target.value)} autoComplete="current-password" /></FormField><GamingButton variant="danger" loading={busy === '2fa-disable'} onClick={disableTwoFactor}>Tắt xác thực hai lớp</GamingButton></div> : null}
          {recoveryCodes.length ? <div className="recovery-code-panel"><strong>Lưu các mã khôi phục này ở nơi an toàn</strong><div>{recoveryCodes.map((code) => <code key={code}>{code}</code>)}</div></div> : null}
        </div>
      </PageSection>
      <PageSection title="Phiên đăng nhập"><ResponsiveDataTable caption="Phiên đăng nhập" columns={sessionColumns} rows={sessions} rowKey="id" minWidth={980} emptyText="Không có phiên đăng nhập đang hoạt động." /></PageSection>
    </PageStack>
  </PageShell>;
}

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/base/PageShell';
import GamingButton from '../components/base/GamingButton';
import { useRemoteData } from '../hooks/useRemoteData';
import { notificationRepository } from '../services/repositories';
import { notifyNotificationCountChanged } from '../utils/notificationEvents';

const formatTime = (value) => value ? new Date(value).toLocaleString('vi-VN') : '—';

export default function NotificationsPage() {
  const { data, loading, error, reload } = useRemoteData(() => notificationRepository.list({ per_page: 50 }), [], { queryKey: 'notifications', staleTime: 15000 });
  const rows = useMemo(() => data?.notifications?.data || [], [data]);
  const read = async (item) => { if (!item.read_at) await notificationRepository.read(item.id); await reload(); notifyNotificationCountChanged(); };
  const readAll = async () => { await notificationRepository.readAll(); await reload(); notifyNotificationCountChanged(); };
  return <PageShell title="Thông báo của tôi" description="Các cập nhật từ quản trị viên và tiến trình giao dịch." loading={loading} loadingVariant="table" error={error} onReload={reload} actions={rows.some(x => !x.read_at) ? <GamingButton size="sm" variant="secondary" onClick={readAll}>Đánh dấu đã đọc</GamingButton> : null}>
    <section className="notification-list">
      {rows.map(item => <article key={item.id} className={`notification-item ${item.read_at ? '' : 'is-unread'}`}>
        <div className="notification-item__dot" aria-hidden="true" />
        <div className="notification-item__body">
          <div className="notification-item__head"><strong>{item.title}</strong><time>{formatTime(item.created_at)}</time></div>
          <p>{item.message}</p>
          {item.action_url ? <Link to={item.action_url} onClick={() => read(item)}>Xem nội dung liên quan</Link> : !item.read_at ? <button type="button" onClick={() => read(item)}>Đánh dấu đã đọc</button> : null}
        </div>
      </article>)}
      {!rows.length && !loading ? <div className="empty-panel"><h2>Chưa có thông báo</h2><p>Các cập nhật về tin đăng, thanh toán, bàn giao và tranh chấp sẽ xuất hiện tại đây.</p></div> : null}
    </section>
  </PageShell>;
}

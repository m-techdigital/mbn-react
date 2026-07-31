import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AccountCard from '../components/account/AccountCard';
import AccountFilters from '../components/account/AccountFilters';
import PageShell from '../components/base/PageShell';
import EmptyState from '../components/base/EmptyState';
import BasePagination from '../components/base/BasePagination';
import { games } from '../data/catalog';
import { useRemoteData } from '../hooks/useRemoteData';
import { gameRepository } from '../services/repositories';
import { arrayData, metaData } from '../utils/format';
import MarketplaceImage from '../components/base/MarketplaceImage';

const typeByPath = (path) => path.includes('ninja-school') ? 'ninjas' : path.includes('ngoc-rong') ? 'dragonBalls' : 'avatars';
const notes = {
  ninjas: [
    'Sở hữu Nick Ninja School Online chỉ sau 1–5 phút',
    'Nick có Sim đăng ký. Xem HD chuyển Sim',
    'Hỗ trợ trả góp lên đến 1 tháng, thời gian và số tiền phụ thuộc giá trị nick',
    'Xem hướng dẫn mua nick để giao dịch nhanh chóng',
  ],
  dragonBalls: [
    'Sở hữu Nick Ngọc Rồng Online chỉ sau 1–5 phút',
    'Tất cả nick Ngọc Rồng trên shop đều là đăng ký ảo',
    'Sau khi mua bạn chỉ cần đổi mật khẩu',
    'Xem hướng dẫn mua nick để biết cách mua nhanh chóng',
  ],
  avatars: [
    'Sở hữu Nick Avatar XS Diệu Kỳ chỉ sau 1–5 phút',
    'Group mới và mọi người tham gia giao lưu, trao đổi kinh nghiệm',
    'Nick có Sim đăng ký. Xem HD chuyển Sim',
    'Hỗ trợ trả góp và đặt cọc theo từng tài khoản',
  ],
};

export default function GameListPage() {
  const location = useLocation();
  const type = typeByPath(location.pathname);
  const game = games.find((entry) => entry.key === type);
  const [params, setParams] = useState({ page: 1, perPage: 12 });
  const query = useMemo(() => params, [params]);
  const apiQuery = useMemo(() => { const { sort: _sort, ...rest } = query; return rest; }, [query]);
  const { data, loading, error, reload } = useRemoteData(() => gameRepository[type].list(apiQuery), [type, apiQuery], { queryKey: 'game-list', staleTime: 30000, keepPreviousData: true });
  const rawItems = arrayData(data);
  const sortedItems = [...rawItems].sort((a, b) => {
    if (params.sort === 'price_asc') return Number(a.sale_price || a.rental_price || 0) - Number(b.sale_price || b.rental_price || 0);
    if (params.sort === 'price_desc') return Number(b.sale_price || b.rental_price || 0) - Number(a.sale_price || a.rental_price || 0);
    if (params.sort === 'level_desc') return Number(b.level || b.product?.metadata?.level || 0) - Number(a.level || a.product?.metadata?.level || 0);
    return new Date(b.published_at || b.created_at || 0) - new Date(a.published_at || a.created_at || 0);
  });
  const segment = location.pathname.endsWith('/nick-vip') ? 'vip' : location.pathname.endsWith('/nick-gia-re') ? 'cheap' : null;
  const items = segment === 'vip' ? sortedItems.filter((item) => Number(item.sale_price || 0) >= 900000) : segment === 'cheap' ? sortedItems.filter((item) => Number(item.sale_price || 0) < 900000) : sortedItems;
  const meta = metaData(data);
  const total = segment ? items.length : (meta.total || meta.total_count || items.length);

  return (
    <PageShell title={segment === 'vip' ? 'Nick Ninja School VIP' : segment === 'cheap' ? 'Nick Ninja School giá rẻ' : type === 'ninjas' ? 'Nick Ninja School Online' : type === 'dragonBalls' ? 'Nick Ngọc Rồng Online' : 'Nick Avatar XS Diệu Kỳ'} loading={loading} error={error} onReload={reload} width="wide">
      <section className="game-intro">
        <MarketplaceImage src={game?.image} alt={game?.title} />
        <ul>{notes[type].map((note) => <li key={note}>{note}</li>)}</ul>
      </section>
      <AccountFilters type={type} onSubmit={(values) => setParams({ ...values, page: 1, perPage: 12 })} resultText={`Tìm thấy ${total} tài khoản phù hợp`} />
      <section className="catalog-trust-strip" aria-label="Thông tin giao dịch"><span>✓ Tin đăng được quản trị viên kiểm tra trước khi hiển thị</span><span>✓ Thanh toán và bàn giao được lưu trong hệ thống</span><span>✓ Có cơ chế khiếu nại và hồ sơ tài liệu</span></section>
      {items.length ? (
        <div className="account-grid">{items.map((item) => <AccountCard key={item.id || item.code} item={item} basePath={game.path} />)}</div>
      ) : !loading && <EmptyState title="Chưa có tài khoản phù hợp" description="Hãy thay đổi điều kiện tìm kiếm hoặc quay lại sau khi có tin đăng mới." />}
      {total > 12 && (
        <div className="pagination-wrap">
          <BasePagination page={params.page} pageSize={12} total={total} onChange={(page) => setParams((current) => ({ ...current, page }))} />
        </div>
      )}
    </PageShell>
  );
}

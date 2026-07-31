import { Link } from 'react-router-dom';
import PageShell from '../components/base/PageShell';
import PageSection from '../components/base/PageSection';
import GamingButton from '../components/base/GamingButton';
import StatusBadge from '../components/base/StatusBadge';
import EmptyState from '../components/base/EmptyState';
import { useRemoteData } from '../hooks/useRemoteData';
import { listingRepository } from '../services/repositories';
import { arrayData, formatMoney } from '../utils/format';
import { valueLabel } from '../utils/labels';
import MarketplaceImage from '../components/base/MarketplaceImage';

export default function MyListingsPage() {
  const { data, loading, error, reload } = useRemoteData(() => listingRepository.mine({ per_page: 50 }), [], { queryKey: 'my-listings', staleTime: 15000 });
  const rows = arrayData(data);
  return <PageShell title="Tin đăng của tôi" description="Quản lý tài khoản đang bán hoặc cho thuê trên MBN." loading={loading} loadingVariant="list" error={error} onReload={reload} width="wide" actions={<Link to="/account/listings/new"><GamingButton variant="primary" size="sm">Đăng tài khoản</GamingButton></Link>}>
    <PageSection title="Danh sách tin đăng" description={`${rows.length} tin đăng được tìm thấy.`}>
      {rows.length ? <section className="seller-listings-grid">{rows.map((item) => <article className="seller-listing-card" key={item.id}><MarketplaceImage src={item.product?.image_url || '/images/mock/accounts/ninja-1.jpg'} alt={item.title} /><div><StatusBadge status={item.status} /><h2>{item.title}</h2><p>{item.product?.name}</p><dl><div><dt>Loại tin</dt><dd>{valueLabel(item.listing_type)}</dd></div><div><dt>Giá</dt><dd>{formatMoney(item.listing_type === 'sale' ? item.sale_price : item.rental_price)}</dd></div><div><dt>Mã tin</dt><dd>{item.code}</dd></div>{item.listing_type === 'rental' ? <><div><dt>Cách thu tiền</dt><dd>{valueLabel(item.rental_billing_mode)}</dd></div><div><dt>Số gói thuê</dt><dd>{item.rental_rates?.length || item.rentalRates?.length || 0}</dd></div></> : null}</dl>{item.listing_type === 'rental' && (item.rental_rates || item.rentalRates)?.length ? <div className="seller-listing-rates">{(item.rental_rates || item.rentalRates).map((rate) => <span key={rate.id}>{rate.label}: {formatMoney(rate.price)}</span>)}</div> : null}{item.rejection_reason ? <p className="seller-listing-card__reason">Lý do từ chối: {item.rejection_reason}</p> : null}</div></article>)}</section> : !loading ? <EmptyState title="Chưa có tin đăng" description="Các tin đăng đã gửi sẽ xuất hiện tại đây sau khi được tạo." /> : null}
    </PageSection>
  </PageShell>;
}

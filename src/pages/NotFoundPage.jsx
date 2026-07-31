import { Link } from 'react-router-dom';
import MarketplaceImage from '../components/base/MarketplaceImage';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <MarketplaceImage src="/icon/404.gif" alt="Không tìm thấy trang" />
      <h1>Không tìm thấy trang</h1>
      <Link className="gaming-button" to="/">Về trang chủ</Link>
    </div>
  );
}

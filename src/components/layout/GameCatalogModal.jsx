import GamingModal from '../base/GamingModal';
import { games } from '../../data/catalog';
import { Link } from 'react-router-dom';
import MarketplaceImage from '../base/MarketplaceImage';

export default function GameCatalogModal({ open, onClose }) {
  return <GamingModal open={open} onClose={onClose} title="Chọn trò chơi" description="Chọn trò chơi để xem các tài khoản đang được hỗ trợ.">
    <div className="game-catalog-modal__grid">
      {games.map((game) => <Link key={game.path} to={game.path} onClick={onClose} className="game-catalog-modal__item">
        <MarketplaceImage src={game.image} alt={game.title} />
        <span><strong>{game.title}</strong><small>{game.subtitle}</small></span>
      </Link>)}
    </div>
  </GamingModal>;
}

import { NavLink } from 'react-router-dom';
import { BOTTOM_NAV_ITEMS } from '../../config/navigation';

export default function BottomNav() {
  return <nav className="bottom-nav" aria-label="Điều hướng nhanh">{BOTTOM_NAV_ITEMS.map((item) => { const Icon = item.icon; return <NavLink key={item.to} to={item.to} end={item.to === '/'}><Icon/><span>{item.label}</span></NavLink>; })}</nav>;
}

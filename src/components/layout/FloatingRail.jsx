import { ArrowDownOutlined, ArrowUpOutlined, EyeOutlined } from '@ant-design/icons';

export default function FloatingRail() {
  const scrollTo = (top) => window.scrollTo({ top, behavior: 'smooth' });
  return (
    <div className="floating-rail" aria-label="Điều hướng nhanh">
      <button type="button" title="Xem nhanh"><EyeOutlined /></button>
      <button type="button" title="Lên đầu trang" onClick={() => scrollTo(0)}><ArrowUpOutlined /></button>
      <button type="button" title="Xuống cuối trang" onClick={() => scrollTo(document.documentElement.scrollHeight)}><ArrowDownOutlined /></button>
    </div>
  );
}

import GamingButton from './GamingButton';

export default function BasePagination({ page = 1, pageSize = 12, total = 0, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const windowStart = Math.max(1, Math.min(page - 2, pages - 4));
  const visible = Array.from({ length: Math.min(5, pages) }, (_, index) => windowStart + index);
  return <nav className="mbn-pagination" aria-label="Phân trang">
    <GamingButton size="sm" variant="secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>Trước</GamingButton>
    <div className="mbn-pagination__pages">{visible.map((number) => <button type="button" key={number} className={number === page ? 'is-active' : ''} aria-current={number === page ? 'page' : undefined} onClick={() => onChange(number)}>{number}</button>)}</div>
    <GamingButton size="sm" variant="secondary" disabled={page >= pages} onClick={() => onChange(page + 1)}>Sau</GamingButton>
  </nav>;
}

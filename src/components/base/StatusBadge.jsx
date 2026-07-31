import { statusLabel, statusTone } from '../../utils/labels';

export { statusLabel } from '../../utils/labels';

export default function StatusBadge({ status, children, className = '', context = '' }) {
  const tone = statusTone(status);
  return <span className={`mbn-status-badge is-${tone} ${className}`.trim()}>{children || statusLabel(status, 'Đang xử lý', context)}</span>;
}

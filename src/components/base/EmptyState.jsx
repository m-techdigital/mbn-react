import GamingButton from './GamingButton';

export default function EmptyState({ title = 'Chưa có dữ liệu', description, actionLabel, onAction, compact = false }) {
  return <section className={`mbn-empty-state ${compact ? 'is-compact' : ''}`.trim()}>
    <span className="mbn-empty-state__icon" aria-hidden="true">◇</span>
    <h2>{title}</h2>
    {description ? <p>{description}</p> : null}
    {actionLabel && onAction ? <GamingButton variant="primary" onClick={onAction}>{actionLabel}</GamingButton> : null}
  </section>;
}

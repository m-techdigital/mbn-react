export default function InlineNotice({ type = 'info', title, children, supportCode }) {
  return <section className={`mbn-inline-notice is-${type}`} role={type === 'error' ? 'alert' : 'status'}>
    <span className="mbn-inline-notice__icon" aria-hidden="true">{type === 'success' ? '✓' : type === 'warning' ? '!' : type === 'error' ? '×' : 'i'}</span>
    <div>{title ? <strong>{title}</strong> : null}<p>{children}</p>{supportCode ? <small>Mã hỗ trợ: {supportCode}</small> : null}</div>
  </section>;
}

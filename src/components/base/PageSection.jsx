export default function PageSection({ title, description, actions = null, children, className = '', tone = 'default' }) {
  return (
    <section className={`mbn-page-section mbn-page-section--${tone} ${className}`.trim()}>
      {(title || description || actions) ? (
        <header className="mbn-page-section__header">
          <div>
            {title ? <h2>{title}</h2> : null}
            {description ? <p>{description}</p> : null}
          </div>
          {actions ? <div className="mbn-page-section__actions">{actions}</div> : null}
        </header>
      ) : null}
      <div className="mbn-page-section__body">{children}</div>
    </section>
  );
}

export function PageStack({ children, className = '' }) {
  return <div className={`mbn-page-stack ${className}`.trim()}>{children}</div>;
}

export function PageColumns({ children, className = '', ratio = 'balanced' }) {
  return <div className={`mbn-page-columns mbn-page-columns--${ratio} ${className}`.trim()}>{children}</div>;
}

export function DefinitionGrid({ items = [], className = '' }) {
  return <dl className={`mbn-definition-grid ${className}`.trim()}>{items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value ?? '—'}</dd></div>)}</dl>;
}

export function MetricGrid({ items = [], className = '' }) {
  return <div className={`mbn-metric-grid ${className}`.trim()}>{items.map((item) => <article key={item.label} className={item.tone ? `is-${item.tone}` : ''}><span>{item.label}</span><b>{item.value}</b>{item.description ? <small>{item.description}</small> : null}</article>)}</div>;
}

export default function BaseForm({ children, className = '', onSubmit, noValidate = true, ...props }) {
  return (
    <form className={`mbn-base-form ${className}`.trim()} onSubmit={onSubmit} noValidate={noValidate} {...props}>
      {children}
    </form>
  );
}

export function BaseFormGrid({ children, className = '', columns = 2 }) {
  return (
    <div className={`mbn-base-form__grid mbn-base-form__grid--${columns} ${className}`.trim()}>
      {children}
    </div>
  );
}

export function BaseFormSection({ title, description, children, className = '', actions = null }) {
  return (
    <section className={`mbn-base-form__section ${className}`.trim()}>
      {(title || description || actions) ? (
        <header className="mbn-base-form__section-head">
          <div>
            {title ? <h3>{title}</h3> : null}
            {description ? <p>{description}</p> : null}
          </div>
          {actions ? <div className="mbn-base-form__section-actions">{actions}</div> : null}
        </header>
      ) : null}
      <div className="mbn-base-form__section-body">{children}</div>
    </section>
  );
}

export function BaseFormActions({ children, className = '', align = 'end' }) {
  return <div className={`mbn-base-form__actions is-${align} ${className}`.trim()}>{children}</div>;
}

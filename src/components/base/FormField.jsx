export default function FormField({ label, hint, error, required = false, className = '', children }) {
  return (
    <label className={`mbn-form-field ${error ? 'has-error' : ''} ${className}`.trim()}>
      <span className="mbn-form-field__label">
        {label}
        {required ? <i aria-hidden="true">*</i> : null}
      </span>
      <span className="mbn-form-field__control">{children}</span>
      {error ? <small className="mbn-form-field__error">{error}</small> : hint ? <small className="mbn-form-field__hint">{hint}</small> : null}
    </label>
  );
}

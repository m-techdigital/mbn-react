import { forwardRef } from 'react';

const join = (...values) => values.filter(Boolean).join(' ');

export const BaseInput = forwardRef(function BaseInput({ className = '', invalid = false, ...props }, ref) {
  return <input ref={ref} className={join('mbn-control', 'mbn-control--input', invalid && 'is-invalid', className)} aria-invalid={invalid || undefined} {...props} />;
});

export const BaseSelect = forwardRef(function BaseSelect({ className = '', invalid = false, children, ...props }, ref) {
  return <select ref={ref} className={join('mbn-control', 'mbn-control--select', invalid && 'is-invalid', className)} aria-invalid={invalid || undefined} {...props}>{children}</select>;
});

export const BaseTextarea = forwardRef(function BaseTextarea({ className = '', invalid = false, ...props }, ref) {
  return <textarea ref={ref} className={join('mbn-control', 'mbn-control--textarea', invalid && 'is-invalid', className)} aria-invalid={invalid || undefined} {...props} />;
});

export function showToast(type, message, options = {}) {
  window.dispatchEvent(new CustomEvent('mbn:toast', { detail: { type, message, duration: options.duration || 3200 } }));
}

export const DATA_MODE = (import.meta.env.VITE_DATA_MODE || 'api').toLowerCase();
export const isMockMode = () => DATA_MODE === 'mock';
export const isApiMode = () => !isMockMode();

// Mock data is an explicit development mode only. Runtime API failures must
// remain visible to the UI so loading/error/retry states are truthful.
export const readFromConfiguredSource = (apiLoader, mockLoader) => (
  isMockMode() ? mockLoader() : apiLoader()
);

// Compatibility alias for existing repositories. It no longer falls back
// silently when the API fails.
export const withReadFallback = readFromConfiguredSource;

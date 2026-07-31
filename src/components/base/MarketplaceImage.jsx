import { useEffect, useMemo, useState } from 'react';

const DEFAULT_FALLBACK = '/images/avatar-placeholder.svg';

export default function MarketplaceImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt = '',
  priority = false,
  loading,
  decoding = 'async',
  fetchPriority,
  onError,
  ...props
}) {
  const initialSource = useMemo(() => src || fallbackSrc, [src, fallbackSrc]);
  const [resolvedSource, setResolvedSource] = useState(initialSource);

  useEffect(() => {
    setResolvedSource(initialSource);
  }, [initialSource]);

  return (
    <img
      {...props}
      src={resolvedSource}
      alt={alt}
      loading={loading || (priority ? 'eager' : 'lazy')}
      decoding={decoding}
      fetchPriority={fetchPriority || (priority ? 'high' : 'auto')}
      onError={(event) => {
        if (resolvedSource !== fallbackSrc) setResolvedSource(fallbackSrc);
        onError?.(event);
      }}
    />
  );
}

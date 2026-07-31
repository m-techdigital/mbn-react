import { useState } from 'react';
import MarketplaceImage from './MarketplaceImage';

export default function AsyncImage({ className = '', wrapperClassName = '', alt = '', ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <span className={`async-image ${loaded ? 'is-loaded' : ''} ${failed ? 'is-error' : ''} ${wrapperClassName}`.trim()}>
      {!loaded && <span className="async-image__placeholder mbn-skeleton" aria-hidden="true" />}
      <MarketplaceImage
        {...props}
        alt={alt}
        className={className}
        onLoad={(event) => { setLoaded(true); props.onLoad?.(event); }}
        onError={(event) => { setFailed(true); setLoaded(true); props.onError?.(event); }}
      />
    </span>
  );
}

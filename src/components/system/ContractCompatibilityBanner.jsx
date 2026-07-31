import { useEffect, useState } from 'react';
import { fetchMarketplaceContract, isCompatibleContract } from '../../contracts/marketplaceContract';

export default function ContractCompatibilityBanner() {
  const [incompatible, setIncompatible] = useState(false);

  useEffect(() => {
    let active = true;
    fetchMarketplaceContract()
      .then((remote) => active && setIncompatible(!isCompatibleContract(remote)))
      .catch(() => active && setIncompatible(import.meta.env.VITE_DATA_MODE === 'api'));
    return () => { active = false; };
  }, []);

  if (!incompatible) return null;
  return <div className="mbn-contract-banner" role="alert">
    Hệ thống đang được đồng bộ phiên bản. Một số thao tác có thể tạm thời chưa sẵn sàng.
  </div>;
}

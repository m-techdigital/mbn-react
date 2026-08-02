import { useMemo } from 'react';
import { marketplaceOptionsRepository } from '../services/repositories';
import { useRemoteData } from './useRemoteData';

export function useMarketplaceOptions() {
  const state = useRemoteData(() => marketplaceOptionsRepository.get(), [], {
    queryKey: 'marketplace-options',
    staleTime: 300000,
  });
  const documentTypeLabels = useMemo(
    () => Object.fromEntries((state.data?.document_types || []).map(({ value, label }) => [value, label])),
    [state.data],
  );

  return { ...state, documentTypeLabels };
}

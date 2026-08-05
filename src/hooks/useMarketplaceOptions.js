import { useMemo } from "react";
import { marketplaceOptionsRepository } from "../services/repositories";
import { useRemoteData } from "./useRemoteData";

export function useMarketplaceOptions() {
    const state = useRemoteData(() => marketplaceOptionsRepository.get(), [], {
        queryKey: "marketplace-options",
        staleTime: 300000,
    });
    const documentTypeLabels = useMemo(
        () =>
            Object.fromEntries(
                (state.data?.document_types || []).map(({ value, label }) => [
                    value,
                    label,
                ]),
            ),
        [state.data],
    );
    const transactionStatusLabels = useMemo(
        () =>
            Object.fromEntries(
                (state.data?.transaction_statuses || []).map(
                    ({ value, label }) => [value, label],
                ),
            ),
        [state.data],
    );
    const gameAccountDeliveryMethods = state.data?.game_account_delivery_methods || [];
    const itemDeliveryMethods = state.data?.item_delivery_methods || [];
    const disputeOutcomeLabels = useMemo(
        () =>
            Object.fromEntries(
                (state.data?.dispute_outcomes || []).map(({ value, label }) => [
                    value,
                    label,
                ]),
            ),
        [state.data],
    );

    return {
        ...state,
        documentTypeLabels,
        disputeOutcomeLabels,
        transactionStatusLabels,
        gameAccountDeliveryMethods,
        itemDeliveryMethods,
    };
}

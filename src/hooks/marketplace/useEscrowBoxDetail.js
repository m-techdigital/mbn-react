import { useCallback, useEffect, useState } from "react";

import { escrowBoxRepository } from "../../services/repositories/marketplace";

export function useEscrowBoxDetail(id) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            setData(await escrowBoxRepository.show(id));
        } catch (requestError) {
            setError(requestError?.response?.data?.message || requestError.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    const act = async (request) => {
        setLoading(true);
        setError("");
        try {
            const response = await request();
            const next = response?.box || response;
            if (next?.id) setData(next);
            return response;
        } catch (requestError) {
            setError(requestError?.response?.data?.message || requestError.message);
            throw requestError;
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        uploading,
        progress,
        error,
        reload: load,
        confirm: () => act(() => escrowBoxRepository.confirm(id, data.expected_version)),
        cancel: () => act(() => escrowBoxRepository.cancel(id, data.expected_version)),
        rotateInvite: () => act(() => escrowBoxRepository.rotateInvite(id, data.expected_version)),
        clone: () => act(() => escrowBoxRepository.clone(id)),
        resolveCounterparty: (phone) =>
            escrowBoxRepository.resolveCounterparty(id, {
                expected_version: data.expected_version,
                phone,
            }),
        inviteCounterparty: (candidateToken) =>
            act(() =>
                escrowBoxRepository.inviteCounterparty(id, {
                    expected_version: data.expected_version,
                    candidate_token: candidateToken,
                }),
            ),
        cancelCounterpartyInvite: () =>
            act(() =>
                escrowBoxRepository.cancelCounterpartyInvite(
                    id,
                    data.expected_version,
                ),
            ),
        acceptCounterpartyInvite: () =>
            act(() =>
                escrowBoxRepository.acceptCounterpartyInvite(
                    id,
                    data.expected_version,
                ),
            ),
        upload: async (files, stepId) => {
            setUploading(true);
            setProgress(0);
            try {
                setData(await escrowBoxRepository.uploadMedia(id, files, stepId, setProgress));
            } finally {
                setUploading(false);
            }
        },
        submitHandover: (side, note) =>
            act(() =>
                escrowBoxRepository.submitHandover(id, side, {
                    expected_version: data.expected_version,
                    note,
                }),
            ),
        confirmReceipt: () =>
            act(() => escrowBoxRepository.confirmReceipt(id, data.expected_version)),
        openDispute: (reason, description) =>
            act(() =>
                escrowBoxRepository.openDispute(id, {
                    expected_version: data.expected_version,
                    reason,
                    description,
                }),
            ),
    };
}

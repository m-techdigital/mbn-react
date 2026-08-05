import { useCallback, useEffect, useState } from "react";
import { escrowBoxRepository } from "../../services/repositories/marketplace";
export function useEscrowBoxDetail(id) {
    const [data, setData] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [uploading, setUploading] = useState(false); const [progress, setProgress] = useState(0);
    const load = useCallback(async () => { setLoading(true); setError(""); try { setData(await escrowBoxRepository.show(id)); } catch (e) { setError(e?.response?.data?.message || e.message); } finally { setLoading(false); } }, [id]);
    useEffect(() => { load(); }, [load]);
    const act = async (fn) => { setLoading(true); setError(""); try { setData(await fn()); } catch (e) { setError(e?.response?.data?.message || e.message); } finally { setLoading(false); } };
    const confirm = () => act(() => escrowBoxRepository.confirm(id, data.expected_version));
    const cancel = () => act(() => escrowBoxRepository.cancel(id, data.expected_version));
    const upload = async (files, stepId) => { setUploading(true); setProgress(0); try { setData(await escrowBoxRepository.uploadMedia(id, files, stepId, setProgress)); } finally { setUploading(false); } };
    const submitHandover = (side, note) => act(() => escrowBoxRepository.submitHandover(id, side, { expected_version: data.expected_version, note }));
    const confirmReceipt = () => act(() => escrowBoxRepository.confirmReceipt(id, data.expected_version));
    const openDispute = (reason, description) => act(() => escrowBoxRepository.openDispute(id, { expected_version: data.expected_version, reason, description }));
    return { data, loading, error, uploading, progress, reload: load, confirm, cancel, upload, submitHandover, confirmReceipt, openDispute };
}

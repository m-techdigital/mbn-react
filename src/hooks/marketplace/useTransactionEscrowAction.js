import { useState } from "react";

const supportedActions = new Set(["seller_handover", "buyer_receive"]);

export function useTransactionEscrowAction(runAction) {
    const [state, setState] = useState({ open: false, action: "", note: "" });

    const request = (action) => {
        if (!supportedActions.has(action)) return false;
        setState({ open: true, action, note: "" });
        return true;
    };

    const close = () => setState({ open: false, action: "", note: "" });
    const setNote = (note) => setState((current) => ({ ...current, note }));
    const submit = async () => {
        if (state.action === "seller_handover" && !state.note.trim()) return false;
        const succeeded = await runAction(state.action, state.note.trim());
        if (succeeded) close();
        return succeeded;
    };

    return { ...state, request, close, setNote, submit };
}

import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { escrowBoxRepository } from "../../services/repositories/marketplace";

const asset = () => ({ type: "game_account", title: "", description: "", reference_value: "", delivery_method: "email_transfer" });
const initial = { deal_type: "exchange", party_a_asset: asset(), party_b_asset: asset(), topup_payer_side: "party_b", topup_amount: "", fee_payer_mode: "party_b", inspection_period_minutes: 60, success_conditions: "", cancellation_conditions: "", additional_terms: "", expires_in_hours: 72 };
export function useEscrowBoxForm() {
    const navigate = useNavigate();
    const [data, setData] = useState(initial); const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [created, setCreated] = useState(null);
    const update = (name, value) => setData((current) => ({ ...current, [name]: value }));
    const updateAsset = (side, name, value) => setData((current) => ({ ...current, [side]: { ...current[side], [name]: value } }));
    const payload = useMemo(() => ({ ...data, topup_amount: data.deal_type === "exchange_with_topup" ? Number(data.topup_amount || 0) : 0, inspection_period_minutes: Number(data.inspection_period_minutes), expires_in_hours: Number(data.expires_in_hours), party_a_asset: { ...data.party_a_asset, reference_value: Number(data.party_a_asset.reference_value || 0) }, party_b_asset: { ...data.party_b_asset, reference_value: Number(data.party_b_asset.reference_value || 0) } }), [data]);
    const submit = async (event) => { event.preventDefault(); setLoading(true); setError(""); try { const response = await escrowBoxRepository.create(payload); setCreated(response); } catch (e) { setError(e?.response?.data?.message || e.message || "Không thể tạo box."); } finally { setLoading(false); } };
    const openBox = () => created?.box?.id && navigate(`/account/escrow-boxes/${created.box.id}`);
    return { data, loading, error, created, update, updateAsset, submit, openBox };
}

const createAsset = () => ({
    type: "game_account",
    title: "",
    description: "",
    reference_value: "",
    delivery_method: "email_transfer",
});

export const createEscrowBoxValues = () => ({
    deal_type: "exchange",
    party_a_asset: createAsset(),
    party_b_asset: createAsset(),
    topup_payer_side: "party_b",
    topup_amount: "",
    fee_payer_mode: "party_b",
    inspection_period_minutes: 60,
    success_conditions: "",
    cancellation_conditions: "",
    additional_terms: "",
    expires_in_hours: 72,
});

export const escrowBoxValuesFromRecord = (box) => ({
    expected_version: box.expected_version,
    deal_type: box.deal_type,
    party_a_asset: {
        ...createAsset(),
        ...(box.agreement_terms?.party_a_asset || {}),
    },
    party_b_asset: {
        ...createAsset(),
        ...(box.agreement_terms?.party_b_asset || {}),
    },
    topup_payer_side: box.topup_payer_side || "party_b",
    topup_amount:
        box.deal_type === "exchange_with_topup"
            ? box.topup_amount || ""
            : "",
    fee_payer_mode: box.fee_payer_mode || "party_b",
    inspection_period_minutes: box.inspection_period_minutes || 60,
    success_conditions: box.agreement_terms?.success_conditions || "",
    cancellation_conditions:
        box.agreement_terms?.cancellation_conditions || "",
    additional_terms: box.agreement_terms?.additional_terms || "",
    change_note: "",
});

export const buildEscrowBoxPayload = (
    values,
    { includeExpiry = false } = {},
) => {
    const {
        topup_amount: topupAmount,
        topup_payer_side: topupPayerSide,
        expires_in_hours: expiresInHours,
        ...base
    } = values;

    return {
        ...base,
        ...(values.deal_type === "exchange_with_topup"
            ? {
                  topup_amount: Number(topupAmount || 0),
                  topup_payer_side: topupPayerSide,
              }
            : {}),
        ...(includeExpiry
            ? { expires_in_hours: Number(expiresInHours || 72) }
            : {}),
        inspection_period_minutes: Number(values.inspection_period_minutes),
        party_a_asset: {
            ...values.party_a_asset,
            reference_value: Number(
                values.party_a_asset?.reference_value || 0,
            ),
        },
        party_b_asset: {
            ...values.party_b_asset,
            reference_value: Number(
                values.party_b_asset?.reference_value || 0,
            ),
        },
    };
};

export const validateEscrowBoxValues = (values) => {
    const errors = {};
    const required = (field, value) => {
        if (!String(value ?? "").trim()) {
            errors[field] = "Vui lòng nhập thông tin này.";
        }
    };

    required("party_a_asset.title", values.party_a_asset?.title);
    required("party_a_asset.description", values.party_a_asset?.description);
    required("party_b_asset.title", values.party_b_asset?.title);
    required("party_b_asset.description", values.party_b_asset?.description);
    required("success_conditions", values.success_conditions);

    if (
        values.deal_type === "exchange_with_topup" &&
        Number(values.topup_amount || 0) < 1000
    ) {
        errors.topup_amount = "Số tiền bù phải tối thiểu 1.000 đ.";
    }

    const inspectionMinutes = Number(values.inspection_period_minutes || 0);
    if (inspectionMinutes < 15 || inspectionMinutes > 1440) {
        errors.inspection_period_minutes =
            "Thời gian kiểm tra phải từ 15 đến 1.440 phút.";
    }

    return errors;
};

const FIELD_LABELS = {
    name: "Tên khách hàng",
    username: "Tên đăng nhập",
    login: "Tài khoản",
    email: "Địa chỉ thư điện tử",
    phone: "Số điện thoại",
    password: "Mật khẩu",
    password_confirmation: "Nhập lại mật khẩu",
    current_password: "Mật khẩu hiện tại",
    avatar: "Ảnh đại diện",
    avatar_url: "Ảnh đại diện",
    amount: "Số tiền",
    payment_method: "Phương thức thanh toán",
    proof: "Ảnh biên nhận",
    external_reference: "Mã giao dịch ngân hàng",
    title: "Tiêu đề",
    description: "Mô tả",
    product_id: "Sản phẩm",
    offer_modes: "Hình thức giao dịch",
    sale_price: "Giá bán",
    rental_price: "Giá thuê",
    bank_code: "Mã ngân hàng",
    bank_name: "Tên ngân hàng",
    account_name: "Tên chủ tài khoản",
    account_number: "Số tài khoản",
    payout_account_id: "Tài khoản nhận tiền",
    reason: "Lý do",
    transaction_id: "Giao dịch",
    code: "Mã xác thực",
    deal_type: "Loại giao dịch",
    topup_amount: "Số tiền bù",
    topup_payer_side: "Bên bù tiền",
    fee_payer_mode: "Bên chịu phí",
    inspection_period_minutes: "Thời gian kiểm tra",
    success_conditions: "Điều kiện thành công",
    cancellation_conditions: "Điều kiện hủy",
    additional_terms: "Điều khoản bổ sung",
    "party_a_asset.title": "Tên tài sản Bên A",
    "party_a_asset.description": "Mô tả tài sản Bên A",
    "party_a_asset.type": "Loại tài sản Bên A",
    "party_a_asset.delivery_method": "Phương thức bàn giao Bên A",
    "party_a_asset.reference_value": "Giá trị tham chiếu Bên A",
    "party_b_asset.title": "Tên tài sản Bên B",
    "party_b_asset.description": "Mô tả tài sản Bên B",
    "party_b_asset.type": "Loại tài sản Bên B",
    "party_b_asset.delivery_method": "Phương thức bàn giao Bên B",
    "party_b_asset.reference_value": "Giá trị tham chiếu Bên B",
};

const RULE_TRANSLATIONS = [
    [/required/i, "Vui lòng nhập :field."],
    [/must be a valid email/i, ":field chưa đúng định dạng."],
    [/has already been taken/i, ":field đã được sử dụng."],
    [/must be at least (\d+)/i, ":field phải có ít nhất $1 ký tự."],
    [/must not be greater than (\d+)/i, ":field không được vượt quá $1 ký tự."],
    [/confirmation does not match/i, ":field chưa khớp."],
    [/must be a number|must be numeric/i, ":field phải là số hợp lệ."],
    [/must be an image/i, ":field phải là tệp ảnh hợp lệ."],
    [/failed to upload/i, "Không thể tải :field lên."],
];

const cleanKey = (key = "") =>
    String(key)
        .replace(/\.\d+(?=\.|$)/g, "")
        .replace(/^data\./, "");
export const fieldLabel = (key) =>
    FIELD_LABELS[cleanKey(key)] ||
    cleanKey(key).split(".").pop().replaceAll("_", " ");

export function translateValidationMessage(message, key = "") {
    let text = String(message || "").trim();
    const normalizedKey = cleanKey(key);
    const minimum = text.match(/must be at least (\d+)/i);
    if (normalizedKey === "topup_amount" && minimum) {
        return `Số tiền bù phải tối thiểu ${Number(minimum[1]).toLocaleString("vi-VN")} đ.`;
    }
    if (normalizedKey === "inspection_period_minutes" && minimum) {
        return `Thời gian kiểm tra phải tối thiểu ${Number(minimum[1]).toLocaleString("vi-VN")} phút.`;
    }
    if (!text) return `Thông tin ${fieldLabel(key)} chưa hợp lệ.`;
    for (const [pattern, replacement] of RULE_TRANSLATIONS) {
        if (pattern.test(text))
            return replacement
                .replace(":field", fieldLabel(key).toLowerCase())
                .replace(/^./, (c) => c.toUpperCase());
    }
    return text;
}

export function normalizeValidationErrors(source = {}) {
    const result = {};
    Object.entries(source || {}).forEach(([rawKey, rawValue]) => {
        const key = cleanKey(rawKey);
        const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
        const message = translateValidationMessage(value, key);
        if (!result[key]) result[key] = message;
        const root = key.split(".")[0];
        if (!result[root]) result[root] = message;
    });
    return result;
}

export function validationErrorsFrom(error) {
    return normalizeValidationErrors(
        error?.validationErrors || error?.response?.data?.errors || {},
    );
}

export function applyValidationError(error, setErrors, fallbackMessage) {
    const errors = validationErrorsFrom(error);
    setErrors?.(errors);
    return {
        errors,
        message:
            fallbackMessage ||
            "Thông tin nhập vào chưa hợp lệ. Vui lòng kiểm tra các trường được đánh dấu.",
    };
}

export function clearFieldError(setErrors, field) {
    setErrors?.((current) => {
        if (!current?.[field]) return current || {};
        const next = { ...current };
        delete next[field];
        return next;
    });
}

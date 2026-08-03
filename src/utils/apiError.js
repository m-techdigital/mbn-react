export function normalizeApiError(
    error,
    fallback = "Không thể thực hiện yêu cầu.",
) {
    const payload = error?.response?.data || {};
    const errors = payload.errors || {};
    const firstFieldMessage = Object.values(errors).flat().find(Boolean);
    const requestId =
        payload.meta?.request_id || error?.response?.headers?.["x-request-id"];
    return {
        message:
            firstFieldMessage ||
            payload.message ||
            payload.status?.message ||
            error?.message ||
            fallback,
        fieldErrors: errors,
        requestId,
        correlationId:
            payload.meta?.correlation_id ||
            error?.response?.headers?.["x-correlation-id"],
        errorCode: payload.error_code || null,
    };
}

export function supportMessage(error, fallback) {
    const normalized = normalizeApiError(error, fallback);
    return normalized.requestId
        ? `${normalized.message} Mã hỗ trợ: ${normalized.requestId}`
        : normalized.message;
}

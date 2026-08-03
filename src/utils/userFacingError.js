const TECHNICAL_PATTERNS = [
    /the route .* could not be found/i,
    /api\/v\d+/i,
    /sqlstate/i,
    /exception/i,
    /stack trace/i,
    /network error/i,
    /failed to fetch/i,
    /timeout of \d+ms exceeded/i,
    /status code \d+/i,
];

const FRIENDLY_BY_STATUS = {
    400: "Yêu cầu chưa hợp lệ. Vui lòng kiểm tra lại thông tin.",
    401: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
    403: "Bạn chưa được phép thực hiện thao tác này.",
    404: "Nội dung hoặc dịch vụ này hiện chưa sẵn sàng.",
    409: "Dữ liệu đã thay đổi. Vui lòng tải lại trang và thử lại.",
    422: "Thông tin nhập vào chưa hợp lệ. Vui lòng kiểm tra các trường được đánh dấu.",
    429: "Bạn thao tác quá nhanh. Vui lòng chờ một lát rồi thử lại.",
    500: "Hệ thống đang gặp sự cố tạm thời. Vui lòng thử lại sau.",
    502: "Máy chủ đang tạm gián đoạn. Vui lòng thử lại sau.",
    503: "Dịch vụ đang được bảo trì hoặc chưa sẵn sàng.",
};

const containsTechnicalText = (value = "") =>
    TECHNICAL_PATTERNS.some((pattern) => pattern.test(String(value)));

const TRANSLATED_MESSAGES = [
    [/invalid credentials/i, "Tên đăng nhập hoặc mật khẩu không đúng."],
    [/unauthenticated/i, "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."],
    [
        /refresh token expired/i,
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
    ],
    [
        /not found/i,
        "Nội dung bạn tìm kiếm hiện không tồn tại hoặc chưa sẵn sàng.",
    ],
    [
        /too many requests/i,
        "Bạn thao tác quá nhanh. Vui lòng chờ một lát rồi thử lại.",
    ],
];

const translateKnownMessage = (value = "") => {
    const text = String(value);
    const match = TRANSLATED_MESSAGES.find(([pattern]) => pattern.test(text));
    return match ? match[1] : text;
};

export function getUserFacingError(
    error,
    fallback = "Không thể xử lý yêu cầu lúc này. Vui lòng thử lại sau.",
) {
    const status = Number(error?.response?.status || error?.status || 0);
    const validationMessage = Object.values(
        error?.validationErrors || error?.response?.data?.errors || {},
    )
        .flat()
        .find(Boolean);
    if (validationMessage && !containsTechnicalText(validationMessage))
        return translateKnownMessage(validationMessage);

    const candidates = [
        error?.userMessage,
        error?.response?.data?.status?.message,
        error?.response?.data?.message,
    ].filter(Boolean);

    const safeCandidate = candidates.find(
        (message) => !containsTechnicalText(message),
    );
    if (safeCandidate) return translateKnownMessage(safeCandidate);
    return FRIENDLY_BY_STATUS[status] || fallback;
}

export function getSupportCode(error) {
    return (
        error?.requestId ||
        error?.correlationId ||
        error?.response?.headers?.["x-request-id"] ||
        null
    );
}

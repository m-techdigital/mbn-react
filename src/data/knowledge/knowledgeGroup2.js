import { commonWarnings } from "../knowledgeShared";

export const knowledgePages = {
    "/guides/huong-dan-dang-ban-cho-thue": {
            title: "Hướng dẫn đăng bán hoặc cho thuê nick",
            category: "Dành cho người bán",
            summary:
                "Chuẩn bị thông tin, hình ảnh, giá và điều kiện giao dịch minh bạch.",
            checklist: [
                "Xác minh quyền sở hữu",
                "Ảnh chụp mới nhất",
                "Mô tả trung thực",
                "Giá và phí",
                "Điều kiện bàn giao",
            ],
            sections: [
                {
                    title: "Xác minh và điều kiện nhà phát hành",
                    body: [
                        "Chỉ đăng tài khoản mà bạn có quyền sử dụng hợp pháp.",
                        "Kiểm tra điều khoản của nhà phát hành vì một số trò chơi hạn chế hoặc cấm chuyển nhượng tài khoản.",
                    ],
                },
                {
                    title: "Thông tin tin đăng",
                    body: [
                        "Cung cấp đúng máy chủ, cấp độ, vật phẩm, lịch sử vi phạm và tình trạng liên kết email/số điện thoại.",
                        "Không dùng ảnh cũ, ảnh của người khác hoặc che giấu thông tin ảnh hưởng quyết định của người mua.",
                    ],
                },
                {
                    title: "Bán và cho thuê",
                    body: [
                        "Tin bán cần nêu cách bàn giao và khả năng thay đổi thông tin đăng ký.",
                        "Tin cho thuê cần nêu phạm vi sử dụng, thời gian, cọc, hạn hoàn trả và hành vi bị cấm.",
                    ],
                },
            ],
            warnings: commonWarnings,
        },
    "/policies/tranh-chap-khieu-nai": {
            title: "Giải quyết tranh chấp và khiếu nại",
            category: "An toàn & pháp lý",
            summary:
                "Quy trình tiếp nhận, bảo toàn bằng chứng, tạm giữ giao dịch và đưa ra phương án xử lý.",
            lastReviewed: "29/07/2026",
            scopeNote:
                "Quy trình nội bộ đề xuất; thời hạn chính thức cần được đơn vị vận hành công bố trước production.",
            quickFacts: [
                {
                    label: "Kênh tiếp nhận",
                    value: "Trung tâm hỗ trợ và mã giao dịch",
                },
                {
                    label: "Phản hồi ban đầu",
                    value: "Mục tiêu trong 24 giờ làm việc",
                },
                {
                    label: "Bổ sung bằng chứng",
                    value: "Theo thời hạn ghi trong yêu cầu hỗ trợ",
                },
                {
                    label: "Trạng thái tiền",
                    value: "Có thể tạm giữ trong thời gian xác minh",
                },
            ],
            process: [
                {
                    title: "Tiếp nhận và phân loại",
                    description:
                        "Kiểm tra mã giao dịch, loại sự cố, mức độ khẩn cấp và nguy cơ mất bằng chứng.",
                },
                {
                    title: "Bảo toàn giao dịch",
                    description:
                        "Tạm dừng giải ngân, hoàn cọc hoặc xác nhận hoàn tất khi có căn cứ.",
                },
                {
                    title: "Thu thập hai chiều",
                    description:
                        "Yêu cầu mỗi bên cung cấp bằng chứng độc lập trong thời hạn rõ ràng.",
                },
                {
                    title: "Đối chiếu",
                    description:
                        "So sánh tin đăng, điều khoản, nhật ký hệ thống, thanh toán và bàn giao.",
                },
                {
                    title: "Kết luận và lưu hồ sơ",
                    description:
                        "Thông báo phương án, căn cứ, số tiền điều chỉnh và quyền yêu cầu xem xét lại.",
                },
            ],
            requiredEvidence: [
                "Mã giao dịch và thời điểm phát sinh.",
                "Ảnh/video liên tục, không cắt ghép ở bước bàn giao.",
                "Biên nhận thanh toán.",
                "Thông báo hệ thống hoặc nhà phát hành.",
                "Lịch sử trao đổi qua kênh chính thức.",
            ],
            checklist: [
                "Mã giao dịch",
                "Mô tả sự việc",
                "Ảnh/video bằng chứng",
                "Mốc thời gian",
                "Yêu cầu xử lý",
            ],
            sections: [
                {
                    title: "Bước 1 — Mở yêu cầu",
                    body: [
                        "Gửi mã giao dịch, nội dung tranh chấp và bằng chứng qua kênh hỗ trợ chính thức.",
                        "Không tiếp tục thay đổi mật khẩu, vật phẩm hoặc trạng thái tài khoản nếu việc đó có thể làm mất bằng chứng.",
                    ],
                },
                {
                    title: "Bước 2 — Tạm giữ xử lý",
                    body: [
                        "Hệ thống có thể tạm dừng giải ngân, hoàn cọc hoặc xác nhận hoàn tất trong thời gian kiểm tra.",
                        "Hai bên được yêu cầu cung cấp thông tin trong thời hạn cụ thể.",
                    ],
                },
                {
                    title: "Bước 3 — Đối chiếu và phương án",
                    body: [
                        "Đối chiếu tin đăng, điều khoản tại thời điểm giao dịch, lịch sử thanh toán và bằng chứng bàn giao.",
                        "Phương án có thể gồm tiếp tục bàn giao, hoàn một phần, hoàn toàn bộ, khấu trừ có căn cứ hoặc chuyển cơ quan có thẩm quyền.",
                    ],
                },
                {
                    title: "Bước 4 — Khiếu nại tiếp",
                    body: [
                        "Nếu không đồng ý, khách hàng có thể yêu cầu xem xét lại và cung cấp bằng chứng bổ sung.",
                        "Tranh chấp không giải quyết được bằng thương lượng có thể được xử lý theo cơ chế hòa giải, trọng tài hoặc tòa án phù hợp.",
                    ],
                },
            ],
            warnings: [
                "Không công khai thông tin cá nhân nhạy cảm lên mạng xã hội.",
                ...commonWarnings,
            ],
        },
    "/policies/hoan-tien-huy-giao-dich": {
            title: "Hoàn tiền và hủy giao dịch",
            category: "An toàn & pháp lý",
            summary:
                "Các trường hợp có thể hủy, thời điểm khóa giao dịch và nguyên tắc hoàn tiền.",
            sections: [
                {
                    title: "Trước khi thanh toán",
                    body: [
                        "Khách hàng có thể rời giao dịch khi chưa xác nhận hoặc chưa phát sinh thanh toán.",
                    ],
                },
                {
                    title: "Sau khi thanh toán, chưa bàn giao",
                    body: [
                        "Yêu cầu hủy được xem xét theo trạng thái và nguyên nhân.",
                        "Phí thanh toán thực tế hoặc phí dịch vụ chỉ được khấu trừ nếu đã công bố rõ trước giao dịch.",
                    ],
                },
                {
                    title: "Sau khi bàn giao",
                    body: [
                        "Không áp dụng hoàn tiền tự động nếu khách hàng đã nhận và sử dụng tài khoản.",
                        "Trường hợp sai mô tả, không thể đăng nhập, bị thu hồi hoặc vi phạm cam kết cần được xử lý theo quy trình tranh chấp.",
                    ],
                },
                {
                    title: "Thời gian hoàn tiền",
                    body: [
                        "Thời gian phụ thuộc phương thức thanh toán và đối soát.",
                        "Trạng thái, số tiền và lý do điều chỉnh phải xuất hiện trong lịch sử ví hoặc giao dịch.",
                    ],
                },
            ],
            warnings: commonWarnings,
        }
};

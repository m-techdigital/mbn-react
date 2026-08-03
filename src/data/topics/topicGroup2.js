import { article, bullets, section, sources, steps, table } from "./topicContentHelpers.js";

export const topicGroup2 = [
    {
            id: 5,
            slug: "huong-dan-dang-ban-cho-thue-nick",
            category: "Người bán",
            reading_time: "9 phút",
            updated_at: "29/07/2026",
            title: "Cách đăng bán hoặc cho thuê nick minh bạch, giảm tranh chấp",
            excerpt:
                "Chuẩn hóa ảnh, mô tả, quyền sở hữu, giá, phí, điều kiện bàn giao và phạm vi thuê.",
            content: article({
                intro: "<p>Tin đăng tốt không chỉ giúp bán nhanh hơn mà còn là căn cứ chính khi giải quyết tranh chấp. Mọi thông tin ảnh hưởng đến quyết định mua phải được nêu rõ.</p>",
                checklist: [
                    "Có quyền kiểm soát hợp pháp",
                    "Ảnh/video mới nhất",
                    "Không che lịch sử khóa/phạt",
                    "Tách giá, phí và cọc",
                    "Nêu rõ khả năng đổi bảo mật",
                ],
                toc: [
                    ["ownership", "1. Xác minh quyền kiểm soát"],
                    ["photos", "2. Ảnh và bằng chứng"],
                    ["description", "3. Mô tả bắt buộc"],
                    ["price", "4. Giá và điều kiện"],
                    ["handover", "5. Bàn giao"],
                ],
                sections: [
                    section(
                        "ownership",
                        "1. Chỉ đăng tài khoản bạn có quyền kiểm soát",
                        "<p>Không đăng tài khoản đang tranh chấp, tài khoản mượn, tài khoản bị chiếm quyền hoặc tài khoản có nguồn gốc không rõ ràng. Kiểm tra điều khoản nhà phát hành vì một số dịch vụ không cho phép chuyển nhượng.</p>",
                    ),
                    section(
                        "photos",
                        "2. Ảnh và video",
                        bullets([
                            "Chụp trực tiếp từ tài khoản tại thời điểm gần ngày đăng.",
                            "Che dữ liệu nhạy cảm nhưng không che thông tin ảnh hưởng giá trị.",
                            "Không dùng ảnh của người khác hoặc ảnh đã chỉnh sửa làm sai lệch vật phẩm.",
                            "Lưu video hiện trạng để đối chiếu khi bàn giao.",
                        ]),
                    ),
                    section(
                        "description",
                        "3. Nội dung bắt buộc trong tin đăng",
                        `${table([
                            ["Nhận dạng", "Game, máy chủ, mã nick, cấp độ"],
                            [
                                "Tài sản",
                                "Trang bị, vật phẩm, tiền tệ, nội dung có thời hạn",
                            ],
                            [
                                "Bảo mật",
                                "Email/điện thoại/mạng xã hội và khả năng thay đổi",
                            ],
                            [
                                "Rủi ro",
                                "Lịch sử khóa/phạt, hạn chế hoặc khiếu nại đang tồn tại",
                            ],
                        ])}`,
                    ),
                    section(
                        "price",
                        "4. Giá, phí và điều kiện",
                        "<p>Tách rõ giá bán/giá thuê, phí dịch vụ, tiền cọc, giảm giá, thời hạn thuê hoặc lịch trả góp. Không dùng mức giá mồi rồi yêu cầu trả thêm ngoài hệ thống.</p>",
                    ),
                    section(
                        "handover",
                        "5. Bàn giao và hỗ trợ sau giao dịch",
                        "<p>Thỏa thuận kênh bàn giao, thời hạn phản hồi, bằng chứng cần cung cấp và cách xử lý nếu tài khoản không đúng mô tả hoặc bị thu hồi.</p>",
                    ),
                ],
                warning:
                    "MBN cần có cơ chế kiểm duyệt tin đăng, tiếp nhận báo cáo và khóa tin khi có dấu hiệu gian lận hoặc vi phạm điều khoản nhà phát hành.",
                sources: [
                    [
                        "Bộ Công Thương — thông tin hàng hóa/dịch vụ phải tránh gây hiểu nhầm",
                        sources.eCommerce,
                    ],
                    ["Hệ thống quản lý TMĐT", sources.onlineGov],
                ],
            }),
        },
    {
            id: 6,
            slug: "quy-trinh-khieu-nai-tranh-chap",
            category: "Tranh chấp",
            reading_time: "9 phút",
            updated_at: "29/07/2026",
            title: "Khiếu nại và tranh chấp: chuẩn bị bằng chứng để được xử lý nhanh",
            excerpt:
                "Quy trình mở yêu cầu, bảo toàn tài khoản, thu thập bằng chứng, tạm giữ thanh toán và xem xét lại kết quả.",
            content: article({
                intro: "<p>Tranh chấp tài khoản số thường khó xác minh nếu các bên tiếp tục đổi mật khẩu, chuyển vật phẩm hoặc xóa lịch sử. Việc đầu tiên là bảo toàn trạng thái và bằng chứng.</p>",
                checklist: [
                    "Mã giao dịch",
                    "Diễn biến sự việc theo thời gian",
                    "Video bàn giao",
                    "Biên nhận thanh toán",
                    "Ảnh lỗi/thông báo nhà phát hành",
                ],
                toc: [
                    ["urgent", "1. Việc cần làm ngay"],
                    ["submit", "2. Gửi khiếu nại"],
                    ["review", "3. Quy trình xác minh"],
                    ["outcome", "4. Kết quả có thể có"],
                    ["appeal", "5. Xem xét lại"],
                ],
                sections: [
                    section(
                        "urgent",
                        "1. Dừng thao tác có thể làm mất bằng chứng",
                        bullets([
                            "Không tiếp tục chuyển tiền.",
                            "Không xóa trò chuyện hoặc nhật ký giao dịch.",
                            "Không chuyển vật phẩm hay đổi thông tin nếu không cần thiết để bảo vệ tài khoản.",
                            "Chụp URL, mã đơn, thời gian và thông báo lỗi.",
                        ]),
                    ),
                    section(
                        "submit",
                        "2. Hồ sơ khiếu nại tối thiểu",
                        `${table([
                            ["Mã giao dịch", "Để liên kết nhật ký hệ thống"],
                            ["Mô tả", "Sự việc theo thứ tự thời gian"],
                            ["Bằng chứng", "Ảnh/video gốc, không cắt ghép"],
                            [
                                "Yêu cầu",
                                "Hoàn tiền, tiếp tục bàn giao, bồi hoàn hoặc hỗ trợ kỹ thuật",
                            ],
                        ])}`,
                    ),
                    section(
                        "review",
                        "3. Xác minh hai chiều",
                        "<p>MBN nên tạm dừng xác nhận hoàn tất hoặc giải phóng cọc khi có căn cứ. Cả hai bên được yêu cầu cung cấp bằng chứng trong thời hạn rõ ràng. Kết luận phải đối chiếu tin đăng, điều khoản đã chấp thuận, lịch sử thanh toán và nhật ký bàn giao.</p>",
                    ),
                    section(
                        "outcome",
                        "4. Các phương án xử lý",
                        bullets([
                            "Tiếp tục bàn giao hoặc khắc phục trong thời hạn.",
                            "Hoàn một phần hoặc toàn bộ.",
                            "Khấu trừ cọc/chi phí có căn cứ.",
                            "Từ chối yêu cầu khi không có bằng chứng hoặc vi phạm thuộc về người yêu cầu.",
                            "Chuyển cơ quan có thẩm quyền khi có dấu hiệu chiếm đoạt hoặc tội phạm.",
                        ]),
                    ),
                    section(
                        "appeal",
                        "5. Yêu cầu xem xét lại",
                        "<p>Người dùng có thể gửi bằng chứng mới hoặc chỉ ra điểm chưa được xem xét. Quy trình cần giới hạn thời gian, số lần và người chịu trách nhiệm phê duyệt.</p>",
                    ),
                ],
                warning:
                    "Không công khai CCCD, số điện thoại, tài khoản ngân hàng hoặc thông tin đăng nhập của bên còn lại lên mạng xã hội.",
                sources: [
                    [
                        "Luật Bảo vệ quyền lợi người tiêu dùng 2023",
                        sources.consumerLaw,
                    ],
                    ["Nghị định 55/2024/NĐ-CP", sources.consumerDecree],
                ],
            }),
        },
    {
            id: 7,
            slug: "hoan-tien-huy-giao-dich-nick",
            category: "Hoàn tiền",
            reading_time: "7 phút",
            updated_at: "29/07/2026",
            title: "Hoàn tiền và hủy giao dịch nick theo từng trạng thái",
            excerpt:
                "Phân biệt hủy trước thanh toán, sau thanh toán, sau bàn giao và trường hợp tài khoản sai mô tả hoặc bị thu hồi.",
            content: article({
                intro: "<p>Không thể áp dụng một câu “đã mua không hoàn tiền” cho mọi trường hợp. Cách xử lý phụ thuộc trạng thái thanh toán, bàn giao, mức sử dụng và nguyên nhân lỗi.</p>",
                checklist: [
                    "Trạng thái giao dịch",
                    "Ai gây ra việc hủy",
                    "Tài khoản đã bàn giao/sử dụng chưa",
                    "Chi phí thực tế đã phát sinh",
                    "Điều khoản đã hiển thị trước xác nhận",
                ],
                toc: [
                    ["before", "1. Trước thanh toán"],
                    ["paid", "2. Đã thanh toán, chưa bàn giao"],
                    ["handover", "3. Sau bàn giao"],
                    ["mismatch", "4. Sai mô tả hoặc bị thu hồi"],
                    ["time", "5. Thời gian hoàn"],
                ],
                sections: [
                    section(
                        "before",
                        "1. Trước thanh toán",
                        "<p>Người dùng có thể rời giao dịch khi chưa phát sinh nghĩa vụ. Tin giữ chỗ hoặc cọc cần xử lý theo điều kiện riêng.</p>",
                    ),
                    section(
                        "paid",
                        "2. Đã thanh toán nhưng chưa bàn giao",
                        "<p>Yêu cầu hủy được xem xét theo nguyên nhân. Phí chỉ được khấu trừ khi đã công bố rõ, thực sự phát sinh và phù hợp với giao dịch.</p>",
                    ),
                    section(
                        "handover",
                        "3. Sau bàn giao",
                        "<p>Cần kiểm tra người mua đã sử dụng tài khoản, đổi bảo mật hoặc làm thay đổi tài sản hay chưa. Không hoàn tự động nhưng vẫn phải xử lý nếu có sai mô tả, không thể đăng nhập hoặc vi phạm cam kết.</p>",
                    ),
                    section(
                        "mismatch",
                        "4. Sai mô tả, khóa hoặc thu hồi",
                        "<p>Mở tranh chấp, bảo toàn bằng chứng và xác định nguyên nhân. Nếu lỗi tồn tại trước bàn giao hoặc thuộc trách nhiệm người bán, phương án có thể gồm khắc phục, đổi tài khoản hoặc hoàn tiền.</p>",
                    ),
                    section(
                        "time",
                        "5. Thời gian hoàn tiền",
                        "<p>Thời gian phụ thuộc kênh thanh toán và đối soát. Mỗi khoản hoàn phải có mã, số tiền, lý do, trạng thái và ngày dự kiến hoàn tất.</p>",
                    ),
                ],
                warning:
                    "Chính sách hoàn tiền chính thức cần công bố thời hạn, phương thức và đầu mối hỗ trợ trước khi phát hành.",
                sources: [
                    [
                        "Luật Bảo vệ quyền lợi người tiêu dùng 2023",
                        sources.consumerLaw,
                    ],
                ],
            }),
        },
    {
            id: 8,
            slug: "canh-bao-gia-mao-ho-tro",
            category: "Bảo mật",
            reading_time: "8 phút",
            updated_at: "29/07/2026",
            title: "Nhận diện giả mạo hỗ trợ, QR lạ và yêu cầu cung cấp OTP",
            excerpt:
                "Dấu hiệu lừa đảo phổ biến, cách kiểm tra kênh chính thức và việc cần làm ngay nếu đã chuyển tiền hoặc lộ thông tin.",
            content: article({
                intro: "<p>Kẻ gian thường tạo áp lực thời gian, gửi QR/số tài khoản riêng, yêu cầu cài ứng dụng điều khiển từ xa hoặc xin OTP với lý do “xác minh giao dịch”.</p>",
                checklist: [
                    "Kiểm tra tên miền",
                    "Đối chiếu mã giao dịch",
                    "Không gửi OTP/mã khôi phục",
                    "Không cài app điều khiển từ xa",
                    "Dừng ngay khi bị thúc ép",
                ],
                toc: [
                    ["signs", "1. Dấu hiệu giả mạo"],
                    ["never", "2. Thông tin không bao giờ cung cấp"],
                    ["qr", "3. QR và chuyển khoản"],
                    ["lost", "4. Nếu đã bị lừa"],
                    ["report", "5. Báo cáo"],
                ],
                sections: [
                    section(
                        "signs",
                        "1. Dấu hiệu cảnh báo",
                        bullets([
                            "Tài khoản mạng xã hội mới tạo hoặc tên gần giống kênh chính thức.",
                            "Yêu cầu chuyển vào tài khoản cá nhân khác với đơn hàng.",
                            "Hứa hoàn tiền/khuyến mại nếu cung cấp OTP.",
                            "Yêu cầu cài AnyDesk, TeamViewer hoặc ứng dụng ngoài kho chính thức.",
                            "Dọa khóa tài khoản nếu không xử lý ngay.",
                        ]),
                    ),
                    section(
                        "never",
                        "2. Không cung cấp",
                        bullets([
                            "OTP ngân hàng hoặc OTP đăng nhập.",
                            "Mật khẩu email, mã dự phòng 2FA, mã khôi phục.",
                            "Cookie, token đăng nhập, ảnh QR đăng nhập.",
                            "Mã PIN ngân hàng, số CVV hoặc quyền điều khiển thiết bị.",
                        ]),
                    ),
                    section(
                        "qr",
                        "3. Kiểm tra QR và người nhận",
                        "<p>Chỉ quét QR sinh từ đúng trang giao dịch/nạp tiền. Đối chiếu tên người nhận, ngân hàng, số tiền và nội dung. Nếu một chi tiết khác với đơn, dừng thanh toán và liên hệ hỗ trợ từ website.</p>",
                    ),
                    section(
                        "lost",
                        "4. Nếu đã chuyển tiền hoặc lộ thông tin",
                        steps([
                            {
                                title: "Dừng liên lạc và không gửi thêm tiền",
                                body: "Kẻ gian thường yêu cầu thêm phí để “mở khóa” hoặc “hoàn tiền”.",
                            },
                            {
                                title: "Liên hệ ngân hàng ngay",
                                body: "Báo giao dịch gian lận và yêu cầu hỗ trợ tra soát/ngăn chặn.",
                            },
                            {
                                title: "Đổi mật khẩu và thu hồi phiên",
                                body: "Ưu tiên email, ngân hàng và tài khoản game liên quan.",
                            },
                            {
                                title: "Lưu bằng chứng và trình báo",
                                body: "Lưu số tài khoản, nội dung chat, URL, biên nhận và gửi cơ quan công an khi cần.",
                            },
                        ]),
                    ),
                    section(
                        "report",
                        "5. Báo cáo cho MBN",
                        "<p>Gửi URL/tài khoản giả mạo, ảnh hội thoại và mã giao dịch. MBN cần cảnh báo cộng đồng, khóa liên kết độc hại và phối hợp xác minh.</p>",
                    ),
                ],
                warning:
                    "Nhân viên hỗ trợ hợp lệ không cần OTP, mật khẩu email hoặc quyền điều khiển thiết bị để kiểm tra đơn hàng.",
                sources: [
                    [
                        "Nhân Dân — phải làm gì khi bị lừa đảo trực tuyến",
                        sources.scamResponse,
                    ],
                ],
            }),
        }
];

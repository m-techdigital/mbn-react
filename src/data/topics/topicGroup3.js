import { article, bullets, section, sources, steps, table } from "./topicContentHelpers.js";

export const topicGroup3 = [
    {
            id: 9,
            slug: "thanh-toan-qr-va-doi-soat",
            category: "Thanh toán",
            reading_time: "6 phút",
            updated_at: "29/07/2026",
            title: "Thanh toán QR và đối soát: tránh chuyển sai, chuyển trùng",
            excerpt:
                "Cách kiểm tra người nhận, nội dung chuyển khoản, trạng thái đối soát và xử lý khi tiền chưa được ghi nhận.",
            content: article({
                intro: "<p>Thanh toán QR thuận tiện nhưng dễ sai nếu dùng ảnh QR cũ, QR do người lạ gửi hoặc nhập sai nội dung. Mỗi giao dịch phải có mã đối soát riêng.</p>",
                checklist: [
                    "QR từ đúng đơn",
                    "Tên người nhận khớp",
                    "Đúng số tiền",
                    "Đúng nội dung",
                    "Không chuyển lại khi chưa tra soát",
                ],
                toc: [
                    ["verify", "1. Trước chuyển tiền"],
                    ["status", "2. Sau chuyển tiền"],
                    ["missing", "3. Chưa ghi nhận"],
                    ["duplicate", "4. Chuyển trùng"],
                    ["refund", "5. Hoàn tiền"],
                ],
                sections: [
                    section(
                        "verify",
                        "1. Kiểm tra trước khi xác nhận",
                        table([
                            ["Nguồn QR", "Trang giao dịch/nạp tiền chính thức"],
                            ["Người nhận", "Khớp thông tin hiển thị trong đơn"],
                            ["Số tiền", "Không tự làm tròn hoặc chia nhỏ"],
                            ["Nội dung", "Đúng mã đối soát, không thêm ký tự"],
                        ]),
                    ),
                    section(
                        "status",
                        "2. Theo dõi trạng thái",
                        "<p>Giữ màn hình biên nhận đến khi hệ thống ghi nhận. Trạng thái nên phân biệt: chờ đối soát, thành công, cần xác minh, hoàn tiền hoặc thất bại.</p>",
                    ),
                    section(
                        "missing",
                        "3. Tiền đã trừ nhưng hệ thống chưa ghi nhận",
                        "<p>Không chuyển lần hai. Gửi mã đơn, thời gian, ngân hàng, số tiền và ảnh biên nhận qua kênh hỗ trợ. Chờ kết quả tra soát.</p>",
                    ),
                    section(
                        "duplicate",
                        "4. Chuyển trùng hoặc sai số tiền",
                        "<p>Mở yêu cầu điều chỉnh. Không yêu cầu người dùng chuyển thêm để “cân số” khi chưa xác minh giao dịch đầu.</p>",
                    ),
                    section(
                        "refund",
                        "5. Hoàn tiền",
                        "<p>Khoản hoàn cần có mã, số tiền, phương thức nhận và thời gian dự kiến. Không gửi OTP hoặc mã xác thực để nhận hoàn tiền.</p>",
                    ),
                ],
                warning:
                    "Không đăng công khai ảnh biên nhận đầy đủ nếu ảnh chứa số tài khoản, số dư hoặc dữ liệu cá nhân.",
                sources: [
                    [
                        "Luật Bảo vệ quyền lợi người tiêu dùng 2023",
                        sources.consumerLaw,
                    ],
                ],
            }),
        },
    {
            id: 10,
            slug: "rui-ro-dieu-khoan-nha-phat-hanh",
            category: "Nhà phát hành",
            reading_time: "7 phút",
            updated_at: "29/07/2026",
            title: "Rủi ro từ điều khoản nhà phát hành khi mua, bán hoặc thuê tài khoản game",
            excerpt:
                "Vì sao giao dịch giữa người dùng không đồng nghĩa nhà phát hành công nhận quyền chuyển nhượng hoặc chia sẻ tài khoản.",
            content: article({
                intro: "<p>Tài khoản game thường được cấp quyền sử dụng theo điều khoản dịch vụ, không nhất thiết là tài sản có thể tự do chuyển nhượng. Nhà phát hành có thể khóa, thu hồi hoặc giới hạn hỗ trợ khi phát hiện chia sẻ/mua bán.</p>",
                checklist: [
                    "Đọc điều khoản game cụ thể",
                    "Kiểm tra quy định giải đấu",
                    "Không cam kết “an toàn 100%”",
                    "Công bố rủi ro khóa/thu hồi",
                    "Không bán đơn vị ảo trái điều khoản",
                ],
                toc: [
                    [
                        "license",
                        "1. Quyền sử dụng không phải quyền sở hữu tuyệt đối",
                    ],
                    ["sharing", "2. Chia sẻ tài khoản"],
                    ["virtual", "3. Vật phẩm và đơn vị ảo"],
                    ["support", "4. Hỗ trợ khôi phục"],
                    ["platform", "5. Trách nhiệm MBN"],
                ],
                sections: [
                    section(
                        "license",
                        "1. Tài khoản có thể chỉ là quyền sử dụng",
                        "<p>Điều khoản dịch vụ có thể quy định tài khoản, vật phẩm hoặc đơn vị ảo chỉ được sử dụng trong hệ sinh thái của nhà phát hành và không được quy đổi/chuyển nhượng ngoài trò chơi.</p>",
                    ),
                    section(
                        "sharing",
                        "2. Chia sẻ, cho thuê và giải đấu",
                        "<p>Một số quy định giải đấu xử phạt việc dùng tài khoản của người khác hoặc cho người khác sử dụng. Tài khoản tham gia giải đấu cần được đánh dấu rủi ro đặc biệt.</p>",
                    ),
                    section(
                        "virtual",
                        "3. Vật phẩm và tiền tệ ảo",
                        "<p>Không mô tả vật phẩm ảo như tiền mặt được bảo đảm quy đổi. Cần nêu trạng thái khóa, hạn sử dụng và khả năng nhà phát hành điều chỉnh.</p>",
                    ),
                    section(
                        "support",
                        "4. Khôi phục tài khoản",
                        "<p>Nhà phát hành có thể chỉ hỗ trợ chủ đăng ký ban đầu. Người mua có thể mất quyền kiểm soát nếu bên bán dùng thông tin gốc để khôi phục.</p>",
                    ),
                    section(
                        "platform",
                        "5. MBN cần làm gì?",
                        bullets([
                            "Hiển thị cảnh báo theo từng game.",
                            "Không bảo đảm nhà phát hành công nhận giao dịch.",
                            "Cho phép báo cáo tin vi phạm.",
                            "Tạm dừng game/danh mục khi điều khoản cấm rõ ràng hoặc rủi ro quá cao.",
                        ]),
                    ),
                ],
                warning:
                    "Trước phát hành, cần rà từng game cụ thể và quyết định game nào được phép xuất hiện trên marketplace.",
                sources: [
                    ["Garena — ví dụ điều khoản về đơn vị ảo", sources.garenaTerms],
                    [
                        "Garena Liên Quân — ví dụ xử phạt chia sẻ tài khoản trong thi đấu",
                        sources.garenaSharing,
                    ],
                ],
            }),
        },
    {
            id: 11,
            slug: "bao-ve-du-lieu-ca-nhan-khi-giao-dich",
            category: "Dữ liệu cá nhân",
            reading_time: "7 phút",
            updated_at: "29/07/2026",
            title: "Bảo vệ dữ liệu cá nhân khi xác minh và bàn giao tài khoản",
            excerpt:
                "Chỉ thu thập dữ liệu cần thiết, che thông tin nhạy cảm và không lưu mật khẩu/OTP trong lịch sử hỗ trợ.",
            content: article({
                intro: "<p>Giao dịch tài khoản dễ kéo theo email, số điện thoại, thông tin thanh toán và ảnh giấy tờ. Nền tảng phải giới hạn dữ liệu thu thập theo đúng mục đích.</p>",
                checklist: [
                    "Không lưu mật khẩu/OTP",
                    "Che dữ liệu trên ảnh",
                    "Xác định mục đích thu thập",
                    "Giới hạn người truy cập",
                    "Có thời hạn lưu và xóa",
                ],
                toc: [
                    ["minimum", "1. Thu thập tối thiểu"],
                    ["mask", "2. Che dữ liệu"],
                    ["access", "3. Quyền truy cập"],
                    ["retention", "4. Lưu trữ"],
                    ["incident", "5. Sự cố dữ liệu"],
                ],
                sections: [
                    section(
                        "minimum",
                        "1. Chỉ thu thập dữ liệu cần thiết",
                        "<p>Không yêu cầu CCCD hoặc dữ liệu tài chính nếu không có mục đích xác minh rõ ràng. Không thu OTP, mật khẩu email hoặc mã khôi phục.</p>",
                    ),
                    section(
                        "mask",
                        "2. Che thông tin trong bằng chứng",
                        "<p>Ảnh biên nhận nên che số dư và phần số tài khoản không cần thiết. Ảnh tài khoản game phải che email/số điện thoại đầy đủ trên trang công khai.</p>",
                    ),
                    section(
                        "access",
                        "3. Giới hạn quyền truy cập",
                        "<p>Chỉ nhân sự xử lý giao dịch/tranh chấp liên quan mới được xem dữ liệu. Mọi truy cập và tải xuống nên có nhật ký.</p>",
                    ),
                    section(
                        "retention",
                        "4. Thời hạn lưu",
                        "<p>Định nghĩa thời hạn lưu theo loại dữ liệu và mục đích. Khi hết thời hạn hoặc không còn cần thiết, dữ liệu phải được xóa/ẩn danh theo chính sách.</p>",
                    ),
                    section(
                        "incident",
                        "5. Khi có sự cố",
                        "<p>Khóa quyền truy cập, bảo toàn log, đánh giá phạm vi ảnh hưởng và thông báo theo quy trình pháp lý/nội bộ áp dụng.</p>",
                    ),
                ],
                warning:
                    "Chính sách dữ liệu cá nhân cần được rà soát độc lập trước production và phải khớp với hạ tầng lưu trữ thực tế.",
                sources: [
                    [
                        "Garena — ví dụ chính sách bảo mật dịch vụ số",
                        "https://cdn.garena.vn/web/ddt/legal/pp.html",
                    ],
                ],
            }),
        },
    {
            id: 12,
            slug: "faq-mua-ban-thue-nick",
            category: "FAQ",
            reading_time: "6 phút",
            updated_at: "29/07/2026",
            title: "Câu hỏi thường gặp về mua, bán, thuê, trả góp và đặt cọc nick",
            excerpt:
                "Giải đáp nhanh các tình huống phổ biến trước và sau giao dịch.",
            content: article({
                intro: "<p>Đây là phần trả lời nhanh. Khi thông tin tại đây khác với đơn giao dịch cụ thể, nội dung đã được người dùng xác nhận trong đơn sẽ được ưu tiên, trừ trường hợp trái quy định pháp luật.</p>",
                checklist: [],
                toc: [
                    ["buy", "Mua tài khoản"],
                    ["rent", "Thuê tài khoản"],
                    ["payment", "Thanh toán"],
                    ["dispute", "Tranh chấp"],
                    ["security", "Bảo mật"],
                ],
                sections: [
                    section(
                        "buy",
                        "Mua tài khoản",
                        "<h3>Có nên đổi toàn bộ thông tin ngay?</h3><p>Chỉ đổi trong phạm vi nhà phát hành và giao dịch cho phép. Quay video quá trình đổi và giữ thông tin bàn giao.</p><h3>Nếu nick không đúng ảnh?</h3><p>Dừng xác nhận, giữ nguyên trạng thái và mở tranh chấp kèm video.</p>",
                    ),
                    section(
                        "rent",
                        "Thuê tài khoản",
                        "<h3>Cọc có tự động hoàn không?</h3><p>Chỉ sau đối soát hoàn trả. Khoản khấu trừ phải có lý do và bằng chứng.</p><h3>Có được cho bạn bè dùng?</h3><p>Không, trừ khi điều kiện thuê ghi rõ. Việc chia sẻ làm tăng rủi ro khóa và tranh chấp.</p>",
                    ),
                    section(
                        "payment",
                        "Thanh toán",
                        "<h3>Chuyển tiền rồi chưa thấy cộng?</h3><p>Không chuyển lại. Gửi biên nhận và mã đơn để tra soát.</p><h3>Quản trị viên yêu cầu OTP để hoàn tiền?</h3><p>Đó là dấu hiệu lừa đảo. Không cung cấp OTP trong mọi trường hợp.</p>",
                    ),
                    section(
                        "dispute",
                        "Tranh chấp",
                        "<h3>Cần video không?</h3><p>Video liên tục là bằng chứng tốt nhất cho bàn giao và kiểm tra vật phẩm.</p><h3>MBN có bảo đảm 100% không?</h3><p>Không. MBN hỗ trợ quy trình và đối soát nhưng không thể thay thế điều khoản nhà phát hành hoặc cơ quan có thẩm quyền.</p>",
                    ),
                    section(
                        "security",
                        "Bảo mật",
                        "<h3>Có nên gửi ảnh CCCD?</h3><p>Chỉ khi có mục đích xác minh hợp pháp, chính sách rõ ràng và kênh bảo mật. Không gửi qua tài khoản mạng xã hội không xác minh.</p>",
                    ),
                ],
                warning:
                    "FAQ không thay thế điều khoản giao dịch, chính sách pháp lý hoặc hướng dẫn chính thức của nhà phát hành.",
                sources: [
                    ["Trung tâm quản lý TMĐT — Bộ Công Thương", sources.onlineGov],
                ],
            }),
        },
    {
            id: 13,
            slug: "mien-tru-trach-nhiem-va-phan-bo-rui-ro",
            category: "Điều khoản",
            reading_time: "10 phút",
            updated_at: "29/07/2026",
            title: "Miễn trừ trách nhiệm, phân bổ rủi ro và thay đổi quy định",
            excerpt:
                "Phân biệt rõ rủi ro do người chơi, bên giao dịch, nhà phát hành, nền tảng, pháp luật và sự kiện ngoài khả năng kiểm soát.",
            content: article({
                intro: "<p>Miễn trừ trách nhiệm không có nghĩa nền tảng hoặc một bên được phủi bỏ mọi nghĩa vụ. Mục tiêu đúng là phân bổ rủi ro theo nguyên nhân, khả năng kiểm soát, bằng chứng và giới hạn pháp luật.</p>",
                checklist: [
                    "Xác định nguyên nhân sự cố",
                    "Kiểm tra phiên bản điều khoản",
                    "Không chấp nhận miễn trừ tuyệt đối",
                    "Lưu thông báo nhà phát hành",
                    "Ghi nhận phương án khi pháp luật thay đổi",
                ],
                toc: [
                    ["player", "1. Rủi ro do người chơi"],
                    ["seller", "2. Rủi ro do bên bán/cho thuê"],
                    ["publisher", "3. Rủi ro nhà phát hành"],
                    ["platform", "4. Trách nhiệm nền tảng"],
                    ["law", "5. Thay đổi pháp luật"],
                    ["force", "6. Bất khả kháng"],
                    ["amend", "7. Sửa đổi điều khoản"],
                ],
                sections: [
                    section(
                        "player",
                        "1. Rủi ro do người chơi",
                        bullets([
                            "Người mua/thuê chịu trách nhiệm với hành vi sau bàn giao như gian lận, chia sẻ tài khoản, chuyển vật phẩm, làm lộ thông tin xác thực hoặc sử dụng quá phạm vi.",
                            "Không chuyển trách nhiệm sang người dùng nếu thiệt hại bắt nguồn từ mô tả sai, che giấu thông tin hoặc thu hồi trái cam kết của bên bán/cho thuê.",
                            "Mỗi sự cố cần được đối chiếu bằng nhật ký, video, trạng thái bảo mật và mốc bàn giao.",
                        ]),
                    ),
                    section(
                        "seller",
                        "2. Rủi ro do bên bán hoặc cho thuê",
                        bullets([
                            "Phải có quyền kiểm soát hợp pháp và công bố nguồn gốc, liên kết, lịch sử khóa/phạt đã biết.",
                            "Không được tự ý thu hồi, đổi mật khẩu hoặc can thiệp khi giao dịch đang hợp lệ.",
                            "Chịu trách nhiệm khi thông tin sai, che giấu rủi ro hoặc vi phạm cam kết bàn giao.",
                        ]),
                    ),
                    section(
                        "publisher",
                        "3. Rủi ro từ nhà phát hành",
                        `${bullets(["Tài khoản và vật phẩm có thể chỉ là quyền sử dụng, không phải tài sản được tự do chuyển nhượng.", "Nhà phát hành có thể khóa, thu hồi, đổi máy chủ, điều chỉnh vật phẩm hoặc cấm chia sẻ/cho thuê.", "MBN không thể buộc nhà phát hành công nhận giao dịch hoặc khôi phục tài khoản."])}<p>Với trò chơi có quy định cấm rõ ràng, nền tảng cần tạm dừng hoặc giới hạn danh mục thay vì chỉ gắn cảnh báo chung.</p>`,
                    ),
                    section(
                        "platform",
                        "4. Trách nhiệm và giới hạn của nền tảng",
                        `${bullets(["MBN chịu trách nhiệm với phần dịch vụ trực tiếp cung cấp: ghi nhận giao dịch, lưu dấu vết, đối soát và hỗ trợ theo quy trình công bố.", "MBN không chịu trách nhiệm thay cho quyết định độc lập của nhà phát hành, lỗi trò chơi hoặc mất giá trị vật phẩm ngoài khả năng kiểm soát hợp lý.", "Miễn trừ không áp dụng cho gian dối, lỗi cố ý, lỗi nghiêm trọng, vi phạm bảo mật/dữ liệu hoặc nghĩa vụ pháp luật không cho phép loại trừ."])}`,
                    ),
                    section(
                        "law",
                        "5. Khi pháp luật hoặc yêu cầu quản lý thay đổi",
                        steps([
                            {
                                title: "Đánh giá phạm vi ảnh hưởng",
                                body: "Xác định game, giao dịch, thanh toán và tài liệu nào bị tác động.",
                            },
                            {
                                title: "Tạm dừng khi cần",
                                body: "Ngăn giao dịch mới hoặc bàn giao nếu tiếp tục có nguy cơ vi phạm.",
                            },
                            {
                                title: "Thông báo cho các bên",
                                body: "Nêu lý do, căn cứ, trạng thái tiền/tài sản và lựa chọn xử lý.",
                            },
                            {
                                title: "Đối soát công bằng",
                                body: "Tiếp tục có điều chỉnh, hoàn tiền, hoàn cọc hoặc chấm dứt theo trạng thái thực tế và quy định bắt buộc.",
                            },
                        ]),
                    ),
                    section(
                        "force",
                        "6. Bất khả kháng và gián đoạn dịch vụ",
                        "<p>Có thể gồm thiên tai, dịch bệnh, mất điện/viễn thông diện rộng, tấn công mạng, gián đoạn ngân hàng, sự cố nhà phát hành hoặc quyết định cơ quan nhà nước. Bên bị ảnh hưởng phải thông báo sớm, cung cấp bằng chứng hợp lý và giảm thiểu thiệt hại. Nghĩa vụ bảo mật không tự động chấm dứt.</p>",
                    ),
                    section(
                        "amend",
                        "7. Sửa đổi điều khoản",
                        `${table([
                            [
                                "Yêu cầu",
                                "Có số phiên bản, ngày hiệu lực và nội dung thay đổi",
                            ],
                            [
                                "Giao dịch cũ",
                                "Áp dụng phiên bản đã xác nhận tại thời điểm tạo giao dịch",
                            ],
                            [
                                "Thay đổi bất lợi",
                                "Không áp dụng hồi tố nếu chưa có đồng ý hợp lệ, trừ yêu cầu bắt buộc",
                            ],
                            [
                                "Giao dịch đang thực hiện",
                                "Phải có phương án tiếp tục, điều chỉnh, tạm dừng, hoàn tiền/đối soát hoặc chấm dứt",
                            ],
                        ])}`,
                    ),
                ],
                warning:
                    "Không dùng câu “MBN không chịu trách nhiệm trong mọi trường hợp”. Điều khoản loại trừ tuyệt đối có thể xung đột với quyền bắt buộc của người tiêu dùng và trách nhiệm do lỗi của chính nền tảng.",
                sources: [
                    [
                        "Luật Bảo vệ quyền lợi người tiêu dùng 2023",
                        sources.consumerLaw,
                    ],
                    [
                        "Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân",
                        sources.personalData,
                    ],
                    [
                        "Garena — cảnh báo chia sẻ tài khoản và xử phạt",
                        sources.garenaSharing,
                    ],
                ],
            }),
        }
];

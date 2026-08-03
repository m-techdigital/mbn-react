import { article, bullets, section, sources, steps, table } from "./topicContentHelpers.js";

export const topicGroup1 = [
    {
            id: 1,
            slug: "huong-dan-kiem-tra-nick-truoc-khi-mua",
            category: "Mua tài khoản an toàn",
            reading_time: "10 phút",
            updated_at: "29/07/2026",
            title: "Hướng dẫn kiểm tra nick trước khi mua: từ tin đăng đến bàn giao",
            excerpt:
                "Danh sách kiểm tra chi tiết để kiểm tra máy chủ, vật phẩm, liên kết bảo mật, lịch sử vi phạm và bằng chứng trước khi xác nhận giao dịch.",
            content: article({
                intro: "<p>Mục tiêu của bước kiểm tra không phải là “xem nick có đẹp hay không”, mà là xác định tài khoản có đúng mô tả, có thể bàn giao an toàn và có rủi ro bị thu hồi hay khóa sau giao dịch hay không.</p>",
                checklist: [
                    "Đúng mã nick, game và máy chủ",
                    "Ảnh/video mới, không che thông tin quan trọng",
                    "Thông tin liên kết và khả năng đổi bảo mật rõ ràng",
                    "Giá, phí, tiền cọc và tổng thanh toán khớp",
                    "Có video bàn giao liên tục và mã giao dịch",
                ],
                toc: [
                    ["listing", "1. Kiểm tra tin đăng"],
                    ["security", "2. Kiểm tra quyền kiểm soát và bảo mật"],
                    ["value", "3. Kiểm tra tài sản trong game"],
                    ["handover", "4. Quy trình bàn giao"],
                    ["after", "5. Việc cần làm sau khi nhận"],
                ],
                sections: [
                    section(
                        "listing",
                        "1. Kiểm tra tin đăng trước khi trả tiền",
                        `${table([
                            [
                                "Mã tin đăng",
                                "Phải trùng với mã hiển thị trong đơn hàng",
                            ],
                            [
                                "Loại giao dịch",
                                "Mua đứt, thuê, đặt cọc hay trả góp",
                            ],
                            [
                                "Giá trị thanh toán",
                                "Tách rõ giá nick, phí dịch vụ, cọc và giảm giá",
                            ],
                            [
                                "Điều kiện bàn giao",
                                "Nêu rõ đổi được email/số điện thoại hay chỉ bàn giao quyền truy cập",
                            ],
                        ])}<p>Không nên dựa duy nhất vào ảnh đại diện. Hãy mở toàn bộ ảnh chi tiết, đối chiếu mô tả, máy chủ, cấp độ, vật phẩm, lịch sử khóa/phạt và thời điểm chụp.</p>`,
                    ),
                    section(
                        "security",
                        "2. Kiểm tra quyền kiểm soát và liên kết bảo mật",
                        `${bullets(["Tài khoản đang liên kết email, số điện thoại, mạng xã hội hoặc tài khoản nhà phát hành nào.", "Bên bán có quyền thay đổi hoặc gỡ liên kết hay không; thời gian chờ nếu nhà phát hành áp dụng.", "Có phiên đăng nhập lạ, thiết bị tin cậy hoặc mã dự phòng 2FA chưa được thu hồi hay không.", "Không yêu cầu hoặc gửi OTP, mật khẩu email, cookie đăng nhập và mã khôi phục qua tin nhắn."])}<p>Tài khoản không thể đổi thông tin bảo mật cần được ghi rõ là tài khoản có rủi ro thu hồi cao hơn. Người mua phải cân nhắc trước khi xác nhận.</p>`,
                    ),
                    section(
                        "value",
                        "3. Kiểm tra vật phẩm và giá trị trong game",
                        `${bullets(["Quay video đăng nhập và mở các mục quan trọng thay vì chỉ chụp màn hình tĩnh.", "Đối chiếu tên nhân vật, máy chủ, cấp độ, trang bị, tiền tệ, kho đồ và lịch sử giao dịch nếu có.", "Kiểm tra vật phẩm có thời hạn, vật phẩm khóa, tài sản không thể chuyển hoặc nội dung chỉ hiển thị ở một chế độ chơi.", "Ghi nhận các hạn chế từ nhà phát hành: chia sẻ, chuyển nhượng hoặc mua bán tài khoản có thể bị cấm hoặc bị xử phạt."])}`,
                    ),
                    section(
                        "handover",
                        "4. Bàn giao có bằng chứng",
                        steps([
                            {
                                title: "Mở đúng đơn giao dịch",
                                body: "Chỉ dùng QR, số tài khoản và nội dung chuyển khoản hiển thị trong đơn.",
                            },
                            {
                                title: "Bắt đầu quay màn hình",
                                body: "Quay liên tục từ lúc nhận thông tin đến khi đăng nhập và kiểm tra xong.",
                            },
                            {
                                title: "Đổi thông tin trong phạm vi cho phép",
                                body: "Không đổi hoặc gỡ liên kết nếu nhà phát hành hay điều kiện giao dịch không cho phép.",
                            },
                            {
                                title: "Xác nhận hoặc mở tranh chấp",
                                body: "Chỉ xác nhận hoàn tất khi thông tin khớp; nếu sai lệch hãy dừng thao tác và gửi bằng chứng.",
                            },
                        ]),
                    ),
                    section(
                        "after",
                        "5. Sau khi nhận tài khoản",
                        `${bullets(["Đăng xuất toàn bộ phiên lạ và kiểm tra thiết bị tin cậy.", "Bật lớp bảo vệ bổ sung nếu nhà phát hành hỗ trợ.", "Không chia sẻ lại tài khoản cho người khác trong thời gian bảo hành hoặc xác minh.", "Lưu biên nhận, mã đơn, video bàn giao và nội dung trao đổi trong thời gian chính sách yêu cầu."])}`,
                    ),
                ],
                warning:
                    "Một số nhà phát hành hạn chế hoặc cấm chuyển nhượng/chia sẻ tài khoản. MBN không thể bảo đảm nhà phát hành sẽ công nhận giao dịch giữa người dùng.",
                sources: [
                    [
                        "Bộ Công Thương — yêu cầu thông tin hàng hóa/dịch vụ rõ ràng",
                        sources.eCommerce,
                    ],
                    [
                        "Garena — ví dụ điều khoản về đơn vị ảo và dịch vụ",
                        sources.garenaTerms,
                    ],
                ],
            }),
        },
    {
            id: 2,
            slug: "quy-trinh-thue-va-hoan-tra-tai-khoan",
            category: "Thuê tài khoản",
            reading_time: "9 phút",
            updated_at: "29/07/2026",
            title: "Quy trình thuê nick, gia hạn và hoàn trả tài khoản",
            excerpt:
                "Cách xác lập thời gian thuê, tiền cọc, hiện trạng bàn giao, phạm vi sử dụng và đối soát khi hoàn trả.",
            content: article({
                intro: "<p>Thuê tài khoản khác mua nick ở chỗ quyền kiểm soát chỉ được cấp trong một thời gian và phạm vi nhất định. Mọi hành vi ngoài phạm vi đó có thể gây thiệt hại trực tiếp cho chủ tài khoản.</p>",
                checklist: [
                    "Thời điểm bắt đầu/kết thúc theo múi giờ rõ ràng",
                    "Giá thuê và tiền cọc tách riêng",
                    "Biên bản hiện trạng trước thuê",
                    "Danh sách hành vi bị cấm",
                    "Quy trình hoàn trả và giải phóng cọc",
                ],
                toc: [
                    ["before", "1. Trước khi thuê"],
                    ["during", "2. Trong thời gian thuê"],
                    ["extend", "3. Gia hạn"],
                    ["return", "4. Hoàn trả"],
                    ["deposit", "5. Xử lý tiền cọc"],
                ],
                sections: [
                    section(
                        "before",
                        "1. Thiết lập điều kiện trước khi bàn giao",
                        `${table([
                            [
                                "Thời gian thuê",
                                "Ghi ngày, giờ bắt đầu/kết thúc và múi giờ",
                            ],
                            ["Giá thuê", "Tổng giá hoặc đơn giá/ngày, tuần"],
                            ["Tiền cọc", "Mục đích, điều kiện giải phóng/khấu trừ"],
                            [
                                "Phạm vi sử dụng",
                                "Chơi game, cày sự kiện, xếp hạng hoặc mục đích cụ thể",
                            ],
                        ])}<p>Hai bên cần lưu ảnh/video hiện trạng, số lượng vật phẩm, tiền tệ, trạng thái khóa/phạt và danh sách thiết bị đăng nhập.</p>`,
                    ),
                    section(
                        "during",
                        "2. Trong thời gian thuê",
                        `${bullets(["Không đổi mật khẩu, email, số điện thoại hoặc liên kết mạng xã hội.", "Không chuyển vật phẩm, bán tài sản, xóa nhân vật hoặc sử dụng phần mềm gian lận.", "Không chia sẻ tài khoản cho bên thứ ba hoặc cho thuê lại.", "Báo ngay khi có đăng nhập lạ, khóa tài khoản, lỗi bảo mật hoặc gián đoạn bất thường."])}`,
                    ),
                    section(
                        "extend",
                        "3. Gia hạn thuê",
                        "<p>Yêu cầu gia hạn phải được gửi và xác nhận trước khi hết hạn. Giá gia hạn, tiền cọc bổ sung và giờ kết thúc mới phải hiển thị trong giao dịch. Không mặc định gia hạn chỉ vì người thuê tiếp tục sử dụng.</p>",
                    ),
                    section(
                        "return",
                        "4. Hoàn trả đúng quy trình",
                        steps([
                            {
                                title: "Dừng sử dụng trước hạn",
                                body: "Không phát sinh thao tác mới trong lúc chờ đối soát.",
                            },
                            {
                                title: "Đăng xuất thiết bị",
                                body: "Gỡ phiên đăng nhập trên thiết bị thuê và bàn giao lại theo kênh chính thức.",
                            },
                            {
                                title: "Đối chiếu hiện trạng",
                                body: "So sánh vật phẩm, tiền tệ, trạng thái nhân vật và lịch sử khóa/phạt.",
                            },
                            {
                                title: "Xác nhận hoàn trả",
                                body: "Hai bên xác nhận tình trạng và khoản cọc được hoàn hoặc khấu trừ.",
                            },
                        ]),
                    ),
                    section(
                        "deposit",
                        "5. Tiền cọc và thiệt hại",
                        "<p>Mọi khoản khấu trừ cọc cần có căn cứ: bằng chứng trước/sau, giá trị thiệt hại hợp lý và nội dung điều khoản đã được chấp thuận. Không nên tự động mất toàn bộ cọc khi chưa xác định nguyên nhân và mức thiệt hại.</p>",
                    ),
                ],
                warning:
                    "Tài khoản dùng cho giải đấu hoặc chương trình đặc biệt có thể có quy định nghiêm ngặt về chia sẻ và cho thuê. Cần kiểm tra điều lệ game/giải đấu trước khi đăng tin.",
                sources: [
                    [
                        "Garena — ví dụ quy định xử phạt chia sẻ tài khoản trong giải đấu",
                        sources.garenaSharing,
                    ],
                ],
            }),
        },
    {
            id: 3,
            slug: "huong-dan-mua-nick-tra-gop",
            category: "Trả góp",
            reading_time: "8 phút",
            updated_at: "29/07/2026",
            title: "Mua tài khoản trả góp: lịch thanh toán, bàn giao và xử lý quá hạn",
            excerpt:
                "Hiểu giá trả góp, khoản đầu tiên, lịch đến hạn, điều kiện bàn giao và quyền lợi khi giao dịch thay đổi.",
            content: article({
                intro: "<p>Trả góp là giao dịch có nhiều mốc thanh toán. Người mua cần nhìn thấy toàn bộ giá, số kỳ, lịch đến hạn, điều kiện bàn giao và hậu quả quá hạn trước khi bấm xác nhận.</p>",
                checklist: [
                    "So sánh giá mua thẳng và giá trả góp",
                    "Biết tổng số tiền cuối cùng",
                    "Lịch thanh toán từng kỳ",
                    "Điều kiện nhận tài khoản",
                    "Quy tắc hủy, hoàn và quá hạn",
                ],
                toc: [
                    ["plan", "1. Kế hoạch thanh toán"],
                    ["handover", "2. Điều kiện bàn giao"],
                    ["payment", "3. Thanh toán từng kỳ"],
                    ["late", "4. Quá hạn và gia hạn"],
                    ["cancel", "5. Hủy giao dịch"],
                ],
                sections: [
                    section(
                        "plan",
                        "1. Kế hoạch trả góp phải hiển thị rõ",
                        `${table([
                            ["Giá mua thẳng", "Giá nếu thanh toán một lần"],
                            ["Tổng giá trả góp", "Tổng nghĩa vụ của tất cả kỳ"],
                            ["Khoản đầu tiên", "Số tiền để kích hoạt giao dịch"],
                            ["Lịch kỳ", "Ngày đến hạn và số tiền từng kỳ"],
                            ["Phí phát sinh", "Chỉ áp dụng nếu được công bố trước"],
                        ])}`,
                    ),
                    section(
                        "handover",
                        "2. Khi nào được bàn giao tài khoản?",
                        "<p>MBN có thể áp dụng bàn giao sau khi thanh toán đủ hoặc bàn giao có kiểm soát. Nếu bàn giao trước, người mua không được bán lại, cho thuê, gỡ bảo mật hoặc thực hiện hành vi làm giảm giá trị tài khoản cho đến khi hoàn tất nghĩa vụ.</p>",
                    ),
                    section(
                        "payment",
                        "3. Ghi nhận từng lần thanh toán",
                        `${bullets(["Mỗi lần thanh toán cần có mã giao dịch và biên nhận.", "Số tiền còn lại phải được cập nhật sau đối soát.", "Không chuyển tiền theo thông tin gửi riêng ngoài hệ thống.", "Nếu thanh toán chưa được ghi nhận, không chuyển lại lần hai trước khi được xác minh."])}`,
                    ),
                    section(
                        "late",
                        "4. Quá hạn và gia hạn",
                        "<p>Hệ thống nên nhắc hạn trước ngày thanh toán. Gia hạn chỉ có hiệu lực khi hai bên xác nhận thời hạn mới và chi phí liên quan. Không áp dụng khoản phạt hoặc khấu trừ chưa được hiển thị trước khi người dùng chấp thuận.</p>",
                    ),
                    section(
                        "cancel",
                        "5. Hủy trả góp",
                        "<p>Khi hủy, cần xác định: tài khoản đã bàn giao hay chưa, người mua đã sử dụng đến mức nào, chi phí thực tế đã phát sinh và điều khoản hoàn/khấu trừ đã được công bố. Mọi kết quả phải được ghi vào lịch sử giao dịch.</p>",
                    ),
                ],
                warning:
                    "Không nên dùng cụm “mất toàn bộ tiền đã trả” như một điều khoản mặc định. Việc hoàn hoặc khấu trừ phải dựa trên điều kiện đã công bố, nguyên nhân hủy và thiệt hại có thể chứng minh.",
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
            id: 4,
            slug: "quy-dinh-dat-coc-giu-nick",
            category: "Đặt cọc",
            reading_time: "7 phút",
            updated_at: "29/07/2026",
            title: "Đặt cọc giữ nick: thời hạn, hủy giao dịch và hoàn cọc",
            excerpt:
                "Quy tắc giữ chỗ, số tiền còn lại, gia hạn và cách xử lý khi một bên không thể tiếp tục giao dịch.",
            content: article({
                intro: "<p>Đặt cọc dùng để giữ một tài khoản trong thời hạn nhất định. Giao dịch cần nêu rõ cọc có được trừ vào giá mua hay không, thời gian giữ, số tiền còn lại và các trường hợp hoàn/khấu trừ.</p>",
                checklist: [
                    "Mức cọc và tổng giá",
                    "Thời gian giữ nick",
                    "Hạn thanh toán phần còn lại",
                    "Điều kiện hoàn cọc",
                    "Điều kiện khấu trừ có bằng chứng",
                ],
                toc: [
                    ["effect", "1. Hiệu lực giữ chỗ"],
                    ["seller", "2. Nghĩa vụ người bán"],
                    ["buyer", "3. Nghĩa vụ người mua"],
                    ["cancel", "4. Hủy và hoàn cọc"],
                    ["extend", "5. Gia hạn"],
                ],
                sections: [
                    section(
                        "effect",
                        "1. Khi nào cọc có hiệu lực?",
                        "<p>Cọc chỉ có hiệu lực sau khi hệ thống đối soát thành công. Tin đăng chuyển sang trạng thái giữ chỗ và không nên tiếp nhận giao dịch mới trong khoảng thời gian đã cam kết.</p>",
                    ),
                    section(
                        "seller",
                        "2. Nghĩa vụ người bán",
                        bullets([
                            "Giữ nguyên tài khoản và giá đã chấp thuận.",
                            "Không bán, cho thuê hoặc chuyển tài sản trong tài khoản cho bên khác.",
                            "Thông báo ngay nếu tài khoản bị khóa, mất quyền kiểm soát hoặc không thể bàn giao.",
                        ]),
                    ),
                    section(
                        "buyer",
                        "3. Nghĩa vụ người mua",
                        bullets([
                            "Thanh toán phần còn lại đúng hạn.",
                            "Không yêu cầu thay đổi tài khoản ngoài nội dung giao dịch.",
                            "Thông báo sớm nếu cần gia hạn hoặc không thể tiếp tục.",
                        ]),
                    ),
                    section(
                        "cancel",
                        "4. Hủy và hoàn cọc",
                        "<p>Nếu người bán không thể bàn giao đúng mô tả, giao dịch nên được hoàn cọc và xử lý chi phí theo quy định công bố. Nếu người mua tự hủy hoặc quá hạn, khoản khấu trừ phải bám theo điều khoản đã xác nhận, chi phí thực tế và bằng chứng.</p>",
                    ),
                    section(
                        "extend",
                        "5. Gia hạn giữ chỗ",
                        "<p>Gia hạn cần ghi nhận thời hạn mới, khoản bổ sung (nếu có) và xác nhận của hai bên. Không tự động kéo dài thời hạn mà không thông báo.</p>",
                    ),
                ],
                warning:
                    "Nội dung đặt cọc nên được luật sư rà soát trước phát hành vì hậu quả pháp lý phụ thuộc bản chất giao dịch và thỏa thuận cụ thể.",
                sources: [
                    [
                        "Luật Bảo vệ quyền lợi người tiêu dùng 2023",
                        sources.consumerLaw,
                    ],
                ],
            }),
        }
];

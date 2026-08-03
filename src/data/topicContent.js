const sources = {
    consumerLaw: "https://vanban.chinhphu.vn/?docid=208363&pageid=27160",
    consumerDecree: "https://vanban.chinhphu.vn/?docid=210254&pageid=27160",
    eCommerce:
        "https://moit.gov.vn/tin-tuc/thong-bao/sua-doi-bo-sung-mot-so-quy-dinh-ve-thuong-mai-dien-tu.html",
    onlineGov: "https://online.gov.vn/Bieu-Mau",
    garenaTerms: "https://caithe.garena.vn/dieu-khoan-dich-vu/",
    garenaSharing:
        "https://lienquan.garena.vn/thong-bao-cap-nhat-quy-dinh-xu-phat-va-bo-tieu-chuan-tu-cach-vdv-chuyen-nghiep-cua-lien-quan-mobile/",
    scamResponse:
        "https://special.nhandan.vn/phai-lam-gi-khi-bi-lua-dao-truc-tuyen/index.html",
    personalData: "https://vanban.chinhphu.vn/?docid=207759&pageid=27160",
};

const sourceList = (items) =>
    `<section class="topic-source-box"><h2>Nguồn tham khảo</h2><ul>${items.map(([label, href]) => `<li><a href="${href}" target="_blank" rel="noreferrer">${label}</a></li>`).join("")}</ul><p>Nội dung trên MBN là hướng dẫn vận hành và thông tin tham khảo. Điều khoản cụ thể của từng giao dịch, nhà phát hành và quy định pháp luật hiện hành luôn được ưu tiên.</p></section>`;

const article = ({
    intro,
    toc,
    sections,
    checklist = [],
    warning = "",
    sources: articleSources = [],
}) => `
  <div class="topic-lead">${intro}</div>
  ${checklist.length ? `<section class="topic-checklist"><h2>Danh sách kiểm tra nhanh</h2><ul>${checklist.map((item) => `<li>${item}</li>`).join("")}</ul></section>` : ""}
  <nav class="topic-toc"><strong>Nội dung bài viết</strong><ol>${toc.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join("")}</ol></nav>
  ${sections.join("")}
  ${warning ? `<aside class="topic-warning"><strong>Lưu ý quan trọng</strong><p>${warning}</p></aside>` : ""}
  ${articleSources.length ? sourceList(articleSources) : ""}
`;

const section = (id, title, body) =>
    `<section id="${id}" class="topic-section"><h2>${title}</h2>${body}</section>`;
const steps = (items) =>
    `<ol class="topic-steps">${items.map((item, index) => `<li><b>${index + 1}</b><div><strong>${item.title}</strong><p>${item.body}</p></div></li>`).join("")}</ol>`;
const bullets = (items) =>
    `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
const table = (rows) =>
    `<div class="topic-table">${rows.map(([label, value]) => `<div><span>${label}</span><b>${value}</b></div>`).join("")}</div>`;

export const detailedTopics = [
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
    },
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
    },
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
    },
];

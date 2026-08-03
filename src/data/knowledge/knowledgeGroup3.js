import { commonWarnings } from "../knowledgeShared";

export const knowledgePages = {
    "/policies/an-toan-tai-khoan": {
            title: "An toàn tài khoản và chống lừa đảo",
            category: "Bảo mật",
            summary:
                "Các nguyên tắc bảo vệ tài khoản khách hàng, tài khoản game và thông tin thanh toán.",
            lastReviewed: "29/07/2026",
            scopeNote:
                "Ưu tiên nguyên tắc không chia sẻ bí mật xác thực và không cài phần mềm điều khiển từ xa.",
            quickFacts: [
                {
                    label: "MBN không yêu cầu",
                    value: "OTP, mật khẩu email, mã dự phòng 2FA",
                },
                {
                    label: "Kênh hỗ trợ",
                    value: "Chỉ các kênh công bố trên website",
                },
                {
                    label: "QR hợp lệ",
                    value: "QR sinh từ giao dịch hoặc trang nạp chính thức",
                },
                {
                    label: "Khi nghi ngờ",
                    value: "Dừng thanh toán và lưu bằng chứng ngay",
                },
            ],
            process: [
                {
                    title: "Kiểm tra tên miền và người nhận",
                    description:
                        "Đối chiếu URL, tài khoản ngân hàng, số hỗ trợ và mã giao dịch.",
                },
                {
                    title: "Giới hạn thông tin chia sẻ",
                    description:
                        "Không gửi OTP, mã khôi phục, cookie, mật khẩu email hoặc ảnh giấy tờ không cần thiết.",
                },
                {
                    title: "Bảo vệ sau bàn giao",
                    description:
                        "Đổi thông tin trong phạm vi cho phép, đăng xuất phiên lạ và bật bảo vệ bổ sung.",
                },
                {
                    title: "Ứng phó sự cố",
                    description:
                        "Khóa thao tác, đổi mật khẩu liên quan, liên hệ ngân hàng/nhà phát hành và mở yêu cầu MBN.",
                },
            ],
            requiredEvidence: [
                "Ảnh chụp URL hoặc tài khoản giả mạo.",
                "Số điện thoại, tài khoản mạng xã hội và nội dung yêu cầu đáng ngờ.",
                "Biên nhận chuyển tiền hoặc mã QR.",
                "Thời gian và thiết bị đăng nhập lạ.",
            ],
            sections: [
                {
                    title: "Nhận diện kênh chính thức",
                    body: [
                        "Chỉ sử dụng website, số hỗ trợ và tài khoản ngân hàng được công bố.",
                        "Kiểm tra tên miền trước khi đăng nhập hoặc quét QR.",
                    ],
                },
                {
                    title: "Thông tin tuyệt đối không chia sẻ",
                    body: [
                        "OTP, mật khẩu email, mã dự phòng 2FA, mã khôi phục và cookie đăng nhập.",
                        "Nhân viên hỗ trợ không cần các thông tin này để tra cứu giao dịch.",
                    ],
                },
                {
                    title: "Sau khi nhận nick",
                    body: [
                        "Đổi thông tin bảo mật theo đúng phạm vi được phép.",
                        "Đăng xuất phiên lạ, kiểm tra thiết bị và bật bảo vệ bổ sung nếu nhà phát hành hỗ trợ.",
                    ],
                },
                {
                    title: "Khi nghi ngờ bị lừa",
                    body: [
                        "Dừng chuyển tiền, lưu bằng chứng, liên hệ ngân hàng và hỗ trợ chính thức càng sớm càng tốt.",
                        "Không cài ứng dụng điều khiển từ xa hoặc phần mềm không rõ nguồn gốc.",
                    ],
                },
            ],
            warnings: commonWarnings,
        },
    "/policies/mien-tru-trach-nhiem-rui-ro": {
            title: "Miễn trừ trách nhiệm và phân bổ rủi ro",
            category: "An toàn và pháp lý",
            summary:
                "Quy định rõ phần trách nhiệm của người chơi, người bán/cho thuê, nền tảng, nhà phát hành và ảnh hưởng của thay đổi pháp luật.",
            lastReviewed: "29/07/2026",
            scopeNote:
                "Miễn trừ chỉ áp dụng trong giới hạn pháp luật và không làm mất các quyền bắt buộc của người tiêu dùng.",
            quickFacts: [
                {
                    label: "Rủi ro người chơi",
                    value: "Tự chịu đối với hành vi sử dụng trái thỏa thuận hoặc chia sẻ thông tin xác thực",
                },
                {
                    label: "Rủi ro nhà phát hành",
                    value: "Khóa, thu hồi, thay đổi máy chủ, vật phẩm hoặc điều khoản",
                },
                {
                    label: "Rủi ro pháp luật",
                    value: "Giao dịch có thể bị tạm dừng, điều chỉnh hoặc chấm dứt theo quy định mới",
                },
                {
                    label: "Giới hạn miễn trừ",
                    value: "Không áp dụng cho gian dối, lỗi cố ý, vi phạm dữ liệu hoặc nghĩa vụ bắt buộc",
                },
            ],
            process: [
                {
                    title: "Xác định nguyên nhân",
                    description:
                        "Phân loại sự cố do người dùng, bên giao dịch, nhà phát hành, nền tảng, pháp luật hoặc sự kiện ngoài kiểm soát.",
                },
                {
                    title: "Bảo toàn bằng chứng",
                    description:
                        "Lưu nhật ký, ảnh/video, thông báo nhà phát hành, chứng từ và phiên bản điều khoản đã xác nhận.",
                },
                {
                    title: "Giảm thiểu thiệt hại",
                    description:
                        "Dừng thao tác rủi ro, khóa thanh toán/bàn giao khi cần và thông báo cho các bên.",
                },
                {
                    title: "Phân bổ trách nhiệm",
                    description:
                        "Căn cứ lỗi, nghĩa vụ đã công bố, khả năng kiểm soát và quy định bắt buộc.",
                },
                {
                    title: "Xử lý thay đổi",
                    description:
                        "Thông báo phiên bản mới, lựa chọn tiếp tục có điều chỉnh, tạm dừng, hoàn tiền hoặc chấm dứt.",
                },
            ],
            responsibilities: [
                {
                    role: "Người mua/người thuê",
                    items: [
                        "Bảo mật thông tin nhận bàn giao.",
                        "Không gian lận, chuyển vật phẩm, chia sẻ hoặc dùng quá phạm vi.",
                        "Chịu trách nhiệm với hành vi sau bàn giao nếu không có lỗi từ bên còn lại.",
                    ],
                },
                {
                    role: "Người bán/người cho thuê",
                    items: [
                        "Đảm bảo quyền kiểm soát và nguồn gốc hợp pháp.",
                        "Công bố liên kết, lịch sử khóa/phạt và hạn chế đã biết.",
                        "Không thu hồi hoặc can thiệp trái cam kết.",
                    ],
                },
                {
                    role: "MBN",
                    items: [
                        "Chịu trách nhiệm với dịch vụ trực tiếp cung cấp và quy trình đã công bố.",
                        "Không đại diện hoặc kiểm soát quyết định độc lập của nhà phát hành.",
                        "Không được miễn trừ lỗi cố ý, lỗi nghiêm trọng, vi phạm dữ liệu hoặc nghĩa vụ bắt buộc.",
                    ],
                },
                {
                    role: "Nhà phát hành/cơ quan có thẩm quyền",
                    items: [
                        "Có thể thay đổi quy tắc, khóa hoặc thu hồi tài khoản.",
                        "Có thể yêu cầu hạn chế hoặc dừng giao dịch.",
                        "Quy định bắt buộc được ưu tiên áp dụng.",
                    ],
                },
            ],
            requiredEvidence: [
                "Phiên bản điều khoản đã xác nhận.",
                "Thông báo hoặc quyết định của nhà phát hành/cơ quan có thẩm quyền.",
                "Nhật ký đăng nhập, bàn giao và thao tác.",
                "Biên nhận thanh toán, ảnh/video và lịch sử hỗ trợ.",
            ],
            checklist: [
                "Đọc cảnh báo theo từng trò chơi",
                "Xác định bên kiểm soát rủi ro",
                "Không chấp nhận miễn trừ tuyệt đối",
                "Theo dõi phiên bản điều khoản",
                "Lưu bằng chứng khi quy định thay đổi",
            ],
            sections: [
                {
                    title: "1. Rủi ro do người chơi",
                    body: [
                        "Người dùng chịu trách nhiệm đối với hành vi gian lận, chia sẻ tài khoản, làm lộ OTP/mật khẩu, chuyển vật phẩm, thay đổi bảo mật hoặc sử dụng ngoài phạm vi thuê.",
                        "Trách nhiệm không chuyển sang người dùng nếu thiệt hại bắt nguồn từ mô tả sai, che giấu thông tin hoặc thu hồi trái cam kết.",
                    ],
                },
                {
                    title: "2. Rủi ro do nhà phát hành",
                    body: [
                        "Tài khoản và vật phẩm có thể chỉ là quyền sử dụng; nhà phát hành có thể khóa, thu hồi, đổi cơ chế bảo mật, máy chủ hoặc giá trị vật phẩm.",
                        "MBN không thể buộc nhà phát hành công nhận giao dịch giữa người dùng hoặc khôi phục tài khoản.",
                    ],
                },
                {
                    title: "3. Thay đổi pháp luật hoặc yêu cầu quản lý",
                    body: [
                        "Khi có quy định mới hoặc yêu cầu của cơ quan có thẩm quyền, nền tảng có thể tạm dừng, yêu cầu bổ sung thông tin, điều chỉnh hoặc chấm dứt giao dịch.",
                        "Việc xử lý tiền và tài sản phải căn cứ trạng thái thực tế, quyền lợi hợp pháp và quy định bắt buộc.",
                    ],
                },
                {
                    title: "4. Giới hạn trách nhiệm của nền tảng",
                    body: [
                        "Nền tảng chịu trách nhiệm đối với phần dịch vụ mình trực tiếp cung cấp: ghi nhận giao dịch, lưu dấu vết, đối soát và hỗ trợ theo quy trình công bố.",
                        "Không miễn trừ trách nhiệm do gian dối, lỗi cố ý, lỗi nghiêm trọng, vi phạm bảo mật/dữ liệu hoặc nghĩa vụ pháp luật không cho phép loại trừ.",
                    ],
                },
                {
                    title: "5. Bất khả kháng và gián đoạn",
                    body: [
                        "Thiên tai, dịch bệnh, mất điện/viễn thông diện rộng, tấn công mạng, gián đoạn ngân hàng, sự cố nhà phát hành hoặc quyết định nhà nước có thể làm chậm nghĩa vụ.",
                        "Bên bị ảnh hưởng phải thông báo sớm, chứng minh hợp lý và giảm thiểu thiệt hại; nghĩa vụ bảo mật không tự động chấm dứt.",
                    ],
                },
                {
                    title: "6. Sửa đổi điều khoản",
                    body: [
                        "Mỗi lần sửa phải có phiên bản, ngày hiệu lực và nội dung thay đổi.",
                        "Phiên bản làm tăng nghĩa vụ hoặc giảm quyền lợi không áp dụng hồi tố nếu chưa được đồng ý hợp lệ, trừ trường hợp pháp luật bắt buộc.",
                        "Giao dịch đang thực hiện phải được thông báo và có phương án tiếp tục, điều chỉnh, tạm dừng, hoàn tiền/đối soát hoặc chấm dứt.",
                    ],
                },
            ],
            warnings: commonWarnings,
        },
    "/dieu-khoan-va-chinh-sach": {
            title: "Điều khoản và chính sách",
            category: "Quy chế nền tảng",
            summary:
                "Tổng hợp quyền, nghĩa vụ, điều kiện giao dịch, thanh toán, bàn giao, khiếu nại và bảo vệ dữ liệu.",
            lastReviewed: "29/07/2026",
            scopeNote:
                "Bản dự thảo sản phẩm; cần tư vấn pháp lý và rà soát mô hình thông báo/đăng ký thương mại điện tử trước khi công bố.",
            quickFacts: [
                {
                    label: "Đối tượng",
                    value: "Người mua, người bán, người thuê và người cho thuê",
                },
                {
                    label: "Thông tin bắt buộc",
                    value: "Giá, phí, cọc, thời hạn, bàn giao, hủy và khiếu nại",
                },
                {
                    label: "Xác nhận",
                    value: "Người dùng phải có cơ hội rà soát trước khi gửi giao dịch",
                },
                {
                    label: "Nhà phát hành",
                    value: "Điều khoản game có thể hạn chế chuyển nhượng tài khoản",
                },
            ],
            responsibilities: [
                {
                    role: "Người đăng tin",
                    items: [
                        "Đảm bảo có quyền sử dụng và cung cấp thông tin trung thực.",
                        "Công bố tình trạng liên kết, lịch sử vi phạm và hạn chế bàn giao.",
                        "Không đăng nội dung xâm phạm quyền của bên thứ ba.",
                    ],
                },
                {
                    role: "Khách hàng",
                    items: [
                        "Đọc điều kiện trước khi thanh toán.",
                        "Cung cấp thông tin chính xác và bảo vệ tài khoản của mình.",
                        "Không lạm dụng cơ chế khiếu nại hoặc tạo bằng chứng sai lệch.",
                    ],
                },
                {
                    role: "MBN",
                    items: [
                        "Hiển thị rõ điều kiện giao dịch và lưu dấu vết xác nhận.",
                        "Có cơ chế tiếp nhận, tạm giữ và giải quyết tranh chấp.",
                        "Bảo vệ dữ liệu theo mục đích đã công bố.",
                    ],
                },
                {
                    role: "Đối tác thanh toán",
                    items: [
                        "Xử lý thanh toán theo quy định và cung cấp dữ liệu đối soát.",
                        "Không quyết định tranh chấp nội dung tài khoản game thay cho MBN.",
                    ],
                },
            ],
            sections: [
                {
                    title: "Vai trò của nền tảng",
                    body: [
                        "Nền tảng cung cấp hạ tầng đăng tin, đặt giao dịch, lưu lịch sử và hỗ trợ đối soát.",
                        "Vai trò cụ thể của người bán, người mua, người thuê, người cho thuê và nền tảng phải được nêu rõ ở từng giao dịch.",
                    ],
                },
                {
                    title: "Thông tin sản phẩm và giá",
                    body: [
                        "Tin đăng phải trung thực, dễ hiểu và đủ thông tin ảnh hưởng quyết định giao dịch.",
                        "Giá, phí dịch vụ, tiền cọc, khoản trả trước và tổng phải thanh toán phải được hiển thị trước xác nhận.",
                    ],
                },
                {
                    title: "Điều kiện giao dịch",
                    body: [
                        "Khách hàng phải có cơ hội rà soát, hủy hoặc xác nhận trước khi gửi yêu cầu.",
                        "Các điều khoản bán, thuê, đặt cọc và trả góp phải được chấp thuận riêng khi áp dụng.",
                    ],
                },
                {
                    title: "Nhà phát hành game",
                    body: [
                        "Giao dịch tài khoản game có thể chịu điều khoản riêng của nhà phát hành.",
                        "Nền tảng không bảo đảm nhà phát hành cho phép chuyển nhượng; người dùng có trách nhiệm kiểm tra và chấp nhận rủi ro liên quan.",
                    ],
                },
                {
                    title: "Khiếu nại và dữ liệu",
                    body: [
                        "Nền tảng công bố quy trình tiếp nhận và xử lý khiếu nại.",
                        "Thông tin cá nhân và lịch sử giao dịch chỉ được sử dụng theo mục đích đã công bố và yêu cầu pháp luật áp dụng.",
                    ],
                },
                {
                    title: "Miễn trừ và phân bổ rủi ro",
                    body: [
                        "Mỗi bên chịu trách nhiệm với hành vi thuộc phạm vi kiểm soát của mình; miễn trừ không áp dụng cho gian dối, lỗi cố ý, vi phạm bảo mật hoặc nghĩa vụ bắt buộc.",
                        "Rủi ro từ nhà phát hành, thay đổi pháp luật và sự kiện ngoài kiểm soát được xử lý theo nguyên nhân, bằng chứng và trạng thái giao dịch.",
                    ],
                },
                {
                    title: "Sửa đổi điều khoản",
                    body: [
                        "Mọi thay đổi phải có phiên bản và ngày hiệu lực.",
                        "Thay đổi bất lợi không áp dụng hồi tố nếu chưa có sự đồng ý hợp lệ, trừ yêu cầu bắt buộc của pháp luật.",
                    ],
                },
            ],
            warnings: [
                "Nội dung này là bản dự thảo nghiệp vụ, cần được đơn vị vận hành và tư vấn pháp lý rà soát trước khi công bố chính thức.",
                ...commonWarnings,
            ],
        }
};

import { commonWarnings } from "../knowledgeShared";

export const knowledgePages = {
    "/guides/huong-dan-mua-nick": {
            title: "Hướng dẫn mua hoặc thuê nick",
            category: "Hướng dẫn giao dịch",
            summary:
                "Quy trình kiểm tra, thanh toán, bàn giao và xác nhận hoàn tất dành cho giao dịch mua hoặc thuê tài khoản.",
            lastReviewed: "29/07/2026",
            scopeNote:
                "Áp dụng cho giao dịch mua thẳng, thuê có thời hạn, trả góp và đặt cọc trên MBN.",
            quickFacts: [
                {
                    label: "Thời điểm đọc",
                    value: "Trước khi thanh toán hoặc đặt cọc",
                },
                {
                    label: "Kênh thanh toán",
                    value: "Số dư MBN hoặc QR sinh từ giao dịch",
                },
                {
                    label: "Bằng chứng tối thiểu",
                    value: "Ảnh tin đăng, biên nhận, video bàn giao",
                },
                {
                    label: "Không nên làm",
                    value: "Giao dịch ngoài hệ thống hoặc gửi OTP",
                },
            ],
            process: [
                {
                    title: "Chọn đúng tin đăng",
                    description:
                        "Đối chiếu game, máy chủ, mã nick, loại giao dịch, giá và tình trạng liên kết.",
                },
                {
                    title: "Rà soát điều khoản",
                    description:
                        "Đọc phí, cọc, lịch trả góp, thời hạn thuê, điều kiện bàn giao và hoàn tiền.",
                },
                {
                    title: "Thanh toán theo mã giao dịch",
                    description:
                        "Chỉ dùng số dư hoặc QR chính thức; nội dung chuyển khoản phải khớp mã.",
                },
                {
                    title: "Kiểm tra khi bàn giao",
                    description:
                        "Quay video đăng nhập, kiểm tra vật phẩm, liên kết bảo mật và khả năng đổi thông tin.",
                },
                {
                    title: "Xác nhận hoặc mở tranh chấp",
                    description:
                        "Chỉ xác nhận hoàn tất khi đủ điều kiện; nếu sai lệch hãy giữ nguyên hiện trạng và gửi bằng chứng.",
                },
            ],
            responsibilities: [
                {
                    role: "Người mua/người thuê",
                    items: [
                        "Cung cấp thông tin nhận bàn giao chính xác.",
                        "Kiểm tra ngay trong thời hạn xác nhận.",
                        "Không thay đổi hoặc chuyển tài sản ngoài phạm vi được phép.",
                    ],
                },
                {
                    role: "Người bán/người cho thuê",
                    items: [
                        "Mô tả đúng hiện trạng và lịch sử vi phạm.",
                        "Bàn giao đúng thời hạn và đúng tài khoản.",
                        "Phối hợp xử lý nếu tài khoản bị thu hồi hoặc sai mô tả.",
                    ],
                },
                {
                    role: "MBN",
                    items: [
                        "Lưu trạng thái giao dịch và bằng chứng do các bên cung cấp.",
                        "Hiển thị rõ giá, phí, cọc và điều kiện trước xác nhận.",
                        "Tạm dừng xử lý khi có tranh chấp hợp lệ.",
                    ],
                },
                {
                    role: "Nhà phát hành",
                    items: [
                        "Có thể áp dụng điều khoản riêng về tài khoản.",
                        "Có thể khóa hoặc thu hồi khi phát hiện vi phạm.",
                        "Không phải là bên bảo lãnh cho giao dịch trên MBN.",
                    ],
                },
            ],
            requiredEvidence: [
                "Ảnh hoặc bản lưu tin đăng tại thời điểm đặt giao dịch.",
                "Biên nhận thanh toán và mã giao dịch.",
                "Video từ lúc nhận thông tin đến khi đăng nhập và kiểm tra.",
                "Lịch sử trao đổi qua kênh hỗ trợ chính thức.",
                "Ảnh chụp lỗi, khóa tài khoản hoặc thông báo từ nhà phát hành nếu có.",
            ],
            checklist: [
                "Đăng nhập đúng tài khoản khách hàng",
                "Kiểm tra mã nick và loại giao dịch",
                "Đọc điều kiện bàn giao",
                "Xác nhận giá, phí và tiền cọc",
                "Lưu bằng chứng giao dịch",
            ],
            sections: [
                {
                    title: "1. Chọn đúng tài khoản",
                    body: [
                        "Đối chiếu mã nick, máy chủ, cấp độ, vật phẩm, loại tin bán hoặc cho thuê.",
                        "Mở toàn bộ ảnh chi tiết và đọc kỹ mô tả, điều kiện đổi thông tin đăng ký, thời gian thuê và khoản tiền cọc.",
                    ],
                },
                {
                    title: "2. Rà soát chi phí trước khi xác nhận",
                    body: [
                        "Kiểm tra giá niêm yết, giá khuyến mại, phí dịch vụ, tiền cọc và tổng số tiền phải thanh toán.",
                        "Với trả góp, cần đọc số tiền lần đầu, thời hạn thanh toán phần còn lại và hậu quả khi quá hạn.",
                    ],
                },
                {
                    title: "3. Thanh toán an toàn",
                    body: [
                        "Ưu tiên số dư hệ thống hoặc QR được sinh trực tiếp từ giao dịch.",
                        "Nội dung chuyển khoản phải đúng mã giao dịch. Không chuyển vào tài khoản khác do người lạ cung cấp.",
                    ],
                },
                {
                    title: "4. Bàn giao và kiểm tra",
                    body: [
                        "Kiểm tra đăng nhập, thông tin nhân vật và tài sản trong game ngay khi nhận.",
                        "Chỉ đổi mật khẩu, email hoặc số điện thoại khi quy định của giao dịch và nhà phát hành cho phép.",
                    ],
                },
                {
                    title: "5. Xác nhận hoàn tất",
                    body: [
                        "Chỉ xác nhận hoàn tất sau khi đã kiểm tra đủ thông tin.",
                        "Nếu phát hiện sai lệch, dừng thao tác, giữ nguyên trạng thái và mở yêu cầu hỗ trợ.",
                    ],
                },
            ],
            warnings: commonWarnings,
        },
    "/guides/quy-dinh-tra-gop": {
            title: "Quy định mua nick trả góp",
            category: "Quy định giao dịch",
            summary:
                "Điều kiện thanh toán nhiều lần, thời hạn, bàn giao và xử lý khi quá hạn.",
            lastReviewed: "29/07/2026",
            scopeNote:
                "Bản quy trình vận hành; tỷ lệ trả trước, số kỳ và phí phải lấy từ từng giao dịch cụ thể.",
            quickFacts: [
                {
                    label: "Giá áp dụng",
                    value: "Giá trả góp hiển thị tại thời điểm xác nhận",
                },
                {
                    label: "Bàn giao",
                    value: "Sau thanh toán đủ hoặc bàn giao có kiểm soát",
                },
                {
                    label: "Nhắc hạn",
                    value: "Trước ngày đến hạn theo cấu hình giao dịch",
                },
                {
                    label: "Quá hạn",
                    value: "Xử lý theo điều khoản đã chấp thuận, không tự suy diễn",
                },
            ],
            process: [
                {
                    title: "Xác nhận kế hoạch trả góp",
                    description:
                        "Kiểm tra giá mua thẳng, giá trả góp, số tiền lần đầu, số kỳ và từng ngày đến hạn.",
                },
                {
                    title: "Thanh toán lần đầu",
                    description:
                        "Giao dịch chỉ được kích hoạt khi khoản đầu tiên được đối soát thành công.",
                },
                {
                    title: "Theo dõi nghĩa vụ",
                    description:
                        "Mỗi khoản thanh toán phải có biên nhận và cập nhật số dư còn lại.",
                },
                {
                    title: "Hoàn tất hoặc xử lý quá hạn",
                    description:
                        "Sau thanh toán đủ mới chuyển hoàn tất; quá hạn phải được thông báo và xử lý theo điều khoản đã xác nhận.",
                },
            ],
            responsibilities: [
                {
                    role: "Khách hàng",
                    items: [
                        "Đọc lịch thanh toán và chủ động theo dõi ngày đến hạn.",
                        "Không bán lại, cho thuê lại hoặc thay đổi bảo mật khi chưa hoàn tất.",
                        "Thông báo sớm khi cần hỗ trợ hoặc gia hạn.",
                    ],
                },
                {
                    role: "Người bán/MBN",
                    items: [
                        "Giữ nguyên điều kiện đã xác nhận trong suốt giao dịch.",
                        "Ghi nhận từng lần thanh toán.",
                        "Không áp dụng khoản phạt, phí hoặc khấu trừ chưa công bố.",
                    ],
                },
            ],
            requiredEvidence: [
                "Bản kế hoạch thanh toán tại thời điểm xác nhận.",
                "Biên nhận từng lần thanh toán.",
                "Thông báo nhắc hạn và phản hồi của khách hàng.",
                "Biên bản bàn giao có kiểm soát nếu bàn giao trước khi thanh toán đủ.",
            ],
            checklist: [
                "Giá trả góp và giá mua thẳng",
                "Số tiền lần đầu",
                "Lịch thanh toán",
                "Điều kiện bàn giao",
                "Chính sách quá hạn và hoàn tiền",
            ],
            sections: [
                {
                    title: "Phạm vi áp dụng",
                    body: [
                        "Chỉ áp dụng cho tin đăng có bật hình thức trả góp và hiển thị rõ lịch thanh toán.",
                        "Tổng giá trả góp có thể khác giá mua thẳng; mọi khoản chênh lệch phải được hiển thị trước khi xác nhận.",
                    ],
                },
                {
                    title: "Thanh toán lần đầu",
                    body: [
                        "Khoản thanh toán đầu tiên dùng để giữ nick và mở giao dịch.",
                        "Hệ thống phải hiển thị rõ phần tiền còn lại, số kỳ, ngày đến hạn và phí phát sinh nếu có.",
                    ],
                },
                {
                    title: "Bàn giao trong thời gian trả góp",
                    body: [
                        "Tùy giao dịch, tài khoản có thể chỉ được bàn giao sau khi thanh toán đủ hoặc được bàn giao có kiểm soát.",
                        "Không tự ý thay đổi thông tin bảo mật, bán lại hoặc cho người khác sử dụng khi chưa hoàn tất nghĩa vụ.",
                    ],
                },
                {
                    title: "Quá hạn và hủy giao dịch",
                    body: [
                        "Khi gần đến hạn, hệ thống cần gửi nhắc nhở.",
                        "Cách xử lý tiền đã trả, tiền cọc và tài khoản phải theo điều khoản đã được người mua đồng ý trước giao dịch; không tự động áp dụng điều khoản bất lợi chưa công bố.",
                    ],
                },
            ],
            warnings: commonWarnings,
        },
    "/guides/quy-dinh-dat-coc": {
            title: "Quy định đặt cọc giữ nick",
            category: "Quy định giao dịch",
            summary:
                "Cách giữ tài khoản trong thời hạn nhất định và xử lý tiền cọc khi hoàn tất, hủy hoặc quá hạn.",
            lastReviewed: "29/07/2026",
            scopeNote:
                "Khoản cọc được tính vào nghĩa vụ thanh toán, trừ khi giao dịch công bố rõ khoản phí riêng.",
            quickFacts: [
                {
                    label: "Hiệu lực giữ chỗ",
                    value: "Từ lúc cọc được đối soát đến hết hạn thanh toán",
                },
                { label: "Trạng thái tin", value: "Đã giữ chỗ" },
                {
                    label: "Số tiền còn lại",
                    value: "Tổng phải trả trừ khoản cọc hợp lệ",
                },
                {
                    label: "Hoàn/khấu trừ",
                    value: "Theo nguyên nhân, bằng chứng và điều khoản đã chấp thuận",
                },
            ],
            process: [
                {
                    title: "Khởi tạo yêu cầu cọc",
                    description:
                        "Hệ thống hiển thị mã nick, giá, số tiền cọc, số tiền còn lại và hạn thanh toán.",
                },
                {
                    title: "Đối soát khoản cọc",
                    description:
                        "Sau khi tiền vào đúng giao dịch, tin đăng chuyển sang giữ chỗ.",
                },
                {
                    title: "Thanh toán phần còn lại",
                    description:
                        "Khách hàng thanh toán trước hạn để chuyển sang bàn giao.",
                },
                {
                    title: "Hoàn tất, hủy hoặc quá hạn",
                    description:
                        "Mọi hoàn hoặc khấu trừ phải có căn cứ và được ghi vào lịch sử giao dịch.",
                },
            ],
            requiredEvidence: [
                "Màn hình điều khoản cọc tại thời điểm xác nhận.",
                "Biên nhận khoản cọc.",
                "Mốc thời gian bắt đầu và hết hạn giữ chỗ.",
                "Trao đổi về gia hạn, hủy hoặc lý do không thể bàn giao.",
            ],
            checklist: [
                "Mức cọc",
                "Thời gian giữ nick",
                "Số tiền còn lại",
                "Điều kiện hoàn cọc",
                "Trường hợp bị khấu trừ",
            ],
            sections: [
                {
                    title: "Xác lập đặt cọc",
                    body: [
                        "Mã nick, giá bán, số tiền cọc, số tiền còn lại và hạn thanh toán phải được ghi nhận trong giao dịch.",
                        "Sau khi cọc thành công, tin đăng chuyển sang trạng thái giữ chỗ và không tiếp tục nhận giao dịch mới.",
                    ],
                },
                {
                    title: "Hoàn tất giao dịch",
                    body: [
                        "Khách hàng thanh toán phần còn lại trước hạn, sau đó thực hiện bàn giao và xác nhận.",
                        "Khoản cọc được tính vào tổng tiền phải thanh toán, không phải một khoản phí tách biệt trừ khi có công bố rõ.",
                    ],
                },
                {
                    title: "Hủy và quá hạn",
                    body: [
                        "Việc hoàn hoặc khấu trừ cọc phải dựa trên nguyên nhân, bằng chứng và điều khoản đã xác nhận.",
                        "Nếu bên bán không thể bàn giao đúng cam kết, giao dịch cần được hủy và xử lý hoàn tiền theo chính sách.",
                    ],
                },
            ],
            warnings: commonWarnings,
        },
    "/guides/quy-trinh-thue-nick": {
            title: "Quy trình thuê và hoàn trả tài khoản",
            category: "Thuê tài khoản",
            summary:
                "Hướng dẫn từ lúc chọn thời hạn thuê đến khi hoàn trả và nhận lại tiền cọc.",
            lastReviewed: "29/07/2026",
            scopeNote:
                "Áp dụng cho giao dịch thuê có thời hạn; không đồng nghĩa với chuyển quyền sở hữu tài khoản.",
            quickFacts: [
                {
                    label: "Thời gian thuê",
                    value: "Theo giờ/ngày hoặc kỳ được ghi trong giao dịch",
                },
                {
                    label: "Tiền cọc",
                    value: "Tách rõ với tiền thuê và được đối soát khi hoàn trả",
                },
                {
                    label: "Hiện trạng",
                    value: "Ghi nhận trước bàn giao và sau hoàn trả",
                },
                {
                    label: "Gia hạn",
                    value: "Chỉ có hiệu lực khi được xác nhận trước giờ kết thúc",
                },
            ],
            process: [
                {
                    title: "Chọn kỳ thuê",
                    description:
                        "Xác nhận thời gian bắt đầu, kết thúc, phí thuê, cọc và hành vi bị cấm.",
                },
                {
                    title: "Ghi nhận hiện trạng",
                    description:
                        "Lưu ảnh/video nhân vật, vật phẩm, tiền tệ, liên kết và trạng thái bảo mật.",
                },
                {
                    title: "Bàn giao có kiểm soát",
                    description:
                        "Chỉ cung cấp quyền truy cập cần thiết; không chia sẻ email gốc, mã khôi phục hoặc OTP.",
                },
                {
                    title: "Sử dụng trong phạm vi",
                    description:
                        "Không gian lận, chuyển vật phẩm, đổi bảo mật, xóa nhân vật hoặc cho người khác dùng.",
                },
                {
                    title: "Hoàn trả và đối soát cọc",
                    description:
                        "Đăng xuất, bàn giao lại, so sánh hiện trạng và ghi rõ mọi khoản khấu trừ nếu có.",
                },
            ],
            responsibilities: [
                {
                    role: "Người thuê",
                    items: [
                        "Tuân thủ phạm vi sử dụng và thời gian thuê.",
                        "Báo ngay sự cố khóa, mất kết nối hoặc truy cập lạ.",
                        "Hoàn trả đúng hạn và đăng xuất khỏi mọi thiết bị.",
                    ],
                },
                {
                    role: "Người cho thuê",
                    items: [
                        "Cung cấp tài khoản hoạt động đúng mô tả.",
                        "Không tự đăng nhập làm gián đoạn khi giao dịch đang hoạt động.",
                        "Không dùng thông tin thuê để truy cập thiết bị hoặc dữ liệu cá nhân của khách.",
                    ],
                },
            ],
            requiredEvidence: [
                "Biên bản hiện trạng trước và sau thuê.",
                "Mốc giờ bàn giao và hoàn trả.",
                "Danh sách thiết bị/phiên đăng nhập nếu game hỗ trợ.",
                "Ảnh/video thiệt hại, mất vật phẩm hoặc khóa tài khoản.",
            ],
            checklist: [
                "Thời gian thuê",
                "Phạm vi sử dụng",
                "Tiền cọc",
                "Hiện trạng bàn giao",
                "Hạn hoàn trả",
            ],
            sections: [
                {
                    title: "Trước khi thuê",
                    body: [
                        "Kiểm tra thời gian bắt đầu, kết thúc, giá thuê, tiền cọc và các hành vi bị cấm.",
                        "Ghi nhận hiện trạng tài khoản bằng ảnh hoặc biên bản bàn giao.",
                    ],
                },
                {
                    title: "Trong thời gian thuê",
                    body: [
                        "Không đổi thông tin bảo mật, chuyển tài sản, xóa nhân vật, sử dụng phần mềm gian lận hoặc cho người khác dùng chung.",
                        "Thông báo ngay khi có khóa tài khoản, mất kết nối bất thường hoặc nghi ngờ bị truy cập trái phép.",
                    ],
                },
                {
                    title: "Hoàn trả",
                    body: [
                        "Đăng xuất khỏi thiết bị, cung cấp thông tin theo quy trình hoàn trả và xác nhận hiện trạng.",
                        "Tiền cọc được giải phóng sau khi kiểm tra, trừ khoản khấu trừ có bằng chứng và căn cứ rõ ràng.",
                    ],
                },
                {
                    title: "Gia hạn và quá hạn",
                    body: [
                        "Yêu cầu gia hạn phải được xác nhận trước khi hết hạn.",
                        "Phí quá hạn phải được công bố trước; hệ thống không tự động gia hạn hoặc trừ tiền nếu khách hàng chưa đồng ý.",
                    ],
                },
            ],
            warnings: commonWarnings,
        }
};

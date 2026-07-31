# MBN React — Missing Pages & Khu mua bán Policy v18

## Phạm vi

Vòng này đối chiếu toàn bộ `pages/` của Nuxt `mbn-fe` với React v17, sau đó bổ sung các route còn thiếu và mở rộng nội dung cho mô hình mua, bán, thuê, cho thuê, đặt cọc và trả góp.

## Route phục dựng từ Nuxt gốc

- `/account/purchases/:id`
- `/account/wallet/deposit/card`
- `/guides/quy-dinh-dat-coc`
- `/guides/quy-dinh-tra-gop`
- `/teamobi/ninja-school/nick-vip`
- `/teamobi/ninja-school/nick-gia-re`
- `/events/daily`
- `/g4m/dai-tay-du`
- `/garena/lien-quan-mobile`

## Route nghiệp vụ bổ sung

- `/guides`
- `/guides/quy-trinh-thue-nick`
- `/guides/huong-dan-dang-ban-cho-thue`
- `/policies/tranh-chap-khieu-nai`
- `/policies/hoan-tien-huy-giao-dich`
- `/policies/an-toan-tai-khoan`

## Kiến trúc nội dung

Nội dung quy định và hướng dẫn được gom về:

- `src/data/knowledgeBase.js`
- `src/pages/KnowledgePage.jsx`

Điều này cho phép thay mock bằng CMS/API sau mà không thay đổi component UI.

## Nguyên tắc nội dung

- Phân biệt rõ quy định dự thảo với cam kết pháp lý chính thức.
- Không tuyên bố nhà phát hành cho phép mua bán tài khoản.
- Cảnh báo người dùng phải kiểm tra điều khoản riêng của từng nhà phát hành.
- Công bố rõ giá, phí, tiền cọc, khoản trả trước, lịch thanh toán và điều kiện hủy trước khi xác nhận.
- Có quy trình tiếp nhận tranh chấp, bảo toàn bằng chứng và tạm dừng xử lý giao dịch.
- Không giả lập thành công cho thao tác thanh toán hoặc giao dịch ghi.

## Nguồn nghiên cứu

- Luật Bảo vệ quyền lợi người tiêu dùng 2023: https://vanban.chinhphu.vn/?docid=208363&pageid=27160
- Hệ thống quản lý hoạt động thương mại điện tử: https://online.gov.vn/
- Văn bản hợp nhất quy định quản lý hoạt động thương mại điện tử.
- Trung tâm hỗ trợ Garena Việt Nam: https://hotro.garena.vn/
- TeaMobi: https://teamobi.com/

## Lưu ý vận hành

Nội dung trong repo là bản nghiệp vụ phục vụ phát triển UI/UX. Trước khi vận hành production, đơn vị vận hành cần:

1. Rà soát pháp lý tại Việt Nam.
2. Rà soát điều khoản từng nhà phát hành game.
3. Xác định website là website bán hàng hay sàn cung cấp dịch vụ thương mại điện tử.
4. Hoàn tất thủ tục thông báo/đăng ký phù hợp trên hệ thống của Bộ Công Thương.
5. Điền thông tin pháp nhân, đầu mối khiếu nại, tài khoản thanh toán và thời hạn xử lý thật.

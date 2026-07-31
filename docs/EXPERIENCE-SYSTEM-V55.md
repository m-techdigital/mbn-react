# MBN Experience System v55

## Mục tiêu
v55 không tạo thêm một bộ UI song song. Bản này bổ sung lớp sở hữu trải nghiệm cuối cùng cho các vấn đề còn phân tán giữa bảng, trang nội dung, nạp tiền, hồ sơ và thao tác tài liệu.

## Owner mới
- `ActionGroup`: nhóm thao tác canonical.
- `ResponsiveDataTable`: sở hữu trạng thái cạnh cuộn, sticky header và overflow region.
- `StatusBadge context`: phân biệt trạng thái theo ngữ cảnh tài khoản/giao dịch.
- `experience-system-v55.css`: owner cuối cho trải nghiệm tương tác và nhịp nội dung.

## Nguyên tắc
1. Page không tự dựng action grid khi base đáp ứng được.
2. Bảng mobile giữ nguyên bảng và cuộn trong vùng riêng.
3. Trạng thái không suy diễn chỉ từ một enum chung khi ngữ cảnh khác nhau.
4. Trang hướng dẫn/chính sách dùng reading layout và PageSection.
5. Trang nạp tiền dùng PageColumns/PageSection thay cho surface riêng.
6. Focus, overflow hint và trạng thái loading phải nhất quán.

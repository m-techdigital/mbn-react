# Admin/API base interaction compatibility

Storefront không sở hữu Admin filter/action foundation. Lượt đồng bộ này chỉ xác nhận contract API và không đưa `BaseModal`, `BaseFilter` hoặc Admin action registry vào MBN React.

MBN React tiếp tục dùng base riêng phù hợp storefront; API filter/sort/pagination thay đổi theo hướng additive và không làm thay đổi customer routes hiện có.

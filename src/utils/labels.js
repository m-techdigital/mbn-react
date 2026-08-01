const STATUS_LABELS = {
  draft: 'Bản nháp', pending: 'Đang chờ', pending_review: 'Chờ duyệt', published: 'Đang hiển thị', rejected: 'Bị từ chối',
  reserved: 'Đã giữ chỗ', completed: 'Hoàn tất', confirmed: 'Đã xác nhận', submitted: 'Chờ đối soát',
  partially_paid: 'Đã thanh toán một phần', returned: 'Đã hoàn trả', active: 'Đang thuê', pending_payment: 'Chờ thanh toán',
  paid: 'Đã thanh toán', handover_pending: 'Chờ xác nhận bàn giao', handed_over: 'Đã bàn giao', return_pending: 'Chờ xác nhận hoàn trả',
  disputed: 'Đang tranh chấp', cancelled: 'Đã hủy', open: 'Đang mở', resolved: 'Đã xử lý', failed: 'Không thành công',
  unsettled: 'Chưa đối soát', held: 'Đang tạm giữ', released: 'Đã giải ngân', refunded: 'Đã hoàn tiền', overdue: 'Quá hạn',
  processing: 'Đang xử lý', triaged: 'Đã phân loại', waiting_customer: 'Chờ khách hàng', waiting_counterparty: 'Chờ bên còn lại', reviewing: 'Đang xem xét', approved: 'Đã duyệt', verified: 'Đã xác minh', unverified: 'Chưa xác minh', suspended: 'Tạm khóa', expired: 'Đã hết hạn', inactive: 'Ngừng hoạt động', hidden: 'Đã ẩn', archived: 'Đã lưu trữ', dismissed: 'Đã bỏ qua',
};

const VALUE_LABELS = {
  purchase: 'Mua tài khoản', rental: 'Thuê tài khoản', sale: 'Bán tài khoản',
  buyer: 'Người mua', seller: 'Người bán', renter: 'Người thuê', lessor: 'Người cho thuê',
  installment: 'Trả góp', deposit: 'Đặt cọc', full: 'Thanh toán đủ', periodic: 'Theo từng chu kỳ', upfront: 'Thu trước toàn kỳ',
  security_deposit: 'Tiền cọc thuê', rental_fee: 'Tiền thuê', principal: 'Tiền mua tài khoản',
  bank: 'Chuyển khoản ngân hàng', wallet: 'Số dư ví',
  low: 'Thấp', normal: 'Bình thường', medium: 'Trung bình', high: 'Cao', urgent: 'Khẩn cấp',
  hour: 'giờ', day: 'ngày', week: 'tuần', month: 'tháng',
  available: 'Khoản khả dụng', held_balance: 'Khoản tạm giữ',
  deposit_request: 'Yêu cầu nạp tiền', deposit_confirmed: 'Nạp tiền đã xác nhận', transaction_payment: 'Thanh toán giao dịch',
  escrow_hold: 'Tiền giao dịch đang tạm giữ', escrow_release: 'Giải phóng tiền tạm giữ', settlement_credit: 'Tiền bán/cho thuê được ghi có',
  rental_deposit_refund_credit: 'Hoàn tiền cọc thuê', rental_deposit_refund_debit: 'Khấu trừ tiền cọc đang giữ',
  transaction_refund_credit: 'Hoàn tiền giao dịch', transaction_refund_debit: 'Giảm tiền đang giữ để hoàn', admin_adjustment: 'Điều chỉnh quản trị', withdrawal_reserved: 'Giữ tiền chờ rút', withdrawal_released: 'Hoàn tiền yêu cầu rút', withdrawal_paid: 'Đã chi trả tiền rút', settlement_gross_debit: 'Quyết toán tổng tiền tạm giữ', settlement_net_credit: 'Tiền ròng người bán nhận',
  sale_contract: 'Hợp đồng mua bán', rental_contract: 'Hợp đồng thuê', installment_appendix: 'Phụ lục trả góp',
  deposit_confirmation: 'Thỏa thuận đặt cọc', payment_confirmation: 'Xác nhận thanh toán', handover_minutes: 'Biên bản bàn giao',
  return_minutes: 'Biên bản hoàn trả', dispute_minutes: 'Tiếp nhận tranh chấp', dispute_resolution: 'Xử lý tranh chấp',
  refund_settlement: 'Hoàn tiền và đối soát', completion_minutes: 'Hoàn tất giao dịch', security_checklist: 'Kiểm tra bảo mật',
  platform_transaction_record: 'Phiếu ghi nhận giao dịch',
};

const CONTEXT_STATUS_LABELS = {
  account: { active: 'Đang hoạt động', inactive: 'Ngừng hoạt động', hidden: 'Đã ẩn', archived: 'Đã lưu trữ', dismissed: 'Đã bỏ qua', pending: 'Chờ kích hoạt' },
  listing: { active: 'Đang hiển thị', inactive: 'Ngừng hiển thị' },
  rental: { active: 'Đang thuê' },
};

export function statusLabel(value, fallback = 'Đang xử lý', context = '') {
  return CONTEXT_STATUS_LABELS[context]?.[value] || STATUS_LABELS[value] || VALUE_LABELS[value] || fallback;
}

export function valueLabel(value, fallback = '—') {
  return VALUE_LABELS[value] || STATUS_LABELS[value] || (value ? String(value).replaceAll('_', ' ') : fallback);
}

export function statusTone(value) {
  if (['completed', 'confirmed', 'published', 'paid', 'returned', 'resolved', 'active', 'released', 'refunded', 'verified', 'approved'].includes(value)) return 'success';
  if (['rejected', 'cancelled', 'failed', 'disputed', 'expired', 'hidden'].includes(value)) return 'danger';
  if (['submitted', 'pending', 'pending_review', 'pending_payment', 'partially_paid', 'handover_pending', 'return_pending', 'reserved', 'held', 'unsettled', 'overdue'].includes(value)) return 'warning';
  return 'neutral';
}

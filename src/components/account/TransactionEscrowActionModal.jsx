import BaseForm, { BaseFormActions } from "../base/BaseForm";
import FormField from "../base/FormField";
import { BaseTextarea } from "../base/FormControls";
import GamingButton from "../base/GamingButton";
import GamingModal from "../base/GamingModal";
import InlineNotice from "../base/InlineNotice";

const labels = {
    seller_handover: {
        title: "Xác nhận bàn giao tài sản số",
        label: "Hướng dẫn bàn giao",
        placeholder: "Mô tả kênh và bước bàn giao. Không nhập mật khẩu, OTP hoặc mã khôi phục.",
    },
    buyer_receive: {
        title: "Xác nhận đã kiểm tra tài sản",
        label: "Ghi chú kiểm tra",
        placeholder: "Ghi nhận tình trạng nick/vật phẩm sau khi kiểm tra (không bắt buộc).",
    },
};

export default function TransactionEscrowActionModal({ action, note, open, loading, onChange, onClose, onSubmit }) {
    const config = labels[action] || labels.buyer_receive;
    const missingRequiredNote = action === "seller_handover" && !note.trim();

    return (
        <GamingModal
            open={open}
            title={config.title}
            onClose={loading ? undefined : onClose}
            footer={
                <BaseFormActions>
                    <GamingButton type="button" variant="secondary" disabled={loading} onClick={onClose}>Hủy</GamingButton>
                    <GamingButton type="submit" form="escrow-action-form" variant="primary" loading={loading} disabled={missingRequiredNote}>Xác nhận</GamingButton>
                </BaseFormActions>
            }
        >
            <InlineNotice type="warning" title="Bảo vệ thông tin nhạy cảm">
                Chỉ ghi hướng dẫn và kết quả kiểm tra. Thông tin đăng nhập, OTP và mã khôi phục phải trao đổi qua kênh bảo mật được nền tảng chỉ định.
            </InlineNotice>
            <BaseForm id="escrow-action-form" className="mbn-form-stack" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
                <FormField label={config.label} required={action === "seller_handover"}>
                    <BaseTextarea value={note} onChange={(event) => onChange(event.target.value)} placeholder={config.placeholder} rows={5} />
                </FormField>
            </BaseForm>
        </GamingModal>
    );
}

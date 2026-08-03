import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BaseForm from "../components/base/BaseForm";
import FormField from "../components/base/FormField";
import GamingButton from "../components/base/GamingButton";
import InlineNotice from "../components/base/InlineNotice";
import PageShell from "../components/base/PageShell";
import PasswordField from "../components/base/PasswordField";
import { SurfacePanel } from "../components/base/ContentPrimitives";
import { authRepository } from "../services/repositories";
import { getUserFacingError } from "../utils/userFacingError";

export default function ResetPasswordPage() {
    const [params] = useSearchParams();
    const [form, setForm] = useState({
        token: params.get("token") || "",
        email: params.get("email") || "",
        password: "",
        password_confirmation: "",
    });
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    const [notice, setNotice] = useState("");
    const [errors, setErrors] = useState({});
    const submit = async (event) => {
        event.preventDefault();
        const next = {};
        if (form.password.length < 8)
            next.password = "Mật khẩu phải có ít nhất 8 ký tự.";
        if (form.password !== form.password_confirmation)
            next.password_confirmation = "Mật khẩu nhập lại chưa khớp.";
        setErrors(next);
        if (Object.keys(next).length) return;
        setBusy(true);
        setNotice("");
        try {
            await authRepository.resetPassword(form);
            setDone(true);
            setNotice("Mật khẩu đã được đặt lại.");
        } catch (requestError) {
            setNotice(
                getUserFacingError(
                    requestError,
                    "Không thể đặt lại mật khẩu. Vui lòng yêu cầu liên kết mới.",
                ),
            );
        } finally {
            setBusy(false);
        }
    };
    return (
        <PageShell
            title="Đặt lại mật khẩu"
            description="Tạo mật khẩu mới có ít nhất 8 ký tự."
        >
            <SurfacePanel className="security-form-panel">
                {done ? (
                    <InlineNotice type="success" title="Hoàn tất">
                        {notice}
                        <br />
                        <Link to="/">Quay về trang chủ để đăng nhập</Link>
                    </InlineNotice>
                ) : (
                    <BaseForm onSubmit={submit}>
                        <FormField
                            label="Mật khẩu mới"
                            required
                            error={errors.password}
                        >
                            <PasswordField
                                value={form.password}
                                onChange={(event) =>
                                    setForm((value) => ({
                                        ...value,
                                        password: event.target.value,
                                    }))
                                }
                            />
                        </FormField>
                        <FormField
                            label="Nhập lại mật khẩu"
                            required
                            error={errors.password_confirmation}
                        >
                            <PasswordField
                                value={form.password_confirmation}
                                onChange={(event) =>
                                    setForm((value) => ({
                                        ...value,
                                        password_confirmation:
                                            event.target.value,
                                    }))
                                }
                            />
                        </FormField>
                        {notice ? (
                            <InlineNotice type="error">{notice}</InlineNotice>
                        ) : null}
                        <GamingButton
                            type="submit"
                            variant="primary"
                            block
                            loading={busy}
                        >
                            Đặt lại mật khẩu
                        </GamingButton>
                    </BaseForm>
                )}
            </SurfacePanel>
        </PageShell>
    );
}

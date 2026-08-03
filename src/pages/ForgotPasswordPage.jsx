import { useState } from "react";
import BaseForm from "../components/base/BaseForm";
import FormField from "../components/base/FormField";
import GamingButton from "../components/base/GamingButton";
import InlineNotice from "../components/base/InlineNotice";
import PageShell from "../components/base/PageShell";
import { SurfacePanel } from "../components/base/ContentPrimitives";
import { authRepository } from "../services/repositories";
import { getUserFacingError } from "../utils/userFacingError";
import { BaseInput } from "../components/base/FormControls";

export default function ForgotPasswordPage() {
    const [login, setLogin] = useState("");
    const [busy, setBusy] = useState(false);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");

    const submit = async (event) => {
        event.preventDefault();
        if (!login.trim()) {
            setError("Vui lòng nhập tên đăng nhập hoặc địa chỉ thư điện tử.");
            return;
        }
        setBusy(true);
        setError("");
        setNotice("");
        try {
            await authRepository.forgotPassword({ login });
            setNotice(
                "Nếu thông tin phù hợp, hướng dẫn đặt lại mật khẩu sẽ được gửi đến địa chỉ thư điện tử đã đăng ký.",
            );
        } catch (requestError) {
            setError(
                getUserFacingError(
                    requestError,
                    "Không thể gửi hướng dẫn lúc này. Vui lòng thử lại sau.",
                ),
            );
        } finally {
            setBusy(false);
        }
    };

    return (
        <PageShell
            title="Quên mật khẩu"
            description="Nhập tên đăng nhập hoặc địa chỉ thư điện tử đã đăng ký."
        >
            <SurfacePanel className="security-form-panel">
                <BaseForm onSubmit={submit}>
                    <FormField label="Tài khoản" required error={error}>
                        <BaseInput
                            value={login}
                            onChange={(event) => setLogin(event.target.value)}
                            placeholder="Tên đăng nhập hoặc địa chỉ thư điện tử"
                        />
                    </FormField>
                    {notice ? (
                        <InlineNotice type="success">{notice}</InlineNotice>
                    ) : null}
                    <GamingButton
                        type="submit"
                        variant="primary"
                        block
                        loading={busy}
                    >
                        Gửi hướng dẫn đặt lại mật khẩu
                    </GamingButton>
                </BaseForm>
            </SurfacePanel>
        </PageShell>
    );
}

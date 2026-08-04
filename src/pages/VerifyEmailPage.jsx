import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import InlineNotice from "../components/base/InlineNotice";
import PageShell from "../components/base/PageShell";
import { SurfacePanel } from "../components/base/ContentPrimitives";
import { profileRepository } from "../services/repositories";
import { getUserFacingError } from "../utils/userFacingError";

export default function VerifyEmailPage() {
    const [params] = useSearchParams();
    const [state, setState] = useState({
        type: "info",
        message: "Đang xác nhận địa chỉ thư điện tử...",
    });
    useEffect(() => {
        const token = params.get("token");
        if (!token) {
            setState({
                type: "error",
                message: "Liên kết xác nhận không hợp lệ.",
            });
            return;
        }
        profileRepository
            .verifyEmail({ token })
            .then(() =>
                setState({
                    type: "success",
                    message: "Đã xác nhận địa chỉ thư điện tử mới.",
                }),
            )
            .catch((error) =>
                setState({
                    type: "error",
                    message: getUserFacingError(
                        error,
                        "Liên kết xác nhận không hợp lệ hoặc đã hết hạn.",
                    ),
                }),
            );
    }, [params]);
    return (
        <PageShell title="Xác nhận thư điện tử">
            <SurfacePanel className="security-form-panel">
                <InlineNotice type={state.type}>{state.message}</InlineNotice>
                <Link to="/account/profile">Quay lại hồ sơ</Link>
            </SurfacePanel>
        </PageShell>
    );
}

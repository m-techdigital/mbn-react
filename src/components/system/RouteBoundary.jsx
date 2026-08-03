import { Component } from "react";
import GamingButton from "../base/GamingButton";
import InlineNotice from "../base/InlineNotice";
import { PageSkeleton } from "../base/LoadingSkeleton";

export function RouteLoadingFallback() {
    return (
        <main
            className="route-boundary route-boundary--loading"
            aria-busy="true"
            aria-label="Đang tải nội dung"
        >
            <PageSkeleton variant="detail" />
        </main>
    );
}

export default class RouteBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        if (import.meta.env.DEV)
            console.error("Route render error", error, info);
    }

    render() {
        if (!this.state.error) return this.props.children;
        return (
            <main className="route-boundary" role="alert">
                <InlineNotice
                    tone="danger"
                    title="Không thể hiển thị trang này"
                >
                    Nội dung gặp sự cố khi tải. Bạn có thể thử tải lại trang mà
                    không làm mất dữ liệu đã lưu trên hệ thống.
                </InlineNotice>
                <div className="route-boundary__actions">
                    <GamingButton
                        type="button"
                        variant="primary"
                        onClick={() => window.location.reload()}
                    >
                        Tải lại trang
                    </GamingButton>
                    <GamingButton
                        type="button"
                        onClick={() => {
                            window.location.href = "/";
                        }}
                    >
                        Về trang chủ
                    </GamingButton>
                </div>
            </main>
        );
    }
}

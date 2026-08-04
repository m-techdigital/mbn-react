import "../styles/pages/customer-operations.scss";
import { useMemo } from "react";
import { Link } from "react-router";
import AsyncContent from "../components/base/AsyncContent";
import EmptyState from "../components/base/EmptyState";
import GamingButton from "../components/base/GamingButton";
import PageShell from "../components/base/PageShell";
import PageSection from "../components/base/PageSection";
import {
    RecordList,
    RecordListItem,
} from "../components/base/ContentPrimitives";
import StatusBadge from "../components/base/StatusBadge";
import { useRemoteData } from "../hooks/useRemoteData";
import { notificationRepository } from "../services/repositories";
import { notifyNotificationCountChanged } from "../utils/notificationEvents";

const formatTime = (value) =>
    value ? new Date(value).toLocaleString("vi-VN") : "—";

export default function NotificationsPage() {
    const { data, loading, error, reload } = useRemoteData(
        () => notificationRepository.list({ per_page: 50 }),
        [],
        { queryKey: "notifications", staleTime: 15000 },
    );
    const rows = useMemo(() => data?.notifications?.data || [], [data]);
    const read = async (item) => {
        if (!item.read_at) await notificationRepository.read(item.id);
        await reload();
        notifyNotificationCountChanged();
    };
    const readAll = async () => {
        await notificationRepository.readAll();
        await reload();
        notifyNotificationCountChanged();
    };
    return (
        <PageShell
            title="Thông báo"
            description="Các cập nhật quan trọng về giao dịch và tài khoản."
            actions={
                rows.some((item) => !item.read_at) ? (
                    <GamingButton
                        size="sm"
                        variant="secondary"
                        onClick={readAll}
                    >
                        Đánh dấu tất cả đã đọc
                    </GamingButton>
                ) : null
            }
        >
            <PageSection>
                <AsyncContent
                    loading={loading}
                    error={error}
                    onRetry={reload}
                    empty={!loading && !rows.length}
                    emptyContent={
                        <EmptyState
                            compact
                            title="Chưa có thông báo"
                            description="Các cập nhật mới sẽ xuất hiện tại đây."
                        />
                    }
                >
                    <RecordList
                        className="simple-notification-list"
                        ariaLabel="Danh sách thông báo"
                    >
                        {rows.map((item) => (
                            <RecordListItem
                                key={item.id}
                                unread={!item.read_at}
                            >
                                <div className="simple-notification-list__content">
                                    <div>
                                        <strong>{item.title}</strong>
                                        {!item.read_at ? (
                                            <StatusBadge status="new">
                                                Mới
                                            </StatusBadge>
                                        ) : null}
                                    </div>
                                    <p>{item.message}</p>
                                    <time>{formatTime(item.created_at)}</time>
                                </div>
                                <div className="simple-notification-list__action">
                                    {item.action_url ? (
                                        <Link
                                            to={item.action_url}
                                            onClick={() => read(item)}
                                        >
                                            Xem
                                        </Link>
                                    ) : !item.read_at ? (
                                        <button
                                            type="button"
                                            onClick={() => read(item)}
                                        >
                                            Đã đọc
                                        </button>
                                    ) : null}
                                </div>
                            </RecordListItem>
                        ))}
                    </RecordList>
                </AsyncContent>
            </PageSection>
        </PageShell>
    );
}

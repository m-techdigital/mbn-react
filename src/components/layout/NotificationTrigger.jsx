import { BellOutlined } from "@ant-design/icons";
import { Link } from "react-router";

export default function NotificationTrigger({
    unreadCount = 0,
    className = "",
}) {
    const count = Number(unreadCount || 0);
    return (
        <Link
            to="/account/notifications"
            className={`mbn-notification-trigger ${count > 0 ? "is-unread" : ""} ${className}`.trim()}
            aria-label={count > 0 ? `${count} thông báo chưa đọc` : "Thông báo"}
        >
            <i className="mbn-notification-trigger__bell" aria-hidden="true">
                <BellOutlined />
            </i>
            {count > 0 ? (
                <b className="mbn-notification-trigger__count">
                    {count > 99 ? "99+" : count}
                </b>
            ) : null}
        </Link>
    );
}

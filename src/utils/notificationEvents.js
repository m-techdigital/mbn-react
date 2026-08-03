export const NOTIFICATION_COUNT_CHANGED = "mbn:notification-count-changed";

export const notifyNotificationCountChanged = () => {
    window.dispatchEvent(new CustomEvent(NOTIFICATION_COUNT_CHANGED));
};

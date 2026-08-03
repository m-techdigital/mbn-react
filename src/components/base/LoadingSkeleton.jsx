export function SkeletonBlock({ className = "" }) {
    return (
        <span
            className={`mbn-skeleton ${className}`.trim()}
            aria-hidden="true"
        />
    );
}

export function PageSkeleton({ variant = "list", count = 6 }) {
    if (variant === "profile") {
        return (
            <div
                className="profile-skeleton"
                aria-label="Đang tải hồ sơ khách hàng"
            >
                <section className="profile-skeleton__identity">
                    <div className="profile-skeleton__summary">
                        <SkeletonBlock className="profile-skeleton__avatar" />
                        <div>
                            <SkeletonBlock />
                            <SkeletonBlock />
                        </div>
                    </div>
                    {[0, 1, 2].map((i) => (
                        <div className="profile-skeleton__field" key={i}>
                            <SkeletonBlock />
                            <SkeletonBlock />
                        </div>
                    ))}
                    <SkeletonBlock className="profile-skeleton__button" />
                </section>
                <div className="profile-skeleton__security">
                    {[0, 1].map((section) => (
                        <section key={section}>
                            {[0, 1, 2].slice(0, section ? 3 : 2).map((i) => (
                                <div
                                    className="profile-skeleton__field"
                                    key={i}
                                >
                                    <SkeletonBlock />
                                    <SkeletonBlock />
                                </div>
                            ))}
                            <SkeletonBlock className="profile-skeleton__button" />
                        </section>
                    ))}
                </div>
            </div>
        );
    }
    if (variant === "detail") {
        return (
            <div className="detail-skeleton" aria-label="Đang tải nội dung">
                <div className="detail-skeleton__gallery">
                    <SkeletonBlock className="detail-skeleton__stage" />
                    <div className="detail-skeleton__thumbs">
                        {[0, 1, 2, 3].map((i) => (
                            <SkeletonBlock key={i} />
                        ))}
                    </div>
                </div>
                <div className="detail-skeleton__panel">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <SkeletonBlock key={i} />
                    ))}
                </div>
            </div>
        );
    }
    if (variant === "table") {
        return (
            <div className="table-skeleton" aria-label="Đang tải dữ liệu">
                {Array.from({ length: count }, (_, i) => (
                    <SkeletonBlock key={i} />
                ))}
            </div>
        );
    }
    return (
        <div className="card-skeleton-grid" aria-label="Đang tải danh sách">
            {Array.from({ length: count }, (_, i) => (
                <div className="card-skeleton" key={i}>
                    <SkeletonBlock className="card-skeleton__image" />
                    <SkeletonBlock />
                    <SkeletonBlock />
                    <SkeletonBlock className="card-skeleton__footer" />
                </div>
            ))}
        </div>
    );
}

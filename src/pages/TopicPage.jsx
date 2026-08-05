import { Link, useParams } from "react-router";
import PageShell from "../components/base/PageShell";
import PageSection, { PageStack } from "../components/base/PageSection";
import EmptyState from "../components/base/EmptyState";
import { useRemoteData } from "../hooks/useRemoteData";
import { contentRepository } from "../services/repositories";
import { arrayData } from "../utils/format";

export default function TopicPage() {
    const { slug } = useParams();
    const { data, loading, error, reload } = useRemoteData(
        () =>
            slug
                ? contentRepository.topic(slug)
                : contentRepository.topics({ perPage: 50 }),
        [slug],
        { queryKey: "topics", staleTime: 120000 },
    );

    if (slug) {
        return (
            <PageShell
                title={data?.title || "Bài viết"}
                description={data?.excerpt || data?.description}
                loading={loading}
                loadingVariant="list"
                error={error}
                onReload={reload}
                width="reading"
            >
                {data ? (
                    <PageStack>
                        <PageSection
                            className="mbn-reading-article"
                            tone="reading"
                        >
                            <header className="mbn-reading-article__meta">
                                <span>{data.category || "Hướng dẫn"}</span>
                                <span>{data.reading_time || "5 phút đọc"}</span>
                                <span>
                                    Cập nhật {data.updated_at || "29/07/2026"}
                                </span>
                            </header>
                            <div
                                className="mbn-reading-article__body"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        data.content || data.description || "",
                                }}
                            />
                        </PageSection>
                        <PageSection
                            title="Thông tin liên quan"
                            description="Nội dung hướng dẫn không thay thế điều khoản giao dịch cụ thể, quy định của nhà phát hành hoặc pháp luật hiện hành."
                        >
                            <div className="mbn-related-links">
                                <Link to="/guides">Trung tâm hướng dẫn</Link>
                                <Link to="/policies/tranh-chap-khieu-nai">
                                    Khiếu nại và tranh chấp
                                </Link>
                            </div>
                        </PageSection>
                    </PageStack>
                ) : null}
            </PageShell>
        );
    }

    const items = arrayData(data);
    const featuredGuides = [
        ["/guides/huong-dan-mua-nick", "Hướng dẫn mua tài khoản"],
        [
            "/guides/huong-dan-dang-ban-cho-thue",
            "Hướng dẫn đăng bán và cho thuê",
        ],
        ["/guides/quy-dinh-dat-coc", "Quy định đặt cọc"],
        ["/guides/quy-trinh-thue-nick", "Quy trình thuê tài khoản"],
    ];
    return (
        <PageShell
            title="Bài đăng và cẩm nang"
            description="Hướng dẫn giao dịch, bảo mật, thanh toán và xử lý sự cố."
            loading={loading}
            loadingVariant="list"
            error={error}
            onReload={reload}
            width="wide"
        >
            <div className="mbn-featured-guides">
                {featuredGuides.map(([to, label]) => (
                    <Link key={to} to={to}>
                        {label}
                    </Link>
                ))}
            </div>
            {items.length ? (
                <div className="mbn-topic-grid">
                    {items.map((item, index) => (
                        <Link
                            className="mbn-topic-card"
                            to={`/topics/${item.slug}`}
                            key={item.id}
                        >
                            <span className="mbn-topic-card__index">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <div>
                                <span className="mbn-topic-card__category">
                                    {item.category || "Hướng dẫn"}
                                </span>
                                <h2>{item.title}</h2>
                                <p>{item.excerpt || item.description}</p>
                                <small>
                                    {item.reading_time || "5 phút đọc"} · Cập
                                    nhật {item.updated_at || "29/07/2026"}
                                </small>
                            </div>
                            <b>Đọc bài</b>
                        </Link>
                    ))}
                </div>
            ) : !loading ? (
                <EmptyState
                    title="Chưa có bài viết"
                    description="Nội dung mới sẽ được cập nhật tại đây."
                />
            ) : null}
        </PageShell>
    );
}

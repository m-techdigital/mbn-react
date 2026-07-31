import { SkeletonBlock } from '../base/LoadingSkeleton';

export default function HomeLoadingState() {
  return (
    <main className="home-page home-loading" aria-label="Đang chuẩn bị trang chủ">
      <section className="home-loading__hero"><SkeletonBlock /></section>
      <section className="home-loading__shortcuts">
        {[0, 1, 2, 3].map((item) => (
          <div className="home-loading__shortcut" key={item}>
            <SkeletonBlock className="home-loading__shortcut-icon" />
            <span><SkeletonBlock /><SkeletonBlock /></span>
          </div>
        ))}
      </section>
      <section className="home-loading__services">
        <SkeletonBlock className="home-loading__title" />
        <div className="home-loading__grid">
          {Array.from({ length: 8 }, (_, index) => (
            <div className="home-loading__service" key={index}>
              <SkeletonBlock className="home-loading__service-image" />
              <SkeletonBlock className="home-loading__service-label" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

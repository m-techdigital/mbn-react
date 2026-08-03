import { Link } from "react-router-dom";
import { contentHubGroups } from "../../data/knowledgeBase";
import MarketplaceImage from "../base/MarketplaceImage";

export default function SiteFooter() {
    const groups = contentHubGroups.slice(0, 3);
    return (
        <footer className="site-footer" aria-label="Thông tin và hướng dẫn">
            <div className="site-footer__inner">
                <section className="site-footer__brand">
                    <MarketplaceImage
                        src="/images/logo-purple.png"
                        alt="MuaBanNick.Pro"
                    />
                    <p>
                        Nền tảng hỗ trợ mua, thuê và bàn giao tài khoản trò chơi
                        theo quy trình có theo dõi.
                    </p>
                    <Link to="/support" className="site-footer__support">
                        Liên hệ hỗ trợ
                    </Link>
                </section>
                {groups.map((group) => (
                    <section key={group.title} className="site-footer__column">
                        <h2>{group.title}</h2>
                        <nav>
                            {group.items.slice(0, 5).map(([to, label]) => (
                                <Link key={to} to={to}>
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </section>
                ))}
                <section className="site-footer__column">
                    <h2>Pháp lý và an toàn</h2>
                    <nav>
                        <Link to="/dieu-khoan-va-chinh-sach">
                            Điều khoản và chính sách
                        </Link>
                        <Link to="/policies/an-toan-tai-khoan">
                            An toàn tài khoản
                        </Link>
                        <Link to="/policies/tranh-chap-khieu-nai">
                            Tranh chấp và khiếu nại
                        </Link>
                        <Link to="/policies/hoan-tien-huy-giao-dich">
                            Hoàn tiền và hủy giao dịch
                        </Link>
                    </nav>
                </section>
            </div>
            <div className="site-footer__bottom">
                <span>© 2026 MuaBanNick.Pro</span>
                <span>
                    Không chia sẻ OTP, mật khẩu email hoặc mã khôi phục cho bất
                    kỳ ai.
                </span>
            </div>
        </footer>
    );
}

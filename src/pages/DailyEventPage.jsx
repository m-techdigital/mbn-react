import PageShell from "../components/base/PageShell";
export default function DailyEventPage() {
    return (
        <PageShell
            title="Sự kiện hằng ngày"
            description="Khu vực chương trình cộng đồng và ưu đãi theo thời gian."
        >
            <section className="event-maintenance-card">
                <span>EVENT</span>
                <h2>Sự kiện đang bảo trì</h2>
                <p>
                    Chương trình sẽ chỉ mở khi thể lệ, thời gian, giải thưởng,
                    điều kiện tham gia và cơ chế nhận thưởng được công bố đầy
                    đủ.
                </p>
                <ul>
                    <li>Mỗi chương trình có trang thể lệ riêng.</li>
                    <li>Không yêu cầu người chơi gửi mật khẩu hoặc OTP.</li>
                    <li>
                        Kết quả và lịch sử nhận thưởng phải được lưu trong hệ
                        thống.
                    </li>
                </ul>
            </section>
        </PageShell>
    );
}

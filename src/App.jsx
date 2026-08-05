import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import AppLayout from "./components/layout/AppLayout";
import ContractCompatibilityBanner from "./components/system/ContractCompatibilityBanner";
import RouteBoundary, {
    RouteLoadingFallback,
} from "./components/system/RouteBoundary";

const AccountRouteShell = lazy(() => import("./components/account/AccountRouteShell"));
const HomePage = lazy(() => import("./pages/HomePage"));
const GameListPage = lazy(() => import("./pages/GameListPage"));
const GameDetailPage = lazy(() => import("./pages/GameDetailPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const PurchasesPage = lazy(() => import("./pages/PurchasesPage"));
const PurchaseDetailPage = lazy(() => import("./pages/PurchaseDetailPage"));
const WalletTransactionsPage = lazy(
    () => import("./pages/WalletTransactionsPage"),
);
const TopicPage = lazy(() => import("./pages/TopicPage"));
const StaticPage = lazy(() => import("./pages/StaticPage"));
const KnowledgePage = lazy(() => import("./pages/KnowledgePage"));
const KnowledgeHubPage = lazy(() =>
    import("./pages/KnowledgePage").then((module) => ({
        default: module.KnowledgeHubPage,
    })),
);
const DepositPage = lazy(() => import("./pages/DepositPage"));
const ComingSoonPage = lazy(() => import("./pages/ComingSoonPage"));
const DailyEventPage = lazy(() => import("./pages/DailyEventPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const MyProductsPage = lazy(() => import("./pages/MyProductsPage"));
const ProductFormPage = lazy(() => import("./pages/ProductFormPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const DocumentsPage = lazy(() => import("./pages/DocumentsPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const PayoutPage = lazy(() => import("./pages/PayoutPage"));
const SupportCasesPage = lazy(() => import("./pages/SupportCasesPage"));
const AccountTrustPage = lazy(() => import("./pages/AccountTrustPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const SupportCaseDetailPage = lazy(
    () => import("./pages/SupportCaseDetailPage"),
);

const staticPaths = [
    "/services/giao-dich-trung-gian",
    "/services/mua-ban-xu-ninja-school",
    "/services/nap-luong-carrot",
];
const knowledgePaths = [
    "/guides/huong-dan-mua-nick",
    "/guides/quy-dinh-dat-coc",
    "/guides/quy-dinh-tra-gop",
    "/guides/quy-trinh-thue-nick",
    "/guides/huong-dan-dang-ban-cho-thue",
    "/policies/tranh-chap-khieu-nai",
    "/policies/hoan-tien-huy-giao-dich",
    "/policies/an-toan-tai-khoan",
    "/policies/mien-tru-trach-nhiem-rui-ro",
    "/dieu-khoan-va-chinh-sach",
];

const protectedPage = (Page) => (
    <AccountRouteShell>
        <Page />
    </AccountRouteShell>
);

export default function App() {
    return (
        <RouteBoundary>
            <ContractCompatibilityBanner />
            <Suspense fallback={<RouteLoadingFallback />}>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route index element={<HomePage />} />
                        <Route
                            path="/teamobi/ninja-school"
                            element={<GameListPage />}
                        />
                        <Route
                            path="/teamobi/ninja-school/nick-vip"
                            element={<GameListPage />}
                        />
                        <Route
                            path="/teamobi/ninja-school/nick-gia-re"
                            element={<GameListPage />}
                        />
                        <Route
                            path="/teamobi/ninja-school/:code"
                            element={<GameDetailPage />}
                        />
                        <Route
                            path="/teamobi/ngoc-rong"
                            element={<GameListPage />}
                        />
                        <Route
                            path="/teamobi/ngoc-rong/:code"
                            element={<GameDetailPage />}
                        />
                        <Route
                            path="/teamobi/avatar"
                            element={<GameListPage />}
                        />
                        <Route
                            path="/teamobi/avatar/:code"
                            element={<GameDetailPage />}
                        />
                        <Route
                            path="/garena/lien-quan-mobile"
                            element={<ComingSoonPage />}
                        />
                        <Route
                            path="/g4m/dai-tay-du"
                            element={<ComingSoonPage />}
                        />
                        <Route
                            path="/events/daily"
                            element={<DailyEventPage />}
                        />
                        <Route path="/support" element={<SupportPage />} />
                        <Route path="/topics" element={<TopicPage />} />
                        <Route path="/topics/:slug" element={<TopicPage />} />
                        <Route path="/guides" element={<KnowledgeHubPage />} />
                        {knowledgePaths.map((path) => (
                            <Route
                                key={path}
                                path={path}
                                element={<KnowledgePage />}
                            />
                        ))}
                        {staticPaths.map((path) => (
                            <Route
                                key={path}
                                path={path}
                                element={<StaticPage />}
                            />
                        ))}
                        <Route
                            path="/forgot-password"
                            element={<ForgotPasswordPage />}
                        />
                        <Route
                            path="/reset-password"
                            element={<ResetPasswordPage />}
                        />
                        <Route
                            path="/account/verify-email"
                            element={<VerifyEmailPage />}
                        />
                        <Route
                            path="/account/notifications"
                            element={protectedPage(NotificationsPage)}
                        />
                        <Route
                            path="/account/documents"
                            element={protectedPage(DocumentsPage)}
                        />
                        <Route
                            path="/account/profile"
                            element={protectedPage(ProfilePage)}
                        />
                        <Route
                            path="/account/products"
                            element={protectedPage(MyProductsPage)}
                        />
                        <Route
                            path="/account/products/new"
                            element={protectedPage(ProductFormPage)}
                        />
                        <Route
                            path="/account/purchases"
                            element={protectedPage(PurchasesPage)}
                        />
                        <Route
                            path="/account/transactions"
                            element={protectedPage(PurchasesPage)}
                        />
                        <Route
                            path="/account/transactions/:id"
                            element={protectedPage(PurchaseDetailPage)}
                        />
                        <Route
                            path="/account/purchases/:id"
                            element={protectedPage(PurchaseDetailPage)}
                        />
                        <Route
                            path="/account/wallet/transactions"
                            element={protectedPage(WalletTransactionsPage)}
                        />
                        <Route
                            path="/account/payouts"
                            element={protectedPage(PayoutPage)}
                        />
                        <Route
                            path="/account/cases"
                            element={protectedPage(SupportCasesPage)}
                        />
                        <Route
                            path="/account/cases/:id"
                            element={protectedPage(SupportCaseDetailPage)}
                        />
                        <Route
                            path="/account/trust"
                            element={protectedPage(AccountTrustPage)}
                        />
                        <Route
                            path="/account/wallet/deposit/bank"
                            element={protectedPage(DepositPage)}
                        />
                        <Route
                            path="/account/wallet/deposit/card"
                            element={protectedPage(DepositPage)}
                        />
                        <Route path="/not-found" element={<NotFoundPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Suspense>
        </RouteBoundary>
    );
}

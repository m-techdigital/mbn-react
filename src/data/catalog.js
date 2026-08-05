const REMOTE_MBN_ORIGIN = "https://www.muabannick.pro";

export const REMOTE_MBN_ASSETS = {
    logo: `${REMOTE_MBN_ORIGIN}/files/uploads/images/logo/logo_violet_gradian_min-1707200146.png`,
    hero: `${REMOTE_MBN_ORIGIN}/images/banners/banner_800x294.gif`,
    heroMobile: `${REMOTE_MBN_ORIGIN}/images/banners/banner_muabannick_14_mb.gif`,
    fallback: `${REMOTE_MBN_ORIGIN}/banner.jpg`,
    background: `${REMOTE_MBN_ORIGIN}/images/bg/bg-mbn-violet.png`,
    backgroundMobile: `${REMOTE_MBN_ORIGIN}/images/bg/bg-mbn-violet-mb-min.png`,
    headerTop: `${REMOTE_MBN_ORIGIN}/images/header/bg_top.png`,
    box: `${REMOTE_MBN_ORIGIN}/images/box/box.jpg`,
    ninjaVip: `${REMOTE_MBN_ORIGIN}/images/banners/banner_ninja_vip_min.jpg`,
    ninjaCheap: `${REMOTE_MBN_ORIGIN}/images/banners/banner_ninja_cheap_min.jpg`,
    dragonBall: `${REMOTE_MBN_ORIGIN}/images/banners/banner_nro_min.jpg`,
    avatar: `${REMOTE_MBN_ORIGIN}/images/banners/banner_avatar_min.jpg`,
    lienQuan: `${REMOTE_MBN_ORIGIN}/images/banners/banner-lien-quan-300x224.jpg`,
    intermediary: `${REMOTE_MBN_ORIGIN}/images/banners/gdtg.png`,
    ninjaCoin: `${REMOTE_MBN_ORIGIN}/images/banners/xu-ninja.png`,
    carrot: `${REMOTE_MBN_ORIGIN}/images/banners/carot.png`,
};

export const REMOTE_MBN_BANNER = REMOTE_MBN_ASSETS.fallback;

export const games = [
    {
        key: "ninjas",
        title: "Ninja School Online",
        subtitle: "Nick giá rẻ, nick VIP, mua hoặc thuê",
        path: "/teamobi/ninja-school",
        image: REMOTE_MBN_ASSETS.ninjaVip,
    },
    {
        key: "dragonBalls",
        title: "Ngọc Rồng Online",
        subtitle: "Tài khoản đa máy chủ, nhiều mức sức mạnh",
        path: "/teamobi/ngoc-rong",
        image: REMOTE_MBN_ASSETS.dragonBall,
    },
    {
        key: "avatars",
        title: "Avatar Teamobi",
        subtitle: "Avatar 2X, Diệu Kỳ và tài khoản sưu tầm",
        path: "/teamobi/avatar",
        image: REMOTE_MBN_ASSETS.avatar,
    },
    {
        key: "lienQuanMobile",
        title: "Liên Quân Mobile",
        subtitle: "Tài khoản Garena, tướng và trang phục nổi bật",
        path: "/garena/lien-quan-mobile",
        image: REMOTE_MBN_ASSETS.lienQuan,
    },
];
export const services = [
    {
        title: "Giao dịch trung gian",
        path: "/services/giao-dich-trung-gian",
        image: REMOTE_MBN_ASSETS.intermediary,
    },
    {
        title: "Mua bán xu Ninja",
        path: "/services/mua-ban-xu-ninja-school",
        image: REMOTE_MBN_ASSETS.ninjaCoin,
    },
    {
        title: "Nạp lượng Carrot",
        path: "/services/nap-luong-carrot",
        image: REMOTE_MBN_ASSETS.carrot,
    },
];

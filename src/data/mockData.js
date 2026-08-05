import { REMOTE_MBN_ASSETS } from "./catalog";

const localImages = {
    "ninja-1": REMOTE_MBN_ASSETS.ninjaVip,
    "ninja-2": REMOTE_MBN_ASSETS.ninjaCheap,
    "ninja-3": REMOTE_MBN_ASSETS.hero,
    "dragon-1": REMOTE_MBN_ASSETS.dragonBall,
    "dragon-2": REMOTE_MBN_ASSETS.background,
    "dragon-3": REMOTE_MBN_ASSETS.box,
    "avatar-1": REMOTE_MBN_ASSETS.avatar,
    "avatar-2": REMOTE_MBN_ASSETS.backgroundMobile,
    "avatar-3": REMOTE_MBN_ASSETS.box,
};
const img = (seed) =>
    localImages[String(seed)] ||
    localImages[String(seed).replace(/-2|-3/g, "-1")] ||
    REMOTE_MBN_ASSETS.fallback;

const owners = [
    { id: 11, code: "CUS-0011", name: "Shop MBN", username: "shopmbn" },
    { id: 12, code: "CUS-0012", name: "Minh Ninja", username: "minhninja" },
];

const product = (id, type, name, seed, metadata = {}) => ({
    id,
    code: `PRD-${String(id).padStart(4, "0")}`,
    name,
    product_type: type,
    description: `${name} đã được kiểm tra thông tin và ảnh trước khi đăng.`,
    thumbnail: img(seed),
    images: [img(seed), img(`${seed}-2`), img(`${seed}-3`)],
    metadata,
});

const baseMockProducts = [
    {
        id: 101,
        code: "NSO-0101",
        offer_modes: ["sell"],
        sale_enabled: true,
        rental_enabled: false,
        status: "published",
        name: "Ninja VIP 16x - Full đồ 12",
        description: "Nick VIP, hành trang đẹp, phù hợp chơi lâu dài.",
        sale_price: 1450000,
        original_price: 1700000,
        active_discount: 15,
        server: "Tone",
        level: "166",
        owner: owners[0],
        product: product(1, "ninja_school", "Ninja VIP 16x", "ninja-1", {
            server: "Tone",
            level: "166",
        }),
    },
    {
        id: 102,
        code: "NSO-0102",
        offer_modes: ["rent"],
        rental_enabled: true,
        sale_enabled: false,
        status: "published",
        name: "Ninja 15x cho thuê theo tuần",
        description: "Cho thuê cày sự kiện, cọc minh bạch, hỗ trợ bàn giao.",
        rental_price: 220000,
        rental_price_unit: "week",
        deposit_amount: 800000,
        server: "Bokken",
        level: "154",
        owner: owners[1],
        product: product(2, "ninja_school", "Ninja 15x cho thuê", "ninja-2", {
            server: "Bokken",
            level: "154",
        }),
    },
    {
        id: 103,
        code: "NSO-0103",
        offer_modes: ["sell"],
        sale_enabled: true,
        rental_enabled: false,
        status: "published",
        name: "Ninja giá rẻ 13x",
        description: "Nick sạch, có set cơ bản, đổi thông tin nhanh.",
        sale_price: 490000,
        original_price: 550000,
        active_discount: 11,
        server: "Sanzu",
        level: "138",
        owner: owners[0],
        product: product(3, "ninja_school", "Ninja giá rẻ 13x", "ninja-3", {
            server: "Sanzu",
            level: "138",
        }),
    },
    {
        id: 201,
        code: "NRO-0201",
        offer_modes: ["sell"],
        sale_enabled: true,
        rental_enabled: false,
        status: "published",
        name: "Ngọc Rồng sức mạnh 80 tỷ",
        description: "Set kích hoạt, đệ tử ổn định, thông tin chính chủ.",
        sale_price: 980000,
        original_price: 1150000,
        active_discount: 15,
        server: "Vũ trụ 2",
        level: "80 tỷ",
        owner: owners[0],
        product: product(4, "dragon_ball", "Ngọc Rồng 80 tỷ", "dragon-1", {
            server: "Vũ trụ 2",
            level: "80 tỷ",
        }),
    },
    {
        id: 202,
        code: "NRO-0202",
        offer_modes: ["rent"],
        rental_enabled: true,
        sale_enabled: false,
        status: "published",
        name: "Ngọc Rồng thuê săn boss",
        description: "Thuê theo ngày, bàn giao nhanh, có hỗ trợ kỹ thuật.",
        rental_price: 90000,
        rental_price_unit: "day",
        deposit_amount: 500000,
        server: "Vũ trụ 6",
        level: "65 tỷ",
        owner: owners[1],
        product: product(
            5,
            "dragon_ball",
            "Ngọc Rồng thuê săn boss",
            "dragon-2",
            { server: "Vũ trụ 6", level: "65 tỷ" },
        ),
    },
    {
        id: 301,
        code: "AVA-0301",
        offer_modes: ["sell"],
        sale_enabled: true,
        rental_enabled: false,
        status: "published",
        name: "Avatar 2X nhiều đồ hiếm",
        description: "Kho đồ phong phú, tài khoản lâu năm, đổi mail được.",
        sale_price: 760000,
        server: "Avatar 2X",
        level: "55",
        owner: owners[0],
        product: product(6, "avatar", "Avatar 2X đồ hiếm", "avatar-1", {
            server: "Avatar 2X",
            level: "55",
        }),
    },
    {
        id: 302,
        code: "AVA-0302",
        offer_modes: ["sell"],
        sale_enabled: true,
        rental_enabled: false,
        status: "published",
        name: "Avatar Diệu Kỳ full set",
        description: "Set thời trang đẹp, nhiều vật phẩm sự kiện.",
        sale_price: 1250000,
        original_price: 1400000,
        active_discount: 10,
        server: "Diệu Kỳ",
        level: "61",
        owner: owners[1],
        product: product(7, "avatar", "Avatar Diệu Kỳ full set", "avatar-2", {
            server: "Diệu Kỳ",
            level: "61",
        }),
    },
];

const cloneProduct = (source, index) => ({
    ...source,
    id: Number(`${source.id}${index}`),
    code: `${source.code.split("-")[0]}-${String(Number(source.code.split("-")[1]) + index).padStart(4, "0")}`,
    name: `${source.name} #${index + 1}`,
    sale_price: source.sale_price
        ? source.sale_price + index * 70000
        : undefined,
    rental_price: source.rental_price
        ? source.rental_price + index * 15000
        : undefined,
    original_price: source.original_price
        ? source.original_price + index * 80000
        : undefined,
    level:
        source.level && !String(source.level).includes("tỷ")
            ? String(Number.parseInt(source.level, 10) + index * 3)
            : source.level,
    product: {
        ...source.product,
        id: Number(`${source.product.id}${index}`),
        name: `${source.product.name} #${index + 1}`,
    },
});

export const mockProducts = baseMockProducts.flatMap((listing) => [
    listing,
    cloneProduct(listing, 1),
    cloneProduct(listing, 2),
]);


export const mockTransactions = [
    {
        id: 9001,
        code: "TRX-9001",
        transaction_type: "purchase",
        total_payable: 1450000,
        status: "completed",
        product: mockProducts[0].product,
        seller: owners[0],
        created_at: "2026-07-25 10:30",
    },
    {
        id: 9002,
        code: "TRX-9002",
        transaction_type: "rental",
        total_payable: 1020000,
        status: "active",
        product: mockProducts[1].product,
        seller: owners[1],
        created_at: "2026-07-28 08:15",
    },
];

export const mockWalletTransactions = [
    {
        id: "WAL-101",
        description: "Nạp tiền qua ngân hàng",
        amount: 2000000,
        direction: "in",
        status: "completed",
        created_at: "2026-07-28 08:00",
    },
    {
        id: "WAL-102",
        description: "Thanh toán giao dịch TRX-9002",
        amount: 1020000,
        direction: "out",
        status: "completed",
        created_at: "2026-07-28 08:16",
    },
    {
        id: "WAL-103",
        description: "Hoàn ưu đãi nạp ATM/MOMO",
        amount: 200000,
        direction: "in",
        status: "completed",
        created_at: "2026-07-28 08:17",
    },
];

export const mockNotification = {
    name: "Thông báo từ MuaBanNick.Pro",
    items: [
        "Khuyến mãi giảm giá một số nick được đánh dấu trong tuần này.",
        "Hỗ trợ trả góp, đặt cọc nick và thuê tài khoản theo thời hạn.",
        "Nạp thẻ và mua nick tự động không áp dụng chiết khấu.",
        "Nạp tiền qua ATM hoặc MOMO có thể nhận ưu đãi theo chương trình hiện hành.",
    ],
};

export const mockServices = {
    carrots: [
        { id: 1, name: "Gói 100 lượng", price: 120000 },
        { id: 2, name: "Gói 500 lượng", price: 550000 },
    ],
    ninjaCoins: [
        { id: 1, name: "100 triệu xu", price: 85000 },
        { id: 2, name: "500 triệu xu", price: 400000 },
    ],
};

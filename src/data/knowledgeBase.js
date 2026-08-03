const routeGroups = new Map([
    ["/guides/huong-dan-mua-nick", 1],
    ["/guides/quy-dinh-tra-gop", 1],
    ["/guides/quy-dinh-dat-coc", 1],
    ["/guides/quy-trinh-thue-nick", 1],
    ["/guides/huong-dan-dang-ban-cho-thue", 2],
    ["/policies/tranh-chap-khieu-nai", 2],
    ["/policies/hoan-tien-huy-giao-dich", 2],
    ["/policies/an-toan-tai-khoan", 3],
    ["/policies/mien-tru-trach-nhiem-rui-ro", 3],
    ["/dieu-khoan-va-chinh-sach", 3],
]);

const groupLoaders = {
    1: () => import("./knowledge/knowledgeGroup1.js"),
    2: () => import("./knowledge/knowledgeGroup2.js"),
    3: () => import("./knowledge/knowledgeGroup3.js"),
};

export async function loadKnowledgePage(pathname) {
    const group = routeGroups.get(pathname);
    if (!group) return null;

    const module = await groupLoaders[group]();
    return module.knowledgePages[pathname] ?? null;
}

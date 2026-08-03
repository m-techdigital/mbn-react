export const sources = {
    consumerLaw: "https://vanban.chinhphu.vn/?docid=208363&pageid=27160",
    consumerDecree: "https://vanban.chinhphu.vn/?docid=210254&pageid=27160",
    eCommerce:
        "https://moit.gov.vn/tin-tuc/thong-bao/sua-doi-bo-sung-mot-so-quy-dinh-ve-thuong-mai-dien-tu.html",
    onlineGov: "https://online.gov.vn/Bieu-Mau",
    garenaTerms: "https://caithe.garena.vn/dieu-khoan-dich-vu/",
    garenaSharing:
        "https://lienquan.garena.vn/thong-bao-cap-nhat-quy-dinh-xu-phat-va-bo-tieu-chuan-tu-cach-vdv-chuyen-nghiep-cua-lien-quan-mobile/",
    scamResponse:
        "https://special.nhandan.vn/phai-lam-gi-khi-bi-lua-dao-truc-tuyen/index.html",
    personalData: "https://vanban.chinhphu.vn/?docid=207759&pageid=27160",
};

export const sourceList = (items) =>
    `<section class="topic-source-box"><h2>Nguồn tham khảo</h2><ul>${items.map(([label, href]) => `<li><a href="${href}" target="_blank" rel="noreferrer">${label}</a></li>`).join("")}</ul><p>Nội dung trên MBN là hướng dẫn vận hành và thông tin tham khảo. Điều khoản cụ thể của từng giao dịch, nhà phát hành và quy định pháp luật hiện hành luôn được ưu tiên.</p></section>`;

export const article = ({
    intro,
    toc,
    sections,
    checklist = [],
    warning = "",
    sources: articleSources = [],
}) => `
  <div class="topic-lead">${intro}</div>
  ${checklist.length ? `<section class="topic-checklist"><h2>Danh sách kiểm tra nhanh</h2><ul>${checklist.map((item) => `<li>${item}</li>`).join("")}</ul></section>` : ""}
  <nav class="topic-toc"><strong>Nội dung bài viết</strong><ol>${toc.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join("")}</ol></nav>
  ${sections.join("")}
  ${warning ? `<aside class="topic-warning"><strong>Lưu ý quan trọng</strong><p>${warning}</p></aside>` : ""}
  ${articleSources.length ? sourceList(articleSources) : ""}
`;

export const section = (id, title, body) =>
    `<section id="${id}" class="topic-section"><h2>${title}</h2>${body}</section>`;
export const steps = (items) =>
    `<ol class="topic-steps">${items.map((item, index) => `<li><b>${index + 1}</b><div><strong>${item.title}</strong><p>${item.body}</p></div></li>`).join("")}</ol>`;
export const bullets = (items) =>
    `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
export const table = (rows) =>
    `<div class="topic-table">${rows.map(([label, value]) => `<div><span>${label}</span><b>${value}</b></div>`).join("")}</div>`;

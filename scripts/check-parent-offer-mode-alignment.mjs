import fs from "node:fs";
import { normalizeOfferMode } from "../src/utils/offerModes.js";

const form = fs.readFileSync("src/pages/ProductFormPage.jsx", "utf8");
const detail = fs.readFileSync("src/pages/GameDetailPage.jsx", "utf8");
const mine = fs.readFileSync("src/pages/MyProductsPage.jsx", "utf8");
if (!form.includes("offer_modes"))
    throw new Error("Product form chưa gửi offer_modes");
if (!form.includes("installment_enabled"))
    throw new Error("Trả góp chưa tách khỏi offer_modes");
if (form.includes("offer_modes.includes('installment')"))
    throw new Error("Trả góp vẫn bị coi là offer mode");
if (!detail.includes("normalizeOfferMode"))
    throw new Error("Public detail chưa chuẩn hóa offer mode");
if (
    normalizeOfferMode("sell") !== "sale" ||
    normalizeOfferMode({ code: "sell" }) !== "sale" ||
    normalizeOfferMode("rent") !== "rental" ||
    normalizeOfferMode({ value: "rent" }) !== "rental"
) {
    throw new Error("Public detail chưa map sell/rent sang sale/rental");
}
if (!mine.includes("offer_modes"))
    throw new Error("My Products chưa hiển thị offer_modes");
console.log("MBN parent offer-mode alignment passed.");

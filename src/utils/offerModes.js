export const normalizeOfferMode = (mode) => {
    const code = typeof mode === "object" ? mode?.code || mode?.value : mode;

    if (code === "sell") return "sale";
    if (code === "rent") return "rental";

    return code;
};

import { useState } from "react";
import { useNavigate } from "react-router";
import { mediaRepository, productRepository } from "../../services/repositories";
import { getUserFacingError } from "../../utils/userFacingError";

const initialRate = {
    label: "1 ngày",
    period_unit: "day",
    period_count: 1,
    price: "",
    deposit_amount: "",
    is_default: true,
    is_active: true,
};

const initialProductForm = {
    name: "",
    product_type: "game_account",
    game_code: "ninja_school",
    server_name: "",
    level: "",
    description: "",
    image_url: "",
    image_urls: [],
    offer_modes: ["sell"],
    installment_enabled: false,
    sale_price: "",
    sale_deposit_amount: 0,
    rental_price: "",
    rental_price_unit: "day",
    minimum_rental_period: 1,
    rental_billing_mode: "upfront",
    rental_billing_cycle_unit: "day",
    rental_billing_cycle_count: 1,
    rental_deposit_amount: 0,
    max_installment_count: 3,
    minimum_initial_payment: 0,
    installment_interval_unit: "week",
    installment_interval_count: 1,
    rental_rates: [initialRate],
};

const buildProductPayload = (data) => ({
    name: data.name,
    product_type: data.product_type,
    game_code: data.game_code,
    server_name: data.server_name || null,
    level: data.level === "" ? null : Number(data.level),
    description: data.description,
    image_url: data.image_url || null,
    image_urls: data.image_urls,
    status: "active",
    offer_modes: data.offer_modes,
    sale_price: data.offer_modes.includes("sell") ? Number(data.sale_price) : null,
    sale_deposit_amount: data.offer_modes.includes("sell") ? Number(data.sale_deposit_amount || 0) : 0,
    rental_price: data.offer_modes.includes("rent")
        ? Number(data.rental_price || data.rental_rates[0]?.price || 0)
        : null,
    rental_price_unit: data.offer_modes.includes("rent") ? data.rental_price_unit : null,
    minimum_rental_period: data.offer_modes.includes("rent") ? Number(data.minimum_rental_period) : null,
    rental_period_unit: data.offer_modes.includes("rent") ? data.rental_price_unit : null,
    rental_billing_mode: data.offer_modes.includes("rent") ? data.rental_billing_mode : null,
    rental_billing_cycle_unit: data.offer_modes.includes("rent") ? data.rental_billing_cycle_unit : null,
    rental_billing_cycle_count: data.offer_modes.includes("rent") ? Number(data.rental_billing_cycle_count) : null,
    rental_deposit_amount: data.offer_modes.includes("rent") ? Number(data.rental_deposit_amount || 0) : 0,
    rental_rates: data.offer_modes.includes("rent")
        ? data.rental_rates.map((rate, index) => ({
              ...rate,
              period_count: Number(rate.period_count),
              price: Number(rate.price),
              deposit_amount: rate.deposit_amount === "" ? null : Number(rate.deposit_amount),
              is_default: index === 0,
              is_active: true,
          }))
        : [],
    max_installment_count: data.installment_enabled ? Number(data.max_installment_count) : null,
    installment_enabled: data.installment_enabled,
    minimum_initial_payment: data.installment_enabled ? Number(data.minimum_initial_payment) : null,
    installment_interval_unit: data.installment_interval_unit,
    installment_interval_count: Number(data.installment_interval_count || 1),
});

export function useProductForm() {
    const [data, setData] = useState(initialProductForm);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const update = (name, value) => setData((current) => ({ ...current, [name]: value }));

    const toggleType = (type) => {
        setData((current) => {
            if (type === "installment") {
                const enabled = !current.installment_enabled;
                return {
                    ...current,
                    installment_enabled: enabled,
                    offer_modes: enabled && !current.offer_modes.includes("sell")
                        ? [...current.offer_modes, "sell"]
                        : current.offer_modes,
                };
            }
            const hasType = current.offer_modes.includes(type);
            return {
                ...current,
                offer_modes: hasType
                    ? current.offer_modes.filter((item) => item !== type)
                    : [...current.offer_modes, type],
                installment_enabled: type === "sell" && hasType ? false : current.installment_enabled,
            };
        });
    };

    const updateRate = (index, name, value) => setData((current) => ({
        ...current,
        rental_rates: current.rental_rates.map((rate, rateIndex) =>
            rateIndex === index ? { ...rate, [name]: value } : rate,
        ),
    }));

    const addRate = () => setData((current) => ({
        ...current,
        rental_rates: [
            ...current.rental_rates,
            { ...initialRate, label: `Gói ${current.rental_rates.length + 1}`, is_default: false },
        ],
    }));

    const removeRate = (index) => setData((current) => ({
        ...current,
        rental_rates: current.rental_rates
            .filter((_, rateIndex) => rateIndex !== index)
            .map((rate, rateIndex) => ({ ...rate, is_default: rateIndex === 0 })),
    }));

    const removeImage = (index) => setData((current) => {
        const images = current.image_urls.filter((_, imageIndex) => imageIndex !== index);
        return { ...current, image_urls: images, image_url: images[0] || "" };
    });

    const uploadImages = async (event) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;
        setUploading(true);
        setUploadProgress(0);
        setError("");
        try {
            const uploaded = await mediaRepository.uploadImages(files, setUploadProgress);
            const urls = (uploaded || []).map((item) => item.url);
            setData((current) => ({
                ...current,
                image_url: current.image_url || urls[0] || "",
                image_urls: [...(current.image_urls || []), ...urls].slice(0, 8),
            }));
        } catch (uploadError) {
            setError(getUserFacingError(uploadError, "Không thể tải ảnh lên. Vui lòng kiểm tra định dạng và dung lượng ảnh."));
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (!data.offer_modes.length) throw new Error("Vui lòng chọn ít nhất một loại giao dịch.");
            await productRepository.create(buildProductPayload(data));
            navigate("/account/products");
        } catch (requestError) {
            setError(getUserFacingError(requestError, "Không thể tạo sản phẩm."));
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        uploading,
        uploadProgress,
        error,
        update,
        toggleType,
        updateRate,
        addRate,
        removeRate,
        removeImage,
        uploadImages,
        submit,
        cancel: () => navigate("/account/products"),
    };
}

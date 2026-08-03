import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BaseForm, {
    BaseFormActions,
    BaseFormGrid,
    BaseFormSection,
} from "../components/base/BaseForm";
import BaseChoice from "../components/base/BaseChoice";
import FormField from "../components/base/FormField";
import {
    BaseInput,
    BaseSelect,
    BaseTextarea,
} from "../components/base/FormControls";
import GamingButton from "../components/base/GamingButton";
import InlineNotice from "../components/base/InlineNotice";
import MoneyInput from "../components/base/MoneyInput";
import MultiImageUploadField from "../components/base/MultiImageUploadField";
import PageShell from "../components/base/PageShell";
import { mediaRepository, productRepository } from "../services/repositories";
import { getUserFacingError } from "../utils/userFacingError";

const initialRate = {
    label: "1 ngày",
    period_unit: "day",
    period_count: 1,
    price: "",
    deposit_amount: "",
    is_default: true,
    is_active: true,
};

const initial = {
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

export default function ProductFormPage() {
    const [data, setData] = useState(initial);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const update = (name, value) =>
        setData((current) => ({ ...current, [name]: value }));

    const toggleType = (type) => {
        setData((current) => {
            if (type === "installment") {
                const enabled = !current.installment_enabled;
                return {
                    ...current,
                    installment_enabled: enabled,
                    offer_modes:
                        enabled && !current.offer_modes.includes("sell")
                            ? [...current.offer_modes, "sell"]
                            : current.offer_modes,
                };
            }

            const hasType = current.offer_modes.includes(type);
            const offerModes = hasType
                ? current.offer_modes.filter((item) => item !== type)
                : [...current.offer_modes, type];

            return {
                ...current,
                offer_modes: offerModes,
                installment_enabled:
                    type === "sell" && hasType
                        ? false
                        : current.installment_enabled,
            };
        });
    };

    const updateRate = (index, name, value) =>
        setData((current) => ({
            ...current,
            rental_rates: current.rental_rates.map((rate, rateIndex) =>
                rateIndex === index ? { ...rate, [name]: value } : rate,
            ),
        }));

    const addRate = () =>
        setData((current) => ({
            ...current,
            rental_rates: [
                ...current.rental_rates,
                {
                    ...initialRate,
                    label: `Gói ${current.rental_rates.length + 1}`,
                    is_default: false,
                },
            ],
        }));

    const removeRate = (index) =>
        setData((current) => ({
            ...current,
            rental_rates: current.rental_rates
                .filter((_, rateIndex) => rateIndex !== index)
                .map((rate, rateIndex) => ({
                    ...rate,
                    is_default: rateIndex === 0,
                })),
        }));

    const uploadImages = async (event) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;

        setUploading(true);
        setUploadProgress(0);
        setError("");

        try {
            const uploaded = await mediaRepository.uploadImages(
                files,
                setUploadProgress,
            );
            const urls = (uploaded || []).map((item) => item.url);
            setData((current) => ({
                ...current,
                image_url: current.image_url || urls[0] || "",
                image_urls: [...(current.image_urls || []), ...urls].slice(
                    0,
                    8,
                ),
            }));
        } catch (uploadError) {
            setError(
                getUserFacingError(
                    uploadError,
                    "Không thể tải ảnh lên. Vui lòng kiểm tra định dạng và dung lượng ảnh.",
                ),
            );
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
            if (!data.offer_modes.length) {
                throw new Error("Vui lòng chọn ít nhất một loại giao dịch.");
            }

            await productRepository.create({
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
                sale_price: data.offer_modes.includes("sell")
                    ? Number(data.sale_price)
                    : null,
                sale_deposit_amount: data.offer_modes.includes("sell")
                    ? Number(data.sale_deposit_amount || 0)
                    : 0,
                rental_price: data.offer_modes.includes("rent")
                    ? Number(
                          data.rental_price || data.rental_rates[0]?.price || 0,
                      )
                    : null,
                rental_price_unit: data.offer_modes.includes("rent")
                    ? data.rental_price_unit
                    : null,
                minimum_rental_period: data.offer_modes.includes("rent")
                    ? Number(data.minimum_rental_period)
                    : null,
                rental_period_unit: data.offer_modes.includes("rent")
                    ? data.rental_price_unit
                    : null,
                rental_billing_mode: data.offer_modes.includes("rent")
                    ? data.rental_billing_mode
                    : null,
                rental_billing_cycle_unit: data.offer_modes.includes("rent")
                    ? data.rental_billing_cycle_unit
                    : null,
                rental_billing_cycle_count: data.offer_modes.includes("rent")
                    ? Number(data.rental_billing_cycle_count)
                    : null,
                rental_deposit_amount: data.offer_modes.includes("rent")
                    ? Number(data.rental_deposit_amount || 0)
                    : 0,
                rental_rates: data.offer_modes.includes("rent")
                    ? data.rental_rates.map((rate, index) => ({
                          ...rate,
                          period_count: Number(rate.period_count),
                          price: Number(rate.price),
                          deposit_amount:
                              rate.deposit_amount === ""
                                  ? null
                                  : Number(rate.deposit_amount),
                          is_default: index === 0,
                          is_active: true,
                      }))
                    : [],
                max_installment_count: data.installment_enabled
                    ? Number(data.max_installment_count)
                    : null,
                installment_enabled: data.installment_enabled,
                minimum_initial_payment: data.installment_enabled
                    ? Number(data.minimum_initial_payment)
                    : null,
                installment_interval_unit: data.installment_interval_unit,
                installment_interval_count: Number(
                    data.installment_interval_count || 1,
                ),
            });

            navigate("/account/products");
        } catch (requestError) {
            setError(
                getUserFacingError(requestError, "Không thể tạo sản phẩm."),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageShell
            title="Đăng sản phẩm"
            description="Một sản phẩm có thể đồng thời hỗ trợ bán, cho thuê và trả góp."
        >
            <BaseForm className="seller-form" onSubmit={submit}>
                {error ? (
                    <InlineNotice type="error" title="Không thể lưu sản phẩm">
                        {error}
                    </InlineNotice>
                ) : null}

                <BaseFormSection
                    title="Thông tin sản phẩm"
                    description="Danh sách sản phẩm được phân biệt theo Trò chơi và Loại sản phẩm."
                >
                    <BaseFormGrid>
                        <FormField label="Tên sản phẩm" required>
                            <BaseInput
                                value={data.name}
                                onChange={(event) =>
                                    update("name", event.target.value)
                                }
                                required
                            />
                        </FormField>
                        <FormField label="Trò chơi" required>
                            <BaseSelect
                                value={data.game_code}
                                onChange={(event) =>
                                    update("game_code", event.target.value)
                                }
                            >
                                <option value="ninja_school">
                                    Ninja School
                                </option>
                                <option value="dragon_ball">Ngọc Rồng</option>
                                <option value="avatar">Avatar</option>
                            </BaseSelect>
                        </FormField>
                        <FormField label="Loại sản phẩm" required>
                            <BaseSelect
                                value={data.product_type}
                                onChange={(event) =>
                                    update("product_type", event.target.value)
                                }
                            >
                                <option value="game_account">
                                    Tài khoản trò chơi
                                </option>
                                <option value="item">Vật phẩm</option>
                                <option value="currency">
                                    Tiền tệ trong game
                                </option>
                                <option value="service">Dịch vụ</option>
                            </BaseSelect>
                        </FormField>
                        <FormField label="Máy chủ">
                            <BaseInput
                                value={data.server_name}
                                onChange={(event) =>
                                    update("server_name", event.target.value)
                                }
                            />
                        </FormField>
                        <FormField label="Cấp độ">
                            <BaseInput
                                type="number"
                                min="0"
                                value={data.level}
                                onChange={(event) =>
                                    update("level", event.target.value)
                                }
                            />
                        </FormField>
                        <FormField label="Mô tả" required className="is-wide">
                            <BaseTextarea
                                rows="5"
                                value={data.description}
                                onChange={(event) =>
                                    update("description", event.target.value)
                                }
                                required
                            />
                        </FormField>
                    </BaseFormGrid>
                    <MultiImageUploadField
                        label="Ảnh sản phẩm"
                        hint="Tải tối đa 8 ảnh JPG, PNG, WEBP hoặc GIF; mỗi ảnh không quá 5 MB."
                        images={data.image_urls || []}
                        loading={uploading}
                        progress={uploadProgress}
                        onChange={uploadImages}
                        onRemove={(index) =>
                            setData((current) => {
                                const images = current.image_urls.filter(
                                    (_, imageIndex) => imageIndex !== index,
                                );
                                return {
                                    ...current,
                                    image_urls: images,
                                    image_url: images[0] || "",
                                };
                            })
                        }
                    />
                </BaseFormSection>

                <BaseFormSection
                    title="Loại giao dịch"
                    description="Có thể bật đồng thời nhiều loại cho cùng một sản phẩm."
                >
                    <BaseChoice
                        label="Bán"
                        description="Cho phép khách hàng mua đứt sản phẩm."
                        checked={data.offer_modes.includes("sell")}
                        onChange={() => toggleType("sell")}
                    />
                    <BaseChoice
                        label="Cho thuê"
                        description="Cho phép khách hàng thuê sản phẩm theo kỳ hạn."
                        checked={data.offer_modes.includes("rent")}
                        onChange={() => toggleType("rent")}
                    />
                    <BaseChoice
                        label="Trả góp"
                        description="Là phương thức thanh toán của giao dịch bán."
                        checked={data.installment_enabled}
                        onChange={() => toggleType("installment")}
                    />
                </BaseFormSection>

                {data.offer_modes.includes("sell") ? (
                    <BaseFormSection title="Điều kiện bán">
                        <BaseFormGrid>
                            <FormField label="Giá bán" required>
                                <MoneyInput
                                    value={data.sale_price}
                                    min={0}
                                    onChange={(value) =>
                                        update("sale_price", value)
                                    }
                                />
                            </FormField>
                            <FormField label="Tiền cọc khi bán">
                                <MoneyInput
                                    value={data.sale_deposit_amount}
                                    min={0}
                                    onChange={(value) =>
                                        update("sale_deposit_amount", value)
                                    }
                                />
                            </FormField>
                        </BaseFormGrid>
                    </BaseFormSection>
                ) : null}

                {data.installment_enabled ? (
                    <BaseFormSection title="Điều kiện trả góp">
                        <BaseFormGrid>
                            <FormField label="Số kỳ tối đa">
                                <BaseInput
                                    type="number"
                                    min="2"
                                    max="12"
                                    value={data.max_installment_count}
                                    onChange={(event) =>
                                        update(
                                            "max_installment_count",
                                            event.target.value,
                                        )
                                    }
                                />
                            </FormField>
                            <FormField label="Thanh toán ban đầu tối thiểu">
                                <MoneyInput
                                    value={data.minimum_initial_payment}
                                    min={0}
                                    onChange={(value) =>
                                        update("minimum_initial_payment", value)
                                    }
                                />
                            </FormField>
                            <FormField label="Chu kỳ trả góp">
                                <BaseSelect
                                    value={data.installment_interval_unit}
                                    onChange={(event) =>
                                        update(
                                            "installment_interval_unit",
                                            event.target.value,
                                        )
                                    }
                                >
                                    <option value="day">Ngày</option>
                                    <option value="week">Tuần</option>
                                    <option value="month">Tháng</option>
                                </BaseSelect>
                            </FormField>
                        </BaseFormGrid>
                    </BaseFormSection>
                ) : null}

                {data.offer_modes.includes("rent") ? (
                    <>
                        <BaseFormSection title="Điều kiện cho thuê">
                            <BaseFormGrid>
                                <FormField label="Giá thuê mặc định" required>
                                    <MoneyInput
                                        value={data.rental_price}
                                        min={0}
                                        onChange={(value) =>
                                            update("rental_price", value)
                                        }
                                    />
                                </FormField>
                                <FormField label="Đơn vị thuê">
                                    <BaseSelect
                                        value={data.rental_price_unit}
                                        onChange={(event) =>
                                            update(
                                                "rental_price_unit",
                                                event.target.value,
                                            )
                                        }
                                    >
                                        <option value="hour">Giờ</option>
                                        <option value="day">Ngày</option>
                                        <option value="week">Tuần</option>
                                        <option value="month">Tháng</option>
                                    </BaseSelect>
                                </FormField>
                                <FormField label="Tiền cọc thuê">
                                    <MoneyInput
                                        value={data.rental_deposit_amount}
                                        min={0}
                                        onChange={(value) =>
                                            update(
                                                "rental_deposit_amount",
                                                value,
                                            )
                                        }
                                    />
                                </FormField>
                            </BaseFormGrid>
                        </BaseFormSection>
                        <BaseFormSection
                            title="Các gói kỳ hạn thuê"
                            actions={
                                <GamingButton
                                    type="button"
                                    size="sm"
                                    onClick={addRate}
                                >
                                    Thêm gói thuê
                                </GamingButton>
                            }
                        >
                            <div className="rental-rate-editor__rows">
                                {data.rental_rates.map((rate, index) => (
                                    <div
                                        className="rental-rate-row"
                                        key={index}
                                    >
                                        <FormField label="Tên gói" required>
                                            <BaseInput
                                                value={rate.label}
                                                onChange={(event) =>
                                                    updateRate(
                                                        index,
                                                        "label",
                                                        event.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </FormField>
                                        <FormField label="Số kỳ" required>
                                            <BaseInput
                                                type="number"
                                                min="1"
                                                value={rate.period_count}
                                                onChange={(event) =>
                                                    updateRate(
                                                        index,
                                                        "period_count",
                                                        event.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </FormField>
                                        <FormField label="Đơn vị">
                                            <BaseSelect
                                                value={rate.period_unit}
                                                onChange={(event) =>
                                                    updateRate(
                                                        index,
                                                        "period_unit",
                                                        event.target.value,
                                                    )
                                                }
                                            >
                                                <option value="hour">
                                                    Giờ
                                                </option>
                                                <option value="day">
                                                    Ngày
                                                </option>
                                                <option value="week">
                                                    Tuần
                                                </option>
                                                <option value="month">
                                                    Tháng
                                                </option>
                                            </BaseSelect>
                                        </FormField>
                                        <FormField label="Giá thuê" required>
                                            <MoneyInput
                                                value={rate.price}
                                                min={0}
                                                onChange={(value) =>
                                                    updateRate(
                                                        index,
                                                        "price",
                                                        value,
                                                    )
                                                }
                                            />
                                        </FormField>
                                        <GamingButton
                                            type="button"
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeRate(index)}
                                            disabled={
                                                data.rental_rates.length === 1
                                            }
                                        >
                                            Xóa
                                        </GamingButton>
                                    </div>
                                ))}
                            </div>
                        </BaseFormSection>
                    </>
                ) : null}

                <BaseFormActions>
                    <GamingButton
                        type="button"
                        variant="secondary"
                        onClick={() => navigate("/account/products")}
                    >
                        Hủy
                    </GamingButton>
                    <GamingButton
                        type="submit"
                        variant="primary"
                        loading={loading}
                    >
                        Gửi duyệt sản phẩm
                    </GamingButton>
                </BaseFormActions>
            </BaseForm>
        </PageShell>
    );
}

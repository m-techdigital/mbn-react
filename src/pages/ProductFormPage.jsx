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
import { useProductForm } from "../hooks/marketplace/useProductForm";

export default function ProductFormPage() {
    const {
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
        cancel,
    } = useProductForm();

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
                        onRemove={removeImage}
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
                        onClick={cancel}
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

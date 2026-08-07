import { BaseFormGrid, BaseFormSection } from "../base/BaseForm";
import {
    BaseInput,
    BaseSelect,
    BaseTextarea,
} from "../base/FormControls";
import FormField from "../base/FormField";
import MoneyInput from "../base/MoneyInput";

const deliveryMethods = [
    ["email_transfer", "Chuyển quyền qua email"],
    ["account_credentials", "Bàn giao quyền truy cập"],
    ["in_game_trade", "Giao dịch trực tiếp trong game"],
    ["redeem_code", "Mã kích hoạt"],
    ["admin_observed", "Admin giám sát"],
    ["other", "Phương thức khác"],
];

export default function EscrowBoxAssetFields({
    asset,
    fieldPrefix,
    title,
    errors,
    onChange,
}) {
    const error = (name) => errors?.[`${fieldPrefix}.${name}`];

    return (
        <BaseFormSection title={title}>
            <BaseFormGrid>
                <FormField
                    label="Loại tài sản"
                    required
                    error={error("type")}
                >
                    <BaseSelect
                        value={asset.type}
                        onChange={(event) => onChange("type", event.target.value)}
                    >
                        <option value="game_account">Tài khoản game</option>
                        <option value="item">Vật phẩm</option>
                        <option value="redeem_code">Mã kích hoạt</option>
                        <option value="other">Khác</option>
                    </BaseSelect>
                </FormField>
                <FormField
                    label="Tên tài sản"
                    required
                    error={error("title")}
                >
                    <BaseInput
                        value={asset.title}
                        onChange={(event) => onChange("title", event.target.value)}
                    />
                </FormField>
                <FormField
                    label="Giá trị tham chiếu"
                    error={error("reference_value")}
                >
                    <MoneyInput
                        value={asset.reference_value}
                        onChange={(value) => onChange("reference_value", value)}
                    />
                </FormField>
                <FormField
                    label="Phương thức bàn giao"
                    required
                    error={error("delivery_method")}
                >
                    <BaseSelect
                        value={asset.delivery_method}
                        onChange={(event) =>
                            onChange("delivery_method", event.target.value)
                        }
                    >
                        {deliveryMethods.map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </BaseSelect>
                </FormField>
                <FormField
                    label="Mô tả tài sản"
                    required
                    className="is-wide"
                    error={error("description")}
                >
                    <BaseTextarea
                        rows="4"
                        value={asset.description}
                        onChange={(event) =>
                            onChange("description", event.target.value)
                        }
                    />
                </FormField>
            </BaseFormGrid>
        </BaseFormSection>
    );
}

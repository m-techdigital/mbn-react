import {
    CameraOutlined,
    DeleteOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { useId, useRef } from "react";
import MarketplaceImage from "./MarketplaceImage";

export default function ImageUploadField({
    label = "Hình ảnh",
    value = "",
    fileName = "",
    accept = "image/jpeg,image/png,image/webp",
    loading = false,
    progress = 0,
    hint,
    error,
    onChange,
    onRemove,
    circular = false,
}) {
    const inputId = useId();
    const inputRef = useRef(null);
    const pick = () => inputRef.current?.click();

    return (
        <div className={`mbn-image-upload ${error ? "has-error" : ""}`.trim()}>
            <span className="mbn-form-field__label">{label}</span>
            <div
                className={`mbn-image-upload__box ${circular ? "is-circular" : ""}`}
            >
                <button
                    type="button"
                    className="mbn-image-upload__preview"
                    onClick={pick}
                    aria-label="Chọn hình ảnh"
                >
                    {value ? (
                        <MarketplaceImage src={value} alt="Hình ảnh đã chọn" />
                    ) : (
                        <CameraOutlined />
                    )}
                </button>
                <div className="mbn-image-upload__body">
                    <strong>
                        {loading
                            ? `Đang tải ${progress}%`
                            : value
                              ? "Hình ảnh đã sẵn sàng"
                              : "Chưa chọn hình ảnh"}
                    </strong>
                    <span className={error ? "mbn-image-upload__error" : ""}>
                        {error ||
                            fileName ||
                            hint ||
                            "Định dạng JPG, PNG hoặc WEBP."}
                    </span>
                    <div className="mbn-image-upload__actions">
                        <button type="button" onClick={pick} disabled={loading}>
                            <UploadOutlined />{" "}
                            {value ? "Chọn ảnh khác" : "Chọn ảnh"}
                        </button>
                        {value && onRemove ? (
                            <button
                                type="button"
                                className="is-danger"
                                onClick={onRemove}
                                disabled={loading}
                            >
                                <DeleteOutlined /> Xóa ảnh
                            </button>
                        ) : null}
                    </div>
                </div>
                <input
                    ref={inputRef}
                    id={inputId}
                    className="mbn-image-upload__input"
                    type="file"
                    accept={accept}
                    onChange={(event) =>
                        onChange?.(event.target.files?.[0] || null, event)
                    }
                />
            </div>
        </div>
    );
}

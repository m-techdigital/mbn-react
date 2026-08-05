import { Image } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import MarketplaceImage from "../base/MarketplaceImage";

export default function GameDetailGallery({
    images,
    activeSlide,
    slideDirection,
    onPrevious,
    onNext,
    onSelect,
}) {
    return (
        <section className="detail-gallery-slider detail-gallery-carousel">
            <div className="detail-slider-stage">
                <div
                    key={`${activeSlide}-${images[activeSlide]}`}
                    className={`detail-slide active detail-slide--${slideDirection}`}
                >
                    <Image
                        src={images[activeSlide]}
                        preview={{ mask: "Nhấn để phóng to" }}
                        fallback="/banner.jpg"
                    />
                </div>
                {images.length > 1 && (
                    <>
                        <button
                            className="detail-slider-arrow prev"
                            onClick={onPrevious}
                            aria-label="Ảnh trước"
                        >
                            <LeftOutlined />
                        </button>
                        <button
                            className="detail-slider-arrow next"
                            onClick={onNext}
                            aria-label="Ảnh sau"
                        >
                            <RightOutlined />
                        </button>
                        <span className="detail-slide-counter">
                            {activeSlide + 1}/{images.length}
                        </span>
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div className="detail-thumbnails">
                    {images.map((src, index) => (
                        <button
                            key={`${src}-${index}`}
                            className={activeSlide === index ? "active" : ""}
                            onClick={() => onSelect(index)}
                        >
                            <MarketplaceImage
                                src={src}
                                alt={`Ảnh ${index + 1}`}
                            />
                        </button>
                    ))}
                </div>
            )}
            <div className="gallery-caption">
                Nhấn vào ảnh để xem dạng phóng to
            </div>
        </section>
    );
}

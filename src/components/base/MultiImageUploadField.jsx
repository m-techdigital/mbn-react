import MarketplaceImage from './MarketplaceImage';
export default function MultiImageUploadField({ label = 'Hình ảnh', hint = '', images = [], loading = false, progress = 0, onChange, onRemove, max = 8 }) {
  return (
    <section className="mbn-multi-upload">
      <header className="mbn-multi-upload__head">
        <div><h3>{label}</h3>{hint ? <p>{hint}</p> : null}</div>
        <label className={`mbn-multi-upload__button ${loading ? 'is-loading' : ''}`}>
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={onChange} disabled={loading || images.length >= max} />
          {loading ? `Đang tải ${progress}%` : images.length >= max ? 'Đã đủ ảnh' : 'Chọn ảnh'}
        </label>
      </header>
      {images.length ? <div className="mbn-multi-upload__grid">{images.map((url, index) => <figure key={`${url}-${index}`}><MarketplaceImage src={url} alt={`Ảnh ${index + 1}`} /><button type="button" onClick={() => onRemove?.(index)}>Xóa</button>{index === 0 ? <small>Ảnh đại diện</small> : null}</figure>)}</div> : <p className="mbn-multi-upload__empty">Chưa có ảnh nào được tải lên.</p>}
    </section>
  );
}

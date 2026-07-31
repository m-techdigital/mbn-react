import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseForm, { BaseFormActions, BaseFormGrid, BaseFormSection } from '../components/base/BaseForm';
import FormField from '../components/base/FormField';
import BaseChoice from '../components/base/BaseChoice';
import GamingButton from '../components/base/GamingButton';
import MoneyInput from '../components/base/MoneyInput';
import MultiImageUploadField from '../components/base/MultiImageUploadField';
import PageShell from '../components/base/PageShell';
import { listingRepository, mediaRepository, productRepository } from '../services/repositories';
import { getUserFacingError } from '../utils/userFacingError';
import { BaseInput, BaseSelect, BaseTextarea } from '../components/base/FormControls';

const initialRate = { label: '1 ngày', period_unit: 'day', period_count: 1, price: '', deposit_amount: '', is_default: true, is_active: true };
const initial = {
  name: '', game_code: 'ninja_school', server_name: '', level: '', description: '', image_url: '', image_urls: [],
  listing_type: 'sale', sale_price: '', rental_price: '', rental_price_unit: 'day', minimum_rental_period: 1,
  rental_billing_mode: 'upfront', rental_billing_cycle_unit: 'day', rental_billing_cycle_count: 1,
  deposit_amount: 0, allow_installment: false, max_installment_count: 3, minimum_initial_payment: 0,
  installment_interval_unit: 'week', installment_interval_count: 1, rental_rates: [initialRate],
};

export default function ListingFormPage() {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const update = (name, value) => setData((current) => ({ ...current, [name]: value }));
  const updateRate = (index, name, value) => setData((current) => ({ ...current, rental_rates: current.rental_rates.map((rate, rateIndex) => rateIndex === index ? { ...rate, [name]: value } : rate) }));
  const addRate = () => setData((current) => ({ ...current, rental_rates: [...current.rental_rates, { ...initialRate, label: `Gói ${current.rental_rates.length + 1}`, is_default: false }] }));
  const removeRate = (index) => setData((current) => ({ ...current, rental_rates: current.rental_rates.filter((_, rateIndex) => rateIndex !== index).map((rate, rateIndex) => ({ ...rate, is_default: rateIndex === 0 })) }));
  const uploadImages = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true); setUploadProgress(0); setError('');
    try {
      const uploaded = await mediaRepository.uploadImages(files, setUploadProgress);
      const urls = (uploaded || []).map((item) => item.url);
      setData((current) => ({ ...current, image_url: current.image_url || urls[0] || '', image_urls: [...(current.image_urls || []), ...urls].slice(0, 8) }));
    } catch (uploadError) { setError(getUserFacingError(uploadError, 'Không thể tải ảnh lên. Vui lòng kiểm tra định dạng và dung lượng ảnh.')); }
    finally { setUploading(false); event.target.value = ''; }
  };
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const product = await productRepository.create({
        name: data.name, product_type: 'game_account', game_code: data.game_code, server_name: data.server_name,
        level: Number(data.level) || null, status: 'active', price: Number(data.sale_price || data.rental_price || 0),
        description: data.description, image_url: data.image_url || data.image_urls?.[0] || null, image_urls: data.image_urls || [], attributes: { source: 'mbn_customer' },
      });
      await listingRepository.create({
        product_id: product.id, listing_type: data.listing_type, title: data.name, description: data.description,
        sale_price: data.listing_type === 'sale' ? Number(data.sale_price) : null,
        rental_price: data.listing_type === 'rental' ? Number(data.rental_price || data.rental_rates[0]?.price || 0) : null,
        rental_price_unit: data.listing_type === 'rental' ? data.rental_price_unit : null,
        minimum_rental_period: data.listing_type === 'rental' ? Number(data.minimum_rental_period) : null,
        rental_period_unit: data.listing_type === 'rental' ? data.rental_price_unit : null,
        rental_billing_mode: data.listing_type === 'rental' ? data.rental_billing_mode : null,
        rental_billing_cycle_unit: data.listing_type === 'rental' ? data.rental_billing_cycle_unit : null,
        rental_billing_cycle_count: data.listing_type === 'rental' ? Number(data.rental_billing_cycle_count) : null,
        rental_rates: data.listing_type === 'rental' ? data.rental_rates.map((rate, index) => ({ ...rate, period_count: Number(rate.period_count), price: Number(rate.price), deposit_amount: rate.deposit_amount === '' ? null : Number(rate.deposit_amount), is_default: index === 0, is_active: true })) : [],
        deposit_amount: Number(data.deposit_amount || 0), allow_installment: data.listing_type === 'sale' && data.allow_installment,
        max_installment_count: data.allow_installment ? Number(data.max_installment_count) : null,
        minimum_initial_payment: data.allow_installment ? Number(data.minimum_initial_payment) : null,
        installment_interval_unit: data.allow_installment ? data.installment_interval_unit : 'week',
        installment_interval_count: data.allow_installment ? Number(data.installment_interval_count) : 1,
      });
      navigate('/account/listings');
    } catch (requestError) { setError(getUserFacingError(requestError, 'Không thể tạo tin đăng.')); }
    finally { setLoading(false); }
  };

  return <PageShell title="Đăng bán hoặc cho thuê tài khoản" description="Khai báo rõ thông tin, mức giá, ảnh và điều kiện giao dịch để quản trị viên duyệt.">
    <BaseForm className="seller-form" onSubmit={submit}>
      {error ? <div className="mbn-form-alert is-error">{error}</div> : null}
      <BaseFormSection title="Thông tin tài khoản" description="Thông tin này được dùng trong tin đăng và hồ sơ giao dịch.">
        <BaseFormGrid>
          <FormField label="Tên tài khoản" required><BaseInput value={data.name} onChange={(event) => update('name', event.target.value)} required /></FormField>
          <FormField label="Trò chơi" required><BaseSelect value={data.game_code} onChange={(event) => update('game_code', event.target.value)}><option value="ninja_school">Ninja School</option><option value="dragon_ball">Ngọc Rồng</option><option value="avatar">Avatar</option></BaseSelect></FormField>
          <FormField label="Máy chủ"><BaseInput value={data.server_name} onChange={(event) => update('server_name', event.target.value)} /></FormField>
          <FormField label="Cấp độ"><BaseInput type="number" min="0" value={data.level} onChange={(event) => update('level', event.target.value)} /></FormField>
          <FormField label="Mô tả" required className="is-wide"><BaseTextarea rows="5" value={data.description} onChange={(event) => update('description', event.target.value)} required /></FormField>
        </BaseFormGrid>
        <MultiImageUploadField label="Ảnh tài khoản" hint="Tải tối đa 8 ảnh JPG, PNG, WEBP hoặc GIF; mỗi ảnh không quá 5 MB." images={data.image_urls || []} loading={uploading} progress={uploadProgress} onChange={uploadImages} onRemove={(index) => setData((current) => { const images = current.image_urls.filter((_, imageIndex) => imageIndex !== index); return { ...current, image_urls: images, image_url: images[0] || '' }; })} />
      </BaseFormSection>

      <BaseFormSection title="Điều kiện giao dịch" description="Chọn bán hoặc cho thuê và khai báo rõ các khoản tiền.">
        <BaseFormGrid>
          <FormField label="Loại tin" required><BaseSelect value={data.listing_type} onChange={(event) => update('listing_type', event.target.value)}><option value="sale">Bán</option><option value="rental">Cho thuê</option></BaseSelect></FormField>
          {data.listing_type === 'sale' ? <FormField label="Giá bán" required><MoneyInput value={data.sale_price} min={0} onChange={(value) => update('sale_price', value)} /></FormField> : <>
            <FormField label="Giá thuê mặc định"><MoneyInput value={data.rental_price} min={0} onChange={(value) => update('rental_price', value)} /></FormField>
            <FormField label="Đơn vị thuê"><BaseSelect value={data.rental_price_unit} onChange={(event) => update('rental_price_unit', event.target.value)}><option value="hour">Giờ</option><option value="day">Ngày</option><option value="week">Tuần</option><option value="month">Tháng</option></BaseSelect></FormField>
            <FormField label="Cách thu tiền"><BaseSelect value={data.rental_billing_mode} onChange={(event) => update('rental_billing_mode', event.target.value)}><option value="upfront">Thu trước toàn kỳ</option><option value="periodic">Thu theo từng chu kỳ</option></BaseSelect></FormField>
            <FormField label="Chu kỳ thu tiền"><BaseSelect value={data.rental_billing_cycle_unit} onChange={(event) => update('rental_billing_cycle_unit', event.target.value)}><option value="hour">Giờ</option><option value="day">Ngày</option><option value="week">Tuần</option><option value="month">Tháng</option></BaseSelect></FormField>
            <FormField label="Số đơn vị mỗi chu kỳ"><BaseInput type="number" min="1" value={data.rental_billing_cycle_count} onChange={(event) => update('rental_billing_cycle_count', event.target.value)} /></FormField>
          </>}
          <FormField label="Tiền cọc mặc định"><MoneyInput value={data.deposit_amount} min={0} onChange={(value) => update('deposit_amount', value)} /></FormField>
        </BaseFormGrid>
      </BaseFormSection>

      {data.listing_type === 'rental' ? <BaseFormSection title="Các gói kỳ hạn thuê" description="Mỗi gói có thời hạn, mức giá và tiền cọc riêng." actions={<GamingButton type="button" size="sm" onClick={addRate}>Thêm gói thuê</GamingButton>}>
        <div className="rental-rate-editor__rows">{data.rental_rates.map((rate, index) => <div className="rental-rate-row" key={index}>
          <FormField label="Tên gói" required><BaseInput value={rate.label} onChange={(event) => updateRate(index, 'label', event.target.value)} required /></FormField>
          <FormField label="Số kỳ" required><BaseInput type="number" min="1" value={rate.period_count} onChange={(event) => updateRate(index, 'period_count', event.target.value)} required /></FormField>
          <FormField label="Đơn vị"><BaseSelect value={rate.period_unit} onChange={(event) => updateRate(index, 'period_unit', event.target.value)}><option value="hour">Giờ</option><option value="day">Ngày</option><option value="week">Tuần</option><option value="month">Tháng</option></BaseSelect></FormField>
          <FormField label="Giá thuê" required><MoneyInput value={rate.price} min={0} onChange={(value) => updateRate(index, 'price', value)} /></FormField>
          <FormField label="Tiền cọc"><MoneyInput value={rate.deposit_amount} min={0} onChange={(value) => updateRate(index, 'deposit_amount', value)} /></FormField>
          <GamingButton type="button" variant="danger" size="sm" onClick={() => removeRate(index)} disabled={data.rental_rates.length === 1}>Xóa</GamingButton>
        </div>)}</div>
      </BaseFormSection> : null}

      {data.listing_type === 'sale' ? <BaseFormSection title="Trả góp" description="Chỉ bật khi bạn chấp nhận cho người mua thanh toán theo kỳ.">
        <BaseChoice label="Cho phép trả góp" description="Khi bật, người mua có thể chọn lịch thanh toán theo kỳ." checked={data.allow_installment} onChange={(event) => update('allow_installment', event.target.checked)} />
        {data.allow_installment ? <BaseFormGrid>
          <FormField label="Số kỳ tối đa"><BaseInput type="number" min="2" max="12" value={data.max_installment_count} onChange={(event) => update('max_installment_count', event.target.value)} /></FormField>
          <FormField label="Thanh toán ban đầu tối thiểu"><MoneyInput value={data.minimum_initial_payment} min={0} onChange={(value) => update('minimum_initial_payment', value)} /></FormField>
          <FormField label="Khoảng cách kỳ"><BaseSelect value={data.installment_interval_unit} onChange={(event) => update('installment_interval_unit', event.target.value)}><option value="day">Ngày</option><option value="week">Tuần</option><option value="month">Tháng</option></BaseSelect></FormField>
          <FormField label="Số đơn vị mỗi kỳ"><BaseInput type="number" min="1" value={data.installment_interval_count} onChange={(event) => update('installment_interval_count', event.target.value)} /></FormField>
        </BaseFormGrid> : null}
      </BaseFormSection> : null}

      <BaseFormActions><GamingButton type="button" variant="secondary" onClick={() => navigate('/account/listings')}>Hủy</GamingButton><GamingButton type="submit" variant="primary" loading={loading}>Gửi duyệt tin đăng</GamingButton></BaseFormActions>
    </BaseForm>
  </PageShell>;
}

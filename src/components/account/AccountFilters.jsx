import { useEffect, useMemo, useState } from 'react';
import BaseFilter, { FilterField } from '../base/BaseFilter';
import { BaseInput, BaseSelect } from '../base/FormControls';

const selectOptions = {
  level: ['Dưới 100', '100 - 130', '131 - 150', 'Trên 150'],
  class: ['Kunai', 'Kiếm', 'Tiêu', 'Cung'],
  server: ['Tone', 'Bokken', 'Sanzu', 'Vũ trụ 2', 'Vũ trụ 6'],
  planet: ['Trái Đất', 'Xayda', 'Namếc'],
  land: ['Dưới 20 ô', '20 - 40 ô', 'Trên 40 ô'],
  sex: ['Nam', 'Nữ'],
};

const blank = { code: '', username: '', price: '', level: '', class: '', server: '', planet: '', land: '', sex: '', sort: 'newest' };

export default function AccountFilters({ type, onSubmit, resultText = '' }) {
  const [values, setValues] = useState(blank);
  const [busy, setBusy] = useState('');
  useEffect(() => setValues(blank), [type]);

  const fields = useMemo(() => type === 'ninjas'
    ? [{ name: 'level', label: 'Cấp độ' }, { name: 'class', label: 'Phái' }, { name: 'server', label: 'Máy chủ' }]
    : type === 'dragonBalls'
      ? [{ name: 'server', label: 'Máy chủ' }, { name: 'planet', label: 'Hành tinh' }]
      : [{ name: 'land', label: 'Số ô đất' }, { name: 'sex', label: 'Giới tính' }], [type]);

  const update = (name) => (event) => setValues((current) => ({ ...current, [name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    setBusy('search');
    const payload = Object.fromEntries(Object.entries(values).filter(([, value]) => value !== ''));
    onSubmit?.(payload);
    window.setTimeout(() => setBusy(''), 320);
  };
  const reset = () => {
    setBusy('reset');
    setValues(blank);
    onSubmit?.({});
    window.setTimeout(() => setBusy(''), 260);
  };

  const activeCount = Object.entries(values).filter(([key, value]) => key !== 'sort' && value !== '').length;

  return (
    <BaseFilter className={`is-${type}`} onSubmit={submit} onReset={reset} resultText={resultText} loading={busy === 'search'} resetting={busy === 'reset'} activeCount={activeCount}>
      <FilterField label="Mã"><BaseInput value={values.code} onChange={update('code')} placeholder="Mã số" /></FilterField>
      <FilterField label={type === 'avatars' ? 'Mã nhân vật' : 'Tên nhân vật'}><BaseInput value={values.username} onChange={update('username')} placeholder={type === 'avatars' ? 'Nhập mã nhân vật' : 'Nhập tên nhân vật'} /></FilterField>
      <FilterField label="Giá tối đa"><BaseInput value={values.price} onChange={update('price')} placeholder="Nhập mức giá" inputMode="numeric" /></FilterField>
      {fields.map((field) => (
        <FilterField label={field.label} key={field.name}>
          <BaseSelect value={values[field.name]} onChange={update(field.name)}>
            <option value="">Tất cả</option>
            {(selectOptions[field.name] || []).map((value) => <option value={value} key={value}>{value}</option>)}
          </BaseSelect>
        </FilterField>
      ))}
      <FilterField label="Sắp xếp">
        <BaseSelect value={values.sort} onChange={update('sort')}>
          <option value="newest">Mới đăng trước</option>
          <option value="price_asc">Giá thấp đến cao</option>
          <option value="price_desc">Giá cao đến thấp</option>
          <option value="level_desc">Cấp độ cao trước</option>
        </BaseSelect>
      </FilterField>
    </BaseFilter>
  );
}

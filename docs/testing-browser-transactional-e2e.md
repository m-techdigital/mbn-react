# Browser và Transactional E2E

## Chuẩn bị API

```bash
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=8000
```

## Browser smoke

Chạy MBN ở `127.0.0.1:5174`, sau đó:

```bash
MBN_E2E_URL=http://127.0.0.1:5174 \
MBN_E2E_LOGIN=customer \
MBN_E2E_PASSWORD=change-me \
npm run e2e:browser-core
```

Các route mặc định dùng fixture ổn định:

- Bán: `/teamobi/ninja-school/NSO-0102`
- Thuê: `/teamobi/ninja-school/NSO-0201`
- Trả góp: `/teamobi/ngoc-rong/NRO-0301`

Thêm `MBN_E2E_AVATAR_PATH` để kiểm tra upload và persistence của avatar.

## Transactional E2E

Chỉ chạy trên database test đã reset:

```bash
MBN_E2E_ALLOW_MUTATION=1 \
MBN_E2E_API_URL=http://127.0.0.1:8000/api/v1 \
MBN_E2E_PASSWORD=change-me \
MBN_E2E_ADMIN_LOGIN=admin \
MBN_E2E_ADMIN_PASSWORD=change-me \
npm run e2e:transactional-api
```

Runner thực hiện mutation cho mua bằng ví, dispute, thuê/bàn giao/hoàn trả/đối soát cọc, kỳ trả góp, payout approve/paid và document generation.

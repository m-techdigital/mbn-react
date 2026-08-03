# Marketplace hardening 2026-08-02

## Pham vi dong bo tu AXIRO cha

- Nguon doi chieu: `mylands-api-develop-20260802-0359.zip` va `mylands-admin-develop-20260802-0359.zip`.
- Customer app chi dong bo contract can thiet cho product-only marketplace: `availability_version`, `idempotency_key`, transaction type/payment method.
- Khong them module hop dong rieng; luong chinh van la giao dich san pham.
- Contract CRUD khong con la integration surface cua customer/admin; tai lieu giao dich neu co chi hien trong ho so giao dich.

## Ket qua cap nhat customer app

- Trang chi tiet san pham gui `availability_version` khi tao giao dich de backend kiem tra optimistic lock.
- Repository tao `idempotency_key` cho checkout; co fallback khi browser khong ho tro `crypto.randomUUID()`.
- Mock mode van chan tao giao dich that, tranh tao cam giac da checkout khi dang dung data mau.
- Cache query sau checkout tiep tuc invalidate purchases, wallet transactions, list/detail san pham.

## Dau viec nen bo sung cho admin va phoi hop frontend

1. Hien canh bao san pham vua thay doi trang thai/version trong checkout va yeu cau tai lai.
2. Da bo sung trang admin hold monitor de customer support giai thich vi sao san pham dang bi giu.
3. Da bo sung timeline availability va hang doi pending payment/delivery/acceptance can xu ly trong admin operations-control.
4. Hien label enum nhat quan cho transaction type, payment method, availability status va payment status.
5. Canh bao duplicate checkout than thien: neu idempotency tra ve transaction cu, dieu huong den chi tiet giao dich.
6. Bo sung thong bao stale hold/refund/deposit cho buyer/seller neu backend tra trang thai tuong ung.
7. Can dong bo copywriting tranh dung "hop dong" khi nghiep vu hien tai chi can "giao dich".
8. Tam khong phat trien fraud engine, SLA engine hay role/policy nhieu cap cho customer app.

## Ghi chu UI/UX

- Giu tone mau, active state, button va input height theo base AXIRO cha.
- Form/filter can can bang chieu cao input, label va icon; khong de raw enum value hien truc tiep.
- Trang nghiep vu nen uu tien thao tac nhanh, trang thai ro, va duong di chi tiet giao dich.

## Trang thai kiem tra

- `npm run lint`: pass.
- `npm run build`: pass.
- `npm run check:product-only-marketplace`: pass.
- `npm run check:parent-offer-mode-alignment`: pass.
- `npm run check:api-contract`: pass.

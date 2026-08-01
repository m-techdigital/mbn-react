# AXIRO mini integration

MBN uses the AXIRO mini customer guard exclusively. Internal users remain on `/login`; storefront customers use `/auth/customer/*`. Catalog pages read canonical `products`; buy/sell and rent/lease-out are represented by one `transactions` record with buyer and seller customer IDs.

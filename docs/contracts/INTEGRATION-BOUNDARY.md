# MBN integration boundary

- `src/contracts/marketplace-contract.json` is copied from AXIRO Mini API and must not be edited independently.
- MBN may use only `customer_endpoints` and public endpoints.
- Backend owns money calculations, allowed actions, lifecycle transitions, statuses and permissions.
- MBN renders `allowed_actions`; it must not infer authorization independently.
- Internal audit data is Admin-only.
- Unsupported capabilities such as card deposit and ninja-coin purchasing remain hidden until declared by the contract.
- Run `yarn run check:api-contract` before every merge.

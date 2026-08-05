# Porting from AXIRO
Check AXIRO parent first, then port only the customer-facing owner needed by Mini.

Keep route pages thin, move lifecycle behavior into hooks/repositories/config owners, and register CSS through the deterministic style manifest. Do not copy parent module folders wholesale, and do not add company/RBAC/HR/accounting/report dependencies just to match the parent tree.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authRepository } from '../services/repositories';
import { refreshAccessToken, tokenStore } from '../services/api';
import { isMockMode } from '../services/dataMode';
import { clearQueryCache } from '../services/queryClient';

const AuthContext = createContext(null);
const mockCustomer = { id: 1001, code: 'CUS-DEMO', username: 'customer', name: 'Khách hàng Demo', email: 'customer@example.com', phone: '0900000000', status: 'active', balance: 2180000 };

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(isMockMode() ? mockCustomer : null);
  const [loading, setLoading] = useState(!isMockMode());

  const refreshCustomer = useCallback(async () => {
    if (isMockMode()) { setCustomer(mockCustomer); setLoading(false); return mockCustomer; }

    setLoading(true);
    try {
      if (!tokenStore.access()) {
        await refreshAccessToken();
      }
      const current = await authRepository.customer();
      setCustomer(current);
      return current;
    } catch {
      tokenStore.clear();
      setCustomer(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCustomer();
    const unauthorized = () => setCustomer(null);
    window.addEventListener('mbn:unauthorized', unauthorized);
    return () => window.removeEventListener('mbn:unauthorized', unauthorized);
  }, [refreshCustomer]);

  const login = async (values) => {
    if (isMockMode()) { setCustomer({ ...mockCustomer, username: values.username || mockCustomer.username }); return; }
    const result = await authRepository.login(values);
    if (result?.two_factor_required) return result;
    tokenStore.set(result);
    setCustomer(result.customer || await authRepository.customer());
    return result;
  };

  const verifyTwoFactor = async (values) => {
    const result = await authRepository.verifyTwoFactor(values);
    tokenStore.set(result);
    setCustomer(result.customer || await authRepository.customer());
    return result;
  };

  const register = async (values) => {
    if (isMockMode()) { setCustomer({ ...mockCustomer, ...values, id: 1002, code: 'CUS-MOCK' }); return; }
    const result = await authRepository.register(values);
    tokenStore.set(result);
    setCustomer(result.customer || await authRepository.customer());
    return result;
  };

  const logout = async () => {
    if (isMockMode()) { setCustomer(null); return; }
    try { await authRepository.logout(); }
    finally { tokenStore.clear(); clearQueryCache(); setCustomer(null); }
  };

  const value = useMemo(() => ({
    customer,
    user: customer,
    loading,
    isAuthenticated: Boolean(customer),
    login,
    verifyTwoFactor,
    register,
    logout,
    refreshCustomer,
    refreshUser: refreshCustomer,
  }), [customer, loading, refreshCustomer]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

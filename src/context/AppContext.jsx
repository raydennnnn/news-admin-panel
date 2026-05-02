import { createContext, useContext, useState, useEffect } from 'react';
import apiFetch from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { user } = useAuth(); // Only fetch if user is logged in
  const [pendingReports, setPendingReports] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);

  const fetchGlobalStats = async () => {
    if (!user) return;
    try {
      const [reportsRes, verifRes] = await Promise.all([
        apiFetch('/admin/news/reported?page=1&limit=1&minReports=0'),
        apiFetch('/users/publisher-verifications?status=pending&page=1&limit=1')
      ]);

      if (reportsRes.success) {
        setPendingReports(reportsRes.data.pagination?.totalDocs || 0);
      }
      if (verifRes.success) {
        // use stats.pendingCount if available, fallback to pagination total
        setPendingVerifications(verifRes.data.stats?.pendingCount ?? verifRes.data.pagination?.totalDocs ?? 0);
      }
    } catch (err) {
      console.error("Failed to fetch global stats:", err);
    }
  };

  useEffect(() => {
    fetchGlobalStats();
    // In a real production app, we might set up an interval to poll here
    // or connect to a WebSocket. For now, we fetch once on mount/login
    // and rely on components updating the state when they perform actions.
  }, [user]);

  return (
    <AppContext.Provider value={{
      pendingReports,
      setPendingReports,
      pendingVerifications,
      setPendingVerifications,
      refreshGlobalStats: fetchGlobalStats
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

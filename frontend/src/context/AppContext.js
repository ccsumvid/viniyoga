import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_INVENTORY } from '../data/defaults';

const STORAGE_KEY = 'viniyoga-state';

const AppContext = createContext(null);

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load saved state:', e);
  }
  return null;
};

export function AppProvider({ children }) {
  const saved = loadState();

  const [inventory, setInventory] = useState(saved?.inventory || { ...INITIAL_INVENTORY });
  const [lang, setLang] = useState(saved?.lang || 'en');
  const [todayMenu, setTodayMenu] = useState(saved?.todayMenu || null);
  const [orgName, setOrgName] = useState(saved?.orgName || 'Viniyoga Kitchen');
  const [servingSize, setServingSize] = useState(saved?.servingSize || 4);
  const [logs, setLogs] = useState(saved?.logs || []);

  const addLog = useCallback((entry) => {
    setLogs(prev => [...prev, entry]);
  }, []);

  useEffect(() => {
    try {
      const state = { inventory, lang, todayMenu, orgName, servingSize, logs };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }, [inventory, lang, todayMenu, orgName, servingSize, logs]);

  const value = {
    inventory,
    setInventory,
    lang,
    setLang,
    todayMenu,
    setTodayMenu,
    orgName,
    setOrgName,
    servingSize,
    setServingSize,
    logs,
    addLog,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;

import { createContext, useContext, useEffect, useMemo } from "react";
import * as db from '../lib/db';
import * as sim from '../lib/sim';

const AppContext = createContext({});

export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  // Seed db and start sim
  useEffect(() => {
    db.seed();
    const stop = sim.start();
    return () => stop();
  }, []);

  const value = useMemo(() => ({ data: db }), []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
import { createContext, useContext, useState, useEffect } from 'react';

const TicketsContext = createContext(null);

export const TicketsProvider = ({ children }) => {
  const [tickets, setTickets] = useState(() => {
    const raw = localStorage.getItem("eps_tickets");
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem("eps_tickets", JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = (ticket) => {
    setTickets(prev => [...prev, { ...ticket, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]);
  };

  const updateTicket = (id, updates) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const value = {
    tickets,
    setTickets,
    addTicket,
    updateTicket
  };

  return (
    <TicketsContext.Provider value={value}>
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = () => {
  const ctx = useContext(TicketsContext);
  if (!ctx) throw new Error("useTickets must be used within <TicketsProvider>");
  return ctx;
};
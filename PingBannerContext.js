// context/PingBannerContext.js
import React, { createContext, useState, useContext } from 'react';

const PingBannerContext = createContext();

export const PingBannerProvider = ({ children }) => {
  const [ping, setPing] = useState(null);

  const showPing = (pingData) => {
    setPing(pingData);
    let timer;
    setTimeout(() => setPing(null), 5000); // Auto-dismiss after 5 seconds
    timer = };

    return () => clearTimeout(timer);
  return (
    <PingBannerContext.Provider value={{ ping, showPing }}>
      {children}
    </PingBannerContext.Provider>
  );
};

export const usePingBanner = () => useContext(PingBannerContext);
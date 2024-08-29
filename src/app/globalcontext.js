"use client";

import { createContext, useContext, useState } from "react";

// Create a context
const GlobalStateContext = createContext();

// Custom hook to use the context
export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false); // Connection status
  const [code, setCode] = useState(""); // The code generated
  const [room, setRoom] = useState(null);
  return (
    <GlobalStateContext.Provider
      value={{ isConnected, setIsConnected, code, setCode, room, setRoom }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

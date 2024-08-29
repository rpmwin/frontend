// socketcontext.js
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

// Create a Context for the Socket
const SocketContext = createContext();

// Custom Hook to use the Socket context easily
export const useSocket = () => {
  return useContext(SocketContext);
};

// Create a Socket Provider to wrap your application
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8000"); // Connect to your backend
    setSocket(newSocket);

    // Cleanup when the component unmounts
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create Context
const SocketContext = createContext(null);

// Custom Hook
export const useSocket = () => {
    return useContext(SocketContext);
};

// Provider Component
export const SocketProvider = ({ children }) => {

    const [socket, setSocket] = useState(null);

    useEffect(() => {
       

        const socketInstance = io(import.meta.env.VITE_SERVER, {
            withCredentials: true,
            
        });

        setSocket(socketInstance);

        socketInstance.on("connect", () => {
           // console.log("Connected:", socketInstance.id);
        });

        socketInstance.on("connect_error", (err) => {
           // console.log("Socket error:", err.message);
        });

        return () => socketInstance.disconnect();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
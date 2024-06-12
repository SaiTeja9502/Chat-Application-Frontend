import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);
    const [userSubscription, setUserSubscription] = useState(null);
    const [groupSubscription, setGroupSubscription] = useState([]);
    const { authUser } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (authUser) {
            const socket = new SockJS("http://localhost:8080/ws");
            const stomp = over(socket);
            stomp.connect(
                { Authorization: `Bearer ${authUser.accessToken}` },
                () => {
                    setStompClient(stomp);
                },
                (error) => {
                    toast.error(error);
                    navigate("/login");
                }
            );
        }
    }, [authUser]);
   
    return (
        <SocketContext.Provider value={{ stompClient, setStompClient, userSubscription, setUserSubscription, groupSubscription, setGroupSubscription}}>
            {children}
        </SocketContext.Provider>
    );
};


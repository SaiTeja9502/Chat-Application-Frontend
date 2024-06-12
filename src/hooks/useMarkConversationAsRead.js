import { useAuthContext } from '../context/AuthContext';
import toast from "react-hot-toast";
import { fetchWithTokenRefresh } from './useFetchWithRefreshToken';

const useMarkConversationAsRead = () => {
    const { authUser, setAuthUser } = useAuthContext();
    const markMessagesRead = async(conversation) => {
        console.log('send');
        if(!areAllMessagesRead(conversation.messages)){
            console.log('sending');
            try {
                const res = await fetchWithTokenRefresh(`http://localhost:8080/messages/${conversation.conversationId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authUser.accessToken}`
                    }
                }, authUser, setAuthUser);
                const data = await res.text();
                if (!res.ok) throw new Error(data.error);
            } catch (error) {
                toast.error(error.message);
            }
        }
    }
    return {markMessagesRead};
}

export default useMarkConversationAsRead;

const areAllMessagesRead = (messages) => {
    if (messages.length === 0) {
        return true;
    }
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage.read) {
        return false;
    } 
    return true;
};

import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { fetchWithTokenRefresh } from "./useFetchWithRefreshToken";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { selectedConversation, setSelectedConversation, conversations, setConversations } = useConversation();
	const { authUser, setAuthUser } = useAuthContext();

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			const res = await fetchWithTokenRefresh('http://localhost:8080/messages', {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${authUser.accessToken}`
				},
				body: JSON.stringify({ "messageId": 0, "message": message, "conversationId": selectedConversation.conversationId }),
			}, authUser, setAuthUser);
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			
			const updatedConversations = conversations.map(conversation => {
				if (conversation.conversationId === selectedConversation.conversationId) {
					const updatedMessages = conversation.messages ? [...conversation.messages, data] : [data];
					setSelectedConversation({
						...conversation,
						messages: updatedMessages
					});
					return {
						...conversation,
						messages: updatedMessages
					};
				}
				
				return conversation;
			});
			setConversations(updatedConversations);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;

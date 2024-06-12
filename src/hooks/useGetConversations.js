
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";
import { fetchWithTokenRefresh } from "./useFetchWithRefreshToken";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const { authUser, setAuthUser } = useAuthContext(); 
	const { conversations, setConversations } = useConversation();

	useEffect(() => {
		const getConversations = async () => {
			console.log('inside use Get conversations');
			console.log(authUser);
			setLoading(true);
			try {
				const res = await fetchWithTokenRefresh("http://localhost:8080/messages/conversations", {
					method: "GET",
					headers: { "Authorization": `Bearer ${authUser.accessToken}`},
				}, authUser, setAuthUser);
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error);
				}
				setConversations(data);  // list of ChatDTO's
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};
export default useGetConversations;

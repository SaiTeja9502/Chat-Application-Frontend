import {useState} from 'react';
import useConversation from '../zustand/useConversation';
import { useAuthContext } from '../context/AuthContext';
import toast from "react-hot-toast";
import { fetchWithTokenRefresh } from './useFetchWithRefreshToken';


const useCreateGroup = () => {
    const [loading, setLoading] = useState(false);
	const { conversations, setConversations } = useConversation();
	const { authUser, setAuthUser } = useAuthContext();

	const createGroup = async (name, contactIds) => {
		setLoading(true);
		try {
			const res = await fetchWithTokenRefresh('http://localhost:8080/group/new', {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${authUser.accessToken}`
				},
				body: JSON.stringify({ "groupName": name, "contactIds": contactIds}),
			}, authUser, setAuthUser);
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			
			setConversations([...conversations, data]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

    return {loading, createGroup};

}

export default useCreateGroup
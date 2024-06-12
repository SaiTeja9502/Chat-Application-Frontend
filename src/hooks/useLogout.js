import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { authUser, setAuthUser } = useAuthContext();
	const {stompClient, setStompClient, userSubscription, setUserSubscription, groupSubscription, setGroupSubscription} = useSocketContext();

	const logout = async () => {
		setLoading(true);
		try {
			const res = await fetch("http://localhost:8080/account/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json",
							"Authorization": `Bearer ${authUser.accessToken}`
						}
			});
			const data = await res.text();
			if (!res.ok) {
				throw new Error(data.error);
			}
			await groupSubscription.forEach(subscription => {
                subscription.unsubscribe();
            });
            setGroupSubscription([]);
			await userSubscription.unsubscribe(()=>{
				setUserSubscription(null);
			});

			await stompClient.disconnect(() => { 
				setStompClient(null);
			});
           
			localStorage.removeItem("chat-user");
			setAuthUser(null);
			
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};
export default useLogout;

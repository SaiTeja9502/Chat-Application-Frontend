import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { fetchWithTokenRefresh } from "./useFetchWithRefreshToken";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
    const { authUser, setAuthUser } = useAuthContext(); 

    const getUserByPhoneNumber = async (phoneNumber) => {
        setLoading(true);
        let data;
        try {
            const res = await fetchWithTokenRefresh("http://localhost:8080/profile/addfriend", {
                method: "POST",
				headers: { "Content-Type": "application/json",
                            "Authorization": `Bearer ${authUser.accessToken}`
                        },
				body: JSON.stringify({ "phoneNumber" :phoneNumber })
            }, authUser, setAuthUser);
            if(res.ok){
                data = await res.json();
            } else{
            throw new Error(res);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
        return {data};
    };

	return { loading, getUserByPhoneNumber };
};
export default useGetConversations;
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async (phoneNumber, password) => {
		const success = handleInputErrors(phoneNumber, password);
		if (!success) return;
		setLoading(true);
		try {
			const res = await fetch("http://localhost:8080/account/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phoneNumber, password })
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data);
			}
			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			toast.error(error.message);
			console.log(error)
		} finally {
			setLoading(false);
		}
	};

	return { loading, login };
};
export default useLogin;

function handleInputErrors(phoneNumber, password) {
	if (!phoneNumber || !password) {
		toast.error("Please fill in all fields");
		return false;
	}

	return true;
}

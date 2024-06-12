import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const signup = async ({ phoneNumber, userName, password, confirmPassword, securityQuestion, securityAnswer }) => {
		console.log("inside");
		const success = handleInputErrors({ phoneNumber, userName, password, confirmPassword, securityQuestion, securityAnswer });
		if (!success) return;

		setLoading(true);
		try {
			const res = await fetch("http://localhost:8080/account/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ "phoneNumber": phoneNumber, "userName": userName, "password": password, "confirmPassword": confirmPassword, "securityQuestion": securityQuestion, "securityAnswer": securityAnswer  }),
			});
		
			const data = await res.text();
		
			if (!res.ok) {
				throw new Error(data);
			}
			toast.success("Account created successfully!");
			navigate("/login");
		} catch (error) {
			toast.error(error.message);
			console.log(error);
		} finally {
			setLoading(false);
		}
		
	};

	return { loading, signup };
};
export default useSignup;

function handleInputErrors({ phoneNumber, userName, password, confirmPassword, securityQuestion, securityAnswer }) {
	if (!phoneNumber || !userName || !password || !confirmPassword || !securityQuestion || !securityAnswer) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	const isValidSecurityAnswer = /^[^\s]+$/.test(securityAnswer.trim());
    if (!isValidSecurityAnswer) {
        toast.error("Security answer must be a single word");
        return false;
    }
	console.log("hello");
	return true;
}

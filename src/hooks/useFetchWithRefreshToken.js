async function fetchWithTokenRefresh(url, options, authUser, setAuthUser) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                const refreshedAuthUser = await refreshToken(authUser, setAuthUser);
                options.headers["Authorization"] = `Bearer ${refreshedAuthUser.accessToken}`;
                return fetch(url, options);
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        }
        return response;
    } catch (error) {
        throw error; 
    }
}
  
async function refreshToken(authUser, setAuthUser) {
    try {
        const res = await fetch('http://localhost:8080/account/refreshToken', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ refreshToken: authUser.token })
        });

        const data = await res.json();
        if (data.error) {
            throw new Error(data);
        }
        localStorage.setItem("chat-user", JSON.stringify(data));
        setAuthUser(data);
        return data; // Return the refreshed authUser
    } catch (error) {
        toast.error(error.message);
        console.log(error);
        throw error; // Rethrow the error for the caller to handle
    }
}

export { fetchWithTokenRefresh };

import { useEffect, useState } from "react";
import instance from "../axiosConfig.js";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        checkForLogin();
    }, []);


    async function checkForLogin() {
        try {
            const response = await instance.get("/api/auth/me", { withCredentials: true });
            if (response.status === 200) {
                setIsLoggedIn(true);
            }
        } catch (error) {
            setIsLoggedIn(false);
            setLoading(true);
        } finally {
            setLoading(false);
        }
    }
    if (loading) return <div>Loading...</div>;

    if (!isLoggedIn) navigate("/login");

    return children;

}
export default ProtectedRoute;

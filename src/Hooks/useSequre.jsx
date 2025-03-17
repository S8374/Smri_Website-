import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import useRefreshPage from "./useRefreshPage";

const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_LIVE_LINK // ✅ Use Vite's environment variables
});

const useSecure = () => {
    const { logOut } = useAuth();
    const navigate = useNavigate();
    const refreshPage = useRefreshPage();

    axiosPublic.interceptors.request.use(function (config) {
        const token = localStorage.getItem('token')
        // console.log('request stopped by interceptors', token)
        config.headers.authorization = `Bearer ${token}`;
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });
    // intercepts 401 and 403 status
    axiosPublic.interceptors.response.use(function (response) {
        return response;
    }, async (error) => {
        const status = error.response.status;
        // console.log('status error in the interceptor', status);
        // for 401 or 403 logout the user and move the user to the login
        if (status === 401 || status === 403) {
            await logOut();
            navigate('/');
            refreshPage();

        }
        return Promise.reject(error);
    })
    return axiosPublic;
};

export default useSecure;

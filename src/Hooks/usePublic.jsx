import axios from "axios";

const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_LIVE_LINK // ✅ Use Vite's environment variables
});

const usePublic = () => {
    return axiosPublic;
};

export default usePublic;

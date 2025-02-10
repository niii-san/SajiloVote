import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async function (error: AxiosError | any) {
        const originalRequest = error.config;
        if (
            error.response?.status === 401 &&
            error.response?.data?.message == "token expired"
        ) {
            await refreshAccessToken();
            return api(originalRequest);
        }
        return Promise.reject(error);
    },
);

async function refreshAccessToken() {
    try {
        await axios.post(
            `${import.meta.env.VITE_API_ENDPOINT}/auth/refresh-token`,
            {},
            { withCredentials: true },
        );
        console.log("accesss token refreshed");
    } catch (error: any) {
        toast.error("Session expired");
    }
}

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
            error.response?.data?.message === "token expired" &&
            !originalRequest._retry
        ) {
            try {
                await refreshAccessToken();
                return api(originalRequest);
            } catch (refreshError: any) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);

async function refreshAccessToken() {
    try {
        await axios.post(
            `${import.meta.env.VITE_API_ENDPOINT}/api/v1/auth/refresh-token`,
            {},
            { withCredentials: true },
        );
    } catch (refreshError: any) {
        if (
            refreshError.response.status === 401 &&
            refreshError.response.data.message == "refresh token expired"
        ) {
            toast.error("Session expired");
        }
        return Promise.reject(refreshError);
    }
}

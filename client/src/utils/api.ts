import axios, { AxiosError } from "axios";
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    withCredentials: true,
});

api.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error:AxiosError) {

        if(error.response?.status===401 && error.response?.data){

        }

        return Promise.reject(error);
    },
);

async function refreshAccessToken(){


}

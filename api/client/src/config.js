import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://hostory.herokuapp.com/api/"
});
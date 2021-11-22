import { axiosInstance } from "./config";

export const writeCall = async (post, category) => {
    try {
        await axiosInstance.post("/categories", { name: category });
        const res = await axiosInstance.post("/posts", post);        
        window.location.replace("/posts/" + res.data._id);
    } catch (err) {
        console.log(err);
    }
};

export const updateCall = async (updatedUser, userId, dispatch) => {
    dispatch({ type: "UPDATE_START" });
    try {
        const res = await axiosInstance.put(`/users/${userId}`, updatedUser);
        dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
    } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: err });
    }
};
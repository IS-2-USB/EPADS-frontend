import axios from "axios";
import { handleResponse, handleError } from "./responses";

const URL = "http://127.0.0.1:5000";

const axiosMethod = async (request) => {
    try {
        const response = await axios(request);
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

const getAll = (resource) => {
    return axiosMethod({
        method: "get",
        url: `${URL}/${resource}/getall`,
    });
};

const get = (resource, id) => {
    return axiosMethod({
        method: "get",
        url: `${URL}/${resource}/getall/${id}`,
    });
};

const register = (resource, data) => {
    return axiosMethod({
        method: "post",
        url: `${URL}/${resource}/register`,
        data,
    });
};

const login = (resource) => {
    return axiosMethod({
        method: "post",
        url: `${URL}/${resource}/login`,
    });
};

const remove = (resource) => {
    return axiosMethod({
        method: "delete",
        url: `${URL}/${resource}`,
    });
};

const edit = (resource) => {
    return axiosMethod({
        method: "put",
        url: `${URL}/${resource}`,
    });
};

const editUser = (resource, data, token) => {
    return axiosMethod({
        method: "post",
        url: `${URL}/${resource}/edit`,
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const deleteUser = (resource, data, token) => {
    return axiosMethod({
        method: "post",
        url: `${URL}/${resource}/delete`,
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export { getAll, get, register, login, remove, edit, editUser, deleteUser };

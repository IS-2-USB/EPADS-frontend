import {
    getAll,
    get,
    register,
    login,
    deleteUser,
    editUser,
} from "../services";

const usersResource = "user";
const Users = {
    getAll: () => getAll(usersResource),
    get: (id) => get(usersResource, id),
    register: (data) => register(usersResource, data),
    login: () => login(usersResource),
    remove: (username, token) => deleteUser(usersResource, { username }, token),
    edit: ({ username, new_role, token }) =>
        editUser(usersResource, { username, new_role }, token ),
};

export { Users };

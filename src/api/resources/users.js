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
    register: () => register(usersResource),
    login: () => login(usersResource),
    remove: (username) => deleteUser(usersResource, { username }),
    edit: ({ username, new_role }) =>
        editUser(usersResource, { username, new_role }),
};

export { Users };

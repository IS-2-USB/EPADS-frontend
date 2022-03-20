import { getAll, get } from "../services";

const projectsResource = "projects";
const Projects = {
    getAll: () => getAll(projectsResource),
    get: (id) => get(projectsResource, id),
};

export { Projects };

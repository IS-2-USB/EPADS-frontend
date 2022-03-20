import React, { useState, useEffect } from "react";
import {
    Divider,
    Drawer,
    FormControl,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
} from "@mui/material";
import PanToolIcon from "@mui/icons-material/PanTool";
import EditIcon from "@mui/icons-material/Edit";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
import SaveIcon from "@mui/icons-material/Save";
import styles from "./userControl.module.scss";
import { useNavigate } from "react-router-dom";
import { Users } from "../../api/resources/users";
import { Projects } from "../../api/resources/projects";
import SearchBar from "../../searchBar";

const drawerWidth = 200;

export default function UserControl() {
    const [editable, setEditable] = useState(null);
    const [projects, setProjects] = useState([]);
    const [editableRole, setEditableRole] = useState("");
    const [editableProjects, setEditableProjects] = useState({
        project1: "",
        project2: "",
    });
    const [rows, setRows] = useState([]);
    const [change, setChange] = useState(false);

    const filteredRows = [];

    const router = useNavigate();

    const createData = (
        id,
        login,
        name,
        lastname,
        role,
        project1,
        project2,
        projects
    ) => {
        return {
            id,
            login,
            name,
            lastname,
            role,
            project1,
            project2,
            projects,
        };
    };

    const roles = ["Product Owner", "Scrum Master", "Scrum Team"];

    function dash() {
        console.log("entre");

        router("/dashboard");
    }

    const editUser = async ({ username, new_role }) => {
        await Users.edit({ username, new_role });
        setChange(!change);
    };

    const deleteUser = async (username) => {
        await Users.remove(username);
        setChange(!change);
        setEditable(false);
    };

    const onChangeRole = (event) => setEditableRole(event.target.value);

    const onChangeProject1 = (event) => {
        const project1 = event.target.value;
        setEditableProjects({ ...editableProjects, project1 });
    };

    const onChangeProject2 = (event) => {
        const project2 = event.target.value;
        setEditableProjects({ ...editableProjects, project2 });
    };

    const onEditClick = ({ id, project1, project2, role }) => {
        setEditable(id);
        setEditableRole(role);
        setEditableProjects({ project1, project2 });
    };

    const onSaveClick = ({ username, new_role }) => {
        editUser({ username, new_role });
        setEditable(false);
    };

    useEffect(async () => {
        const projectsReponse = await Projects.getAll();
        setProjects(projectsReponse.map((project) => project.description));

        let rowsGetted = [];
        const usersResponse = await Users.getAll();
        usersResponse.map((user) => {
            const userProjects = projectsReponse
                .filter((project) => project.user_id == user.id)
                .map((project) => project.description);
            const project1 = userProjects.length > 0 ? userProjects[0] : "";
            const project2 = userProjects.length > 1 ? userProjects[1] : "";
            rowsGetted.push(
                createData(
                    user.id,
                    user.username,
                    user.first_name,
                    user.last_name,
                    user.role,
                    project1,
                    project2,
                    userProjects
                )
            );
        });
        setRows(rowsGetted);
    }, [change]);

    return (
        <div className={styles.container}>
            <div className={styles.container}>
                <h1>Usuarios</h1>
                <div className={styles.header}>
                    <SearchBar />
                </div>
                <div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Id </TableCell>
                                    <TableCell align="center">
                                        Usuario
                                    </TableCell>
                                    <TableCell align="center">Nombre</TableCell>
                                    <TableCell align="center">
                                        Apellido
                                    </TableCell>
                                    <TableCell align="center">Rol</TableCell>
                                    <TableCell align="center">
                                        Proyecto 1
                                    </TableCell>
                                    <TableCell align="center">
                                        Proyecto 2
                                    </TableCell>
                                    <TableCell align="center">
                                        Acciones
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.login}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.lastname}
                                        </TableCell>
                                        <TableCell align="center">
                                            {editable === row.id ? (
                                                <FormControl
                                                    className={styles.select}
                                                >
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={editableRole}
                                                        style={{
                                                            height: "40px",
                                                        }}
                                                        onChange={onChangeRole}
                                                    >
                                                        {roles.map((role) => (
                                                            <MenuItem
                                                                key={role}
                                                                value={role}
                                                            >
                                                                {role}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                row.role
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {editable === row.id ? (
                                                <FormControl
                                                    className={styles.select}
                                                >
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={
                                                            editableProjects.project1
                                                        }
                                                        style={{
                                                            height: "40px",
                                                        }}
                                                        onChange={
                                                            onChangeProject1
                                                        }
                                                    >
                                                        {row.projects.map(
                                                            (project) => (
                                                                <MenuItem
                                                                    key={
                                                                        project
                                                                    }
                                                                    value={
                                                                        project
                                                                    }
                                                                >
                                                                    {project}
                                                                </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                row.project1
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {editable === row.id ? (
                                                <FormControl
                                                    className={styles.select}
                                                >
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={
                                                            editableProjects.project2
                                                        }
                                                        style={{
                                                            height: "40px",
                                                        }}
                                                        onChange={
                                                            onChangeProject2
                                                        }
                                                    >
                                                        {row.projects.map(
                                                            (project) => (
                                                                <MenuItem
                                                                    key={
                                                                        project
                                                                    }
                                                                    value={
                                                                        project
                                                                    }
                                                                >
                                                                    {project}
                                                                </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                row.project2
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className={styles.icons_row}>
                                                <div
                                                    onClick={() => {
                                                        onEditClick({
                                                            id: row.id,
                                                            project1:
                                                                row.project1,
                                                            project2:
                                                                row.project2,
                                                            role: row.role,
                                                        });
                                                    }}
                                                >
                                                    <EditIcon />
                                                </div>
                                                <div
                                                    onClick={() =>
                                                        deleteUser(row.login)
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </div>
                                                <div
                                                    style={{
                                                        cursor: "pointer",
                                                        visibility:
                                                            editable === row.id
                                                                ? "unset"
                                                                : "hidden",
                                                    }}
                                                    onClick={() =>
                                                        onSaveClick({
                                                            username: row.login,
                                                            new_role: editableRole,
                                                        })
                                                    }
                                                >
                                                    <SaveIcon
                                                        style={{
                                                            color: "green",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <Divider />
                <List>
                    {[
                        { name: "Proyectos", icon: <FolderIcon /> },
                        { name: "Usuarios", icon: <PeopleIcon /> },
                        { name: "Eventos", icon: <EventNoteIcon /> },
                    ].map(({ name, icon }, index) => (
                        <ListItem button onClick={() => dash()} key={name}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={name} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </div>
    );
}

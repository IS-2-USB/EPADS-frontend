import React, { useState } from "react";
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
import styles from "./UserControl.scss";
const drawerWidth = 200;

export default function UserControl() {
    const [editable, setEditable] = useState(null);
    const createData = (
        id,
        login,
        name,
        lastname,
        role,
        projects1,
        projects2
    ) => {
        return { id, login, name, lastname, role, projects1, projects2 };
    };
    const projects = ["Proyecto 1", "Proyecto 2", "Proyecto 3", "Proyecto 4"];

    const roles = ["Product Owner", "Scrum Master", "Developer"];

    const rows = [
        createData(
            1,
            "juanperez",
            "Juan",
            "Perez",
            roles[0],
            projects[0],
            projects[2]
        ),
        createData(
            2,
            "juanperez",
            "Juan",
            "Perez",
            roles[1],
            projects[2],
            projects[1]
        ),
        createData(
            3,
            "juanperez",
            "Juan",
            "Perez",
            roles[0],
            projects[3],
            projects[0]
        ),
    ];
    return (
        <>
            <div className={styles.container}>
                <h1>Usuarios</h1>
                <div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width: "10%"}}>Id </TableCell>
                                    <TableCell align="center" style={{width: "12.5%"}}>
                                        Usuario
                                    </TableCell>
                                    <TableCell align="center" style={{width: "12.5%"}}>Nombre</TableCell>
                                    <TableCell align="center" style={{width: "12.5%"}}>
                                        Apellido
                                    </TableCell>
                                    <TableCell align="center" style={{width: "12.5%"}}>Rol</TableCell>
                                    <TableCell align="center" style={{width: "12.5%"}}>
                                        Proyecto 1
                                    </TableCell>
                                    <TableCell align="center" style={{width: "12.5%"}}>
                                        Proyecto 2
                                    </TableCell>
                                    <TableCell align="center" style={{width: "15%"}}>Acciones</TableCell>
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
                                                        value={row.role}
                                                        style={{
                                                            height: "40px",
                                                        }}
                                                        // onChange={handleChange}
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
                                                        value={row.projects1}
                                                        style={{
                                                            height: "40px",
                                                        }}
                                                        // onChange={handleChange}
                                                    >
                                                        {projects.map(
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
                                                row.projects1
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
                                                        value={row.projects2}
                                                        style={{
                                                            height: "40px",
                                                        }}
                                                        // onChange={handleChange}
                                                    >
                                                        {projects.map(
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
                                                row.projects2
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className={styles.icons_row}>
                                                <PanToolIcon />
                                                <div
                                                    onClick={() =>
                                                        setEditable(row.id)
                                                    }
                                                >
                                                    <EditIcon />
                                                </div>
                                                <DeleteIcon />
                                                <div
                                                    style={{
                                                        cursor: "pointer",
                                                        visibility:
                                                            editable === row.id
                                                                ? "unset"
                                                                : "hidden",
                                                    }}
                                                    onClick={() =>
                                                        setEditable(false)
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
                        <ListItem button key={name}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={name} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
}

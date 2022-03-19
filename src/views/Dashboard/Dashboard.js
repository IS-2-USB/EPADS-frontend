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
import styles from "./dashboard.module.scss";
import SearchBar from "../../searchBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
const drawerWidth = 200;

export default function Dashboard() {
  const [editable, setEditable] = useState(null);
  const router = useNavigate();

  const createData = (id, descripcion, tipo, acciones) => {
    return { id, descripcion, tipo, acciones };
  };

  const rows = [
    createData(1, "Proyecto 1", "Ninguno"),
    createData(2, "Proyecto 2", "Ninguno"),
    createData(3, "Proyecto 3", "Ninguno"),
  ];

  function user() {
    console.log("entre");

    router("/users");
  }
  return (
    <>
      <div className={styles.container}>
        <h1>Proyectos</h1>
        <SearchBar />
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Id </TableCell>
                  <TableCell align="center">Descripcion</TableCell>
                  <TableCell align="center">Tipo</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">{row.descripcion}</TableCell>
                    <TableCell align="center">
                      {editable === row.id ? (
                        <FormControl className={styles.select}>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={10}
                            style={{ height: "40px" }}
                            // onChange={handleChange}
                          >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        row.tipo
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <div className={styles.icons_row}>
                        <PanToolIcon />
                        <div onClick={() => setEditable(row.id)}>
                          <EditIcon />
                        </div>
                        <DeleteIcon />
                        <div
                          style={{
                            cursor: "pointer",
                            visibility:
                              editable === row.id ? "unset" : "hidden",
                          }}
                          onClick={() => setEditable(false)}
                        >
                          <SaveIcon style={{ color: "green" }} />
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
            <ListItem button onClick={() => user()} key={name}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

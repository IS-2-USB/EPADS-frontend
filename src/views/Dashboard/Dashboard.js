import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
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
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchService } from "../../services/api";
import { useAuth } from "../../context/authContext";
const drawerWidth = 200;

export default function Dashboard() {
  const { state } = useAuth();
  const [currentPage, setCurrenPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const queryClient = useQueryClient();
  const [editable, setEditable] = useState(null);
  const [description, setDescription] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const router = useNavigate();
  const { data } = useQuery("projects", () =>
    fetchService({ url: `/projects/getall/${state.id || 1}` })
  );
  useEffect(() => {
    if (data) {
      const startData = (currentPage - 1) * 5;
      const endData = startData + 5;
      setPageCount(Math.ceil(data.length / 5));
      setProjects(data.reverse().slice(startData, endData));
    }
  }, [data, currentPage]);
  const { mutate } = useMutation(
    (values) => {
      return fetchService({
        url: "/projects/add",
        params: { description: values.description, user_id: state.id || 1 },
        method: "POST",
        token: "",
      });
    },
    {
      onSuccess: () => {
        closeModal();
        queryClient.invalidateQueries("projects");
      },
      onError: (error) => console.log(error),
    }
  );

  function user() {
    router("/users");
  }

  const createProject = () => {
    mutate({ description });
  };

  const handleOnChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };
  return (
    <>
      <div className={styles.container}>
        <h1>Proyectos</h1>
        <Dialog open={isOpenModal} onClose={closeModal}>
          <DialogTitle>Crear nuevo proyecto</DialogTitle>
          <div className={styles.form}>
            <TextField
              label="Descripcion"
              onChange={handleOnChangeDescription}
              onKeyDown={(e) => {
                e.key === "Enter" && createProject();
              }}
            />
          </div>
          <div className={styles.controls}>
            <Button variant="outlined" onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={createProject}>
              Crear
            </Button>
          </div>
        </Dialog>
        <div className={styles.header}>
          <SearchBar />
          <Button
            variant="outlined"
            className={styles["header__button"]}
            onClick={() => setIsOpenModal(true)}
          >
            Crear proyecto
          </Button>
        </div>
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
                {projects.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">{row.description}</TableCell>
                    <TableCell align="center">
                      {editable === row.id ? (
                        <FormControl className={styles.select}>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={10}
                            style={{ height: "40px" }}
                            variant="standard"
                            // onChange={handleChange}
                          >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        "Tipo"
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
          <div className={styles.paginationContainer}>
            <Pagination
              count={pageCount}
              onChange={(_, page) => setCurrenPage(page)}
            />
          </div>
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

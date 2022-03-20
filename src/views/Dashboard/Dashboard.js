import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
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
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
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
  const [type, setType] = useState("Ninguno");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [projects, setProjects] = useState([]);
  const router = useNavigate();
  const { data } = useQuery("projects", () =>
    fetchService({ url: `/projects/getall/${state.id || 1}` })
  );

  useEffect(() => {
    if (data) {
      let filterData = data;
      if (searchValue) {
        filterData = data.filter((project) =>
          project.description
            .toLowerCase()
            .includes(searchValue.toLocaleLowerCase())
        );
      }
      const startData = (currentPage - 1) * 5;
      const endData = startData + 5;
      setPageCount(Math.ceil(filterData.length / 5));
      setProjects(filterData.reverse().slice(startData, endData));
    }
  }, [data, currentPage, searchValue]);

  const onSearch = ({ target }) => {
    setSearchValue(target.value);
  };

  const { mutate: deleteProjectMutation } = useMutation(
    (id) => {
      return fetchService({
        url: `/projects/delete/${id}`,
        method: "DELETE",
        token: "",
      });
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries("projects");
      },
      onError: (error) => console.log(error),
    }
  );
  const { mutate: updateProjectMutation } = useMutation(
    ({ id, description }) => {
      return fetchService({
        url: `/projects/update/${id}`,
        method: "PUT",
        params: { description, user_id: state.id, type },
        token: "",
      });
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries("projects");
      },
      onError: (error) => console.log(error),
    }
  );

  const { mutate: pauseProject } = useMutation(
    ({ id }) => {
      return fetchService({
        url: `/projects/pause/${id}`,
        method: "PATCH",
        token: "",
      });
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries("projects");
      },
      onError: (error) => console.log(error),
    }
  );

  const { mutate: reactivateProject } = useMutation(
    ({ id }) => {
      return fetchService({
        url: `/projects/reactivate/${id}`,
        method: "PATCH",
        token: "",
      });
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries("projects");
      },
      onError: (error) => console.log(error),
    }
  );

  const { mutate } = useMutation(
    (values) => {
      return fetchService({
        url: "/projects/add",
        params: {
          description: values.description,
          user_id: state.id || 1,
          type: values.type,
        },
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
    mutate({ description, type });
  };

  const handleOnChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const editProject = (id, currentDesc) => {
    updateProjectMutation({
      id,
      description: description || currentDesc,
      type,
    });
    setEditable(null);
    setDescription("");
  };

  const onChangeType = ({ target }) => {
    setType(target?.value);
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
            <FormControl>
              <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="Tipo"
                onChange={onChangeType}
              >
                <MenuItem value={"Ninguno"}>Ninguno</MenuItem>
                <MenuItem value={"ISO-IEC 25010"}>ISO-IEC 25010</MenuItem>
                <MenuItem value={"ISO-IEC 33000"}>ISO-IEC 33000</MenuItem>
              </Select>
            </FormControl>
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
          <SearchBar onSearch={onSearch} />
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
                    <TableCell align="center">
                      {editable === row.id ? (
                        <TextField
                          label=""
                          variant="standard"
                          onChange={handleOnChangeDescription}
                          defaultValue={row.description}
                          onKeyDown={(e) => {
                            e.key === "Enter" && editProject(row.id);
                          }}
                        />
                      ) : (
                        row.description
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {editable === row.id ? (
                        <FormControl className={styles.select}>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={type}
                            style={{ height: "40px" }}
                            variant="standard"
                            defaultValue={row.type}
                            onChange={onChangeType}
                          >
                            <MenuItem value={"Ninguno"}>Ninguno</MenuItem>
                            <MenuItem value={"ISO-IEC 25010"}>
                              ISO-IEC 25010
                            </MenuItem>
                            <MenuItem value={"ISO-IEC 33000"}>
                              ISO-IEC 33000
                            </MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        row.type
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <div className={styles.icons_row}>
                        {row.status === "active" ? (
                          <div
                            onClick={() => pauseProject({ id: row.id })}
                            style={{ cursor: "pointer" }}
                          >
                            <PanToolIcon />
                          </div>
                        ) : (
                          <div
                            onClick={() => reactivateProject({ id: row.id })}
                            style={{ cursor: "pointer" }}
                          >
                            <PlayCircleFilledIcon />
                          </div>
                        )}
                        <div
                          onClick={() => setEditable(row.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <EditIcon />
                        </div>
                        <div
                          onClick={() => deleteProjectMutation(row.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <DeleteIcon />
                        </div>
                        <div
                          style={{
                            cursor: "pointer",
                            visibility:
                              editable === row.id ? "unset" : "hidden",
                          }}
                          onClick={() => setEditable(false)}
                        >
                          <div
                            onClick={() => editProject(row.id, row.description)}
                          >
                            <SaveIcon style={{ color: "green" }} />
                          </div>
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

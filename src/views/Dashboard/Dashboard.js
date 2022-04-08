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
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
import SaveIcon from "@mui/icons-material/Save";
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
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
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [general, setGeneral] = useState("");
  const [specifics, setSpecifics] = useState("");
  const [motivations, setMotivations] = useState("");
  const [version, setVersion] = useState(0);
  const [type, setType] = useState("Ninguno");
  const [representation, setRepresentation] = useState("");
  const [currentId, setCurrentId] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModal2, setIsOpenModal2] = useState(false);
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
        params: { description, user_id: state.id, type, name, representation, general, specifics, motivations },
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

  function dash(){
    router("/dashboard")
  }

  function logger(){
    router("/logger")
  }

  function quality(){
    router("/quality")
  }

  const createProject = () => {
    mutate({ description, type, version, general, specifics, motivations });
    setVersion(0);
    setType("Ninguno");
    setRepresentation("");
    setDescription("");
  };

  const handleOnChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const closeModal2 = () => {
    setIsOpenModal2(false);
  };

  const editProject = (id, currentDesc) => {
    updateProjectMutation({
      id,
      description: description || currentDesc,
      type,
      name,
      general,
      specifics,
      motivations,
      version,
      representation,
    });
    setEditable(null);
    setDescription("");
    setVersion(0);
    setType("Ninguno");
    setRepresentation("");
  };

  const onChangeType = ({ target }) => {
    setType(target?.value);
  };

  const onChangeRepresentation = ({ target }) => {
    setRepresentation(target?.value);
  };

  const onChangeVersion = ({ target }) => {
    setVersion(target?.value);
  };

  const onChangeGeneral = ({target}) => {
    setGeneral(target?.value);
  }; 

  const onChangeSpecifics = ({ target }) => {
    setSpecifics(target?.value);
  }; 

  const onChangeMotivations = ( { target } ) => {
    setMotivations(target?.value);
  };

  const onChangeName = ( { target } ) => {
    setName(target?.value);
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
        <Dialog open={isOpenModal2} onClose={closeModal2}>
          <DialogTitle>Generar proyecto</DialogTitle>
          <div className={styles.form}>
            <TextField
              label="Nombre"
              onChange={onChangeName}
              value = {name}
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
            <TextField
              label="Version"
              onChange={onChangeVersion}
              onKeyDown={(e) => {
                e.key === "Enter" && createProject();
              }}
              type = 'number'
              defaultValue={version}
            />
            <FormControl>
              <InputLabel id="demo-simple-select-label">Representacion</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={representation}
                label="Representacion"
                onChange={onChangeRepresentation}
              >
                <MenuItem value={"Etapas"}>Etapas</MenuItem>
                <MenuItem value={"Continua"}>Continua</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Objetivo General"
              onChange={onChangeGeneral}
              multiline
            />
             <TextField
              label="Objetivos Especificos"
              onChange={onChangeSpecifics}
              multiline
            />
             <TextField
              label="Motivacion"
              onChange={onChangeMotivations}
              multiline
            />
          </div>
          <div className={styles.controls}>
            <Button variant="outlined" onClick={closeModal2}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={() => { 
              editProject(currentId);
              closeModal2();
              setName("");
              setGeneral("");
              setSpecifics("");
              setMotivations("");
              setVersion(0);
              setRepresentation("")
            }}>
              Generar
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
                        <div
                          onClick={() => {
                            setIsOpenModal2(true);
                            setDescription(row.description);
                            setVersion(row.version)
                            setType(row.type)
                            setCurrentId(row.id)
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <ArticleIcon />
                        </div>
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
                          onClick={() => {
                            setEditable(row.id)
                            setDescription(row.description)
                            setType(row.type)
                          }}
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
                          style={{ cursor: "pointer" }}
                        >
                          <DownloadIcon />
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
            { name: "Proyectos", redirect: () => {dash()}, icon: <FolderIcon /> },
            { name: "Usuarios", redirect: () => {user()}, icon: <PeopleIcon /> },
            { name: "Eventos", redirect: () => {logger()}, icon: <EventNoteIcon /> },
            { name: "Calidad", redirect: () => {quality()}, icon: <WorkspacePremiumRoundedIcon />},
          ].map(({ name, redirect, icon }, index) => (
            <ListItem button onClick={redirect} key={name}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

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
import EditIcon from "@mui/icons-material/Edit";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
import AddBoxIcon from '@mui/icons-material/AddBox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SaveIcon from "@mui/icons-material/Save";
import styles from "./process.module.scss";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchService } from "../../services/api";
import { useAuth } from "../../context/authContext";
const drawerWidth = 200;

export default function Process() {
  const { state } = useAuth();
  const [currentPage, setCurrenPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [editable, setEditable] = useState(null);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Ninguno");
  const [currentId, setCurrentId] = useState(0);
  const [isOpenModal2, setIsOpenModal2] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModal3, setIsOpenModal3] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [projects, setProjects] = useState([]);
  const [datos, setDatos] = useState([[{id: 1, proceso: "prueba", valor: 30}, {id: 2, proceso: "hola", valor: 50}],
                                      [{id: 1, proceso: "suministro", valor: 40}, {id: 2, proceso: "suministro2", valor: 60}]]);
  const router = useNavigate();
  const { dispatch } = useAuth();
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

  const { mutate: deleteProjectMutation } = useMutation(
    (id) => {
      // se debe hacer un fetch para eliminarlo en la base de datos
      for (let index = 0; index < datos[group].length; index++) {
        const element = datos[group][index];
        if(element.id === id){
          return datos[group].splice(index, 1);
        }
      }
    },
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

  function process(){
    router("/process")
  }

  function exit(){
    dispatch({
      type: "logout"
    });
    router("/")
  }

  const handleOnChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const closeModal2 = () => {
    setIsOpenModal2(false);
  };

  const closeModal3 = () => {
    setIsOpenModal3(false);
  };

  const editProject = (id, currentDesc) => {
    
    // Cambiar esto para la integracion en el backend
    for (let index = 0; index < datos[group].length; index++) {
      const element = datos[group][index];
      if(element.id === id){
        return datos[group][index].proceso = description;
      }
    }
  };

  const editValor = (id) => {

    if(type >= 0 && type <= 100){
      //Cambiar esto para la integracion en el backend
      for (let index = 0; index < datos[group].length; index++) {
        const element = datos[group][index];
        if(element.id === id){
          return datos[group][index].valor = type;
        }
      }
    }
    else{
      alert("el valor debe estar entre 0 y 100")
    }
  };

  const onChangeType = ({ target }) => {
    setType(target?.value);
  };

  const [category, setCategory] = React.useState('');
  const [group, setGroup] = React.useState(0);

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const handleChangeGroup = (event) => {
    setGroup(event.target.value);
  };

  return (
    <>
      <div className={styles.container}>
        <h1>Procesos</h1>
        <Dialog open={isOpenModal3} onClose={closeModal3}>
          <DialogTitle>Crear nuevo grupo de procesos</DialogTitle>
          <div className={styles.form}>
            <TextField
              label="Nombre del grupo"
              onChange={handleOnChangeDescription}
            />
          </div>
          <div className={styles.controls}>
            <Button variant="outlined" onClick={closeModal3}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={closeModal3}>
              Crear
            </Button>
          </div>
        </Dialog>
        <Dialog open={isOpenModal} onClose={closeModal}>
          <DialogTitle>Crear nuevo proceso</DialogTitle>
          <div className={styles.form}>
            <TextField
              label="Nombre del proceso"
              onChange={handleOnChangeDescription}
            />
          </div>
          <div className={styles.controls}>
            <Button variant="outlined" onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={closeModal}>
              Crear
            </Button>
          </div>
        </Dialog>
        <Dialog open={isOpenModal2} onClose={closeModal2}>
          <DialogTitle>Cambiar valor</DialogTitle>
          <div className={styles.form}>
          <TextField
              label="valor"
              onChange={onChangeType}
              value = {type}
          />
          </div>
          <div className={styles.controls}>
            <Button variant="outlined" onClick={closeModal2}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={() => { 
              editValor(currentId);
              closeModal2();
            }}>
              Guardar
            </Button>
          </div>
        </Dialog>
        <div className={styles.headerCategory}>
            <FormControl className={styles.form}>
                <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    label="category"
                    onChange={handleChange}
                >
                    <MenuItem value={"Procesos primarios"}>Procesos primarios</MenuItem>
                    <MenuItem value={"Procesos organizacionales"}>Procesos organizacionales</MenuItem>
                    <MenuItem value={"Procesos de soporte"}>Procesos de soporte</MenuItem>
                </Select>
            </FormControl>
            <Button variant="text" color="success" onClick={() => { setIsOpenModal(true);}}>
              <AddBoxIcon />
            </Button>
        </div>
        <div>
            <h5>Categoria: {category}</h5>
            <div className={styles.group}>
                <h5>Grupo de procesos: </h5>
                <FormControl className={styles.form}>
                    <InputLabel id="demo-simple-select-label">Grupo</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={group}
                        label="group"
                        onChange={handleChangeGroup}
                    >
                      {/* colocar los grupos que vengan de la base de datos */}
                        <MenuItem value={0}>Adquisicion</MenuItem>
                        <MenuItem value={1}>Suministro</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="text" color="success" onClick={() => { setIsOpenModal3(true);}}>
                  <AddBoxIcon />
                </Button>
            </div>
        </div>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Id </TableCell>
                  <TableCell align="center">Proceso</TableCell>
                  <TableCell align="center">Valor %</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datos[group].map((row) => (
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
                          defaultValue={row.proceso}
                          onKeyDown={(e) => {
                            e.key === "Enter" && editProject(row.id);
                          }}
                        />
                      ) : (
                        row.proceso
                      )}
                    </TableCell>
                    <TableCell align="center" style={{width: "11rem"}}>
                      { (
                        row.valor
                      )}
                      <div
                          onClick={() => {
                            setIsOpenModal2(true);
                            setType(row.valor)
                            setCurrentId(row.id)
                          }}
                          style={{ cursor: "pointer", float: "right" }}
                        >
                          <AddBoxIcon />
                        </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className={styles.icons_row}>
                        <div
                          onClick={() => {
                            setEditable(row.id)
                            setDescription(row.proceso)
                            setType(row.valor)
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
                          style={{
                            cursor: "pointer",
                            visibility:
                              editable === row.id ? "unset" : "hidden",
                          }}
                          onClick={() => setEditable(false)}
                        >
                          <div
                            onClick={() => editProject(row.id, row.proceso)}
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
        <Toolbar>
          <Button variant="contained" style={{background: "red"}} onClick={() => { exit()}}>
            <h6 style={{fontSize: "smaller", marginBottom: "0", marginLeft: "2px"}}>Cerrar sesión</h6>
            <ExitToAppIcon />
          </Button>
        </Toolbar>
        <Divider />
        <List>
          {[
            { name: "Proyectos", redirect: () => {dash()}, icon: <FolderIcon /> },
            { name: "Usuarios", redirect: () => {user()}, icon: <PeopleIcon /> },
            { name: "Eventos", redirect: () => {logger()}, icon: <EventNoteIcon /> },
            { name: "Procesos", redirect: () => {process()}, icon: <FolderIcon /> },
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

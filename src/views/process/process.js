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

import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

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
  const queryClient = useQueryClient();
  const [editable, setEditable] = useState(null);

  const [description, setDescription] = useState("");
  const [value, setValue] = useState(100);
  const [projectId, setProjectId] = useState(1);
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(1)

  const [type, setType] = useState("Ninguno");
  const [oldType, setOldType] = useState("Ninguno");
  const [currentId, setCurrentId] = useState(0);
  const [isOpenModal2, setIsOpenModal2] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModal3, setIsOpenModal3] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [processes, setProcesses] = useState([]);

  const router = useNavigate();
  const { dispatch } = useAuth();
  
  const { data } = useQuery("processes", () => 
    fetchService({ url: `/processes/getall/${projectId}` })
  );

  const { groupData } = useQuery("groups", () =>
    fetchService({ url: `/processes/groups/getall` })
  );

  
  /** Get groups */
  const fetchGroupData = async () => {
    return fetch("http://localhost:5000/processes/groups/getall")
          .then((response) => {return response.json()} )
          .then((data) => { setGroups(Array.from(data)) }  )}

  useEffect(() => {
    if (data) {
      let filterData = data;
      if (searchValue) {
        filterData = data.filter((process) => { 
          process.name
            .toLowerCase()
            .includes(searchValue.toLocaleLowerCase())
          }
        );
      }

      //const startData = (currentPage - 1) * 5;
      //const endData = startData + 5;
      //setPageCount(Math.ceil(filterData.length / 5));
      //setProcesses(filterData.slice(startData, endData));
      setProcesses(filterData)
      
      /** Get group data */
      const group_data = fetchGroupData();
      setGroups(Array.from(group_data));
    }
  }, [data, currentPage, searchValue]);



  /** Delete process */
  const { mutate: deleteProcessMutation } = useMutation(
    (id) => {
      return fetchService({
        url: `/processes/delete/${id}`,
        method: "DELETE",
        token: "",
      });
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries("processes");
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
    setNewProcessName(e.target.value);
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


  /** Create process */
  const { mutate } = useMutation(
    (values) => {
      return fetchService({
        url: "/processes/add",
        params: {
          name: values.description,
          category: categoryName,
          value: values.value,
          group_id: currentGroup,
          project_id: 1,
        },
        method: "POST",
        token: "",
      });
    },
    {
      onSuccess: () => {
        closeModal();
        queryClient.invalidateQueries("processes");
      },
      onError: (error) => console.log(error),
    }
  );


  /** Create process */
  function createProcess() {
      mutate({ description, categoryName, value, currentGroup, projectId });
      setDescription("")
  }


  /** Update process */
  const { mutate: updateProcessMutation } = useMutation(
    ({ id, description }) => {
      return fetchService({
        url: `/processes/update/${id}`,
        method: "PUT",
        params: {
          name: description,
          value: type,
        },
        token: "",
      });
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries("processes");
      },
      onError: (error) => console.log(error),

    }
  );

  /** editProcess: Updates the name of the process */
  const editProcess = (id, currentDesc) => {
    updateProcessMutation({id, description: newProcessName || currentDesc});
    setDescription("");
    setNewProcessName("");
  };

  /** editValue: Updates the value of the process */
  const editValue = (id) => {
    if(isNaN(+type) === isNaN(+oldType)){
      if(isNaN(+type)){
        updateProcessMutation({id, description: newProcessName})
        setNewProcessName("")
      }
      else if((type >= 0 && type <= 100) &&  !isNaN(+type)){
        updateProcessMutation({id, description: newProcessName})
        setNewProcessName("")
      }
      else{
        alert("El valor debe estar entre 0 y 100")
      }
    }
    else{
      alert("Los tipos deben de coincidir")
    }
  };

  /** Create group */
  const { mutate: createGroupMutation } = useMutation(
    (values) => {
      return fetchService({
        url: "/processes/groups/add",
        params: {
          name: description,
        },
        method: "POST",
        token: "",
      });
    },
    {
      onSuccess: () => {
        closeModal();
        queryClient.invalidateQueries("groups");
      },
      onError: (error) => console.log(error),
    }
  );

  /** Create group */
  const createGroup = () => {
    createGroupMutation({ description });
    setDescription("");
  };


  const onChangeType = ({ target }) => {
    setType(target?.value);
  };

  const [category, setCategory] = React.useState(0);
  const [categoryName, setCategoryName] = React.useState("Primarios");
  const [newProcessName, setNewProcessName] = React.useState("");
  //const [group, setGroup] = React.useState(0);
  const [valorAddGroup, setValorAddGroup] = React.useState("");

  const [group, setGroup] = React.useState(["Adquisición", "Suministro"])

  /* Add new group to list
  function createGroup() {
    let index = group.length + 1
    group.splice(index, 0, description)
    setDescription("")
  }
  */

  /** handleChange: When the processes' category is changed */ 
  const handleChange = (event) => {
    setCategory(event.target.value);

    if (event.target.value == 0) setCategoryName("Primarios");
    if (event.target.value == 1) setCategoryName("Organizacionales");
    if (event.target.value == 2) setCategoryName("Soporte");
  };

  const handleChangeValor = (event) => {
    setValorAddGroup(event.target.value);
  };

  const handleChangeGroup = (event) => {
    //setGroup(event.target.value);
    setCurrentGroup(event.target.value);
  };

  /** Get category name */
  const getCategory = () => {
      if (category==0) return "Procesos Primarios"
      if (category==1) return "Procesos Organizacionales"
      if (category==2) return "Procesos de Soporte"
  }

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
              value={description}
            />

          {/* 
          <FormControl className={styles.selectModal} style={{ marginTop: "20px"}}>
            <InputLabel id="demo-simple-select-label">Valor</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valorAddGroup}
                label="valorAddGroup"
                onChange={handleChangeValor}
            >
                {/* colocar los procesos que vengan de la base de datos /}
                <MenuItem value={"cualitativo"}>Cualitativo</MenuItem>
                <MenuItem value={"cuantitativo"}>Cuantitativo</MenuItem>
            </Select>
          </FormControl>
          */}


          </div>
          <div className={styles.controls}>
            <Button variant="outlined" onClick={closeModal3}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={() => { 
              createGroup();
              closeModal3();
            }}>
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
              value={description}
            />
          </div>
          <div className={styles.controls}>
            <Button variant="outlined" onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={() => { 
              createProcess();
              closeModal();
            }}>
              Crear
            </Button>
          </div>
        </Dialog>
        <Dialog open={isOpenModal2} onClose={closeModal2}>
          <DialogTitle>Cambiar valor</DialogTitle>
          <div className={styles.form}>
          <TextField
              label="Valor"
              onChange={onChangeType}
              type="number"
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              value = {type}
          />
          </div>
          <div className={styles.controls}>
            <Button variant="outlined" onClick={closeModal2}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={() => { 
              editValue(currentId);
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
                    {/* colocar los procesos que vengan de la base de datos */}
                    <MenuItem value={0}>Procesos primarios</MenuItem>
                    <MenuItem value={1}>Procesos organizacionales</MenuItem>
                    <MenuItem value={2}>Procesos de soporte</MenuItem>
                </Select>
            </FormControl>
            <Button variant="text" color="success" onClick={() => { setIsOpenModal(true);}}>
              <AddBoxIcon />
            </Button>
        </div>
        <div>
            <h5>Categoría: {getCategory()}</h5>
            <div className={styles.group}>
                <h5>Grupo de procesos: </h5>
                <FormControl className={styles.form}>
                    <InputLabel id="demo-simple-select-label">Grupo</InputLabel>

                    {/*
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={group}
                        label="group"
                        onChange={handleChangeGroup}
                    >
                      {/* colocar los grupos que vengan de la base de datos /}
                        <MenuItem value={0}>Adquisición</MenuItem>
                        <MenuItem value={1}>Suministro</MenuItem>
                    </Select>
                    */}

                    <Select value={currentGroup} onChange={handleChangeGroup}>
                        {groups?.map(element => {
                            return (
                                <MenuItem key={element.id} value={element.id}>{element.name}</MenuItem>
                            )
                        })}
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
                  <TableCell align="center">Valor</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {processes
                .filter(process => process.category == categoryName && process.group_id == currentGroup)
                .map((row) => (
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
                          defaultValue={row.name}
                          onKeyDown={(e) => {
                            e.key === "Enter" && editProcess(row.id);
                          }}
                        />
                      ) : (
                        row.name
                      )}
                    </TableCell>
                    <TableCell align="center" style={{width: "11rem"}}>
                      { (
                        row.value + "%"
                      )}
                      <div
                          onClick={() => {
                            setOldType(row.value)
                            setIsOpenModal2(true);
                            setType(row.value)
                            setCurrentId(row.id)
                            setNewProcessName(row.name)
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
                            setDescription(row.name)
                            setType(row.value)
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <EditIcon />
                        </div>
                        <div
                          onClick={() => deleteProcessMutation(row.id)}
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
                            onClick={() => editProcess(row.id, row.name)}
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
            { name: "Calidad", redirect: () => {process()}, icon: <WorkspacePremiumRoundedIcon />},
            { name: "Procesos", redirect: () => {process()}, icon: <AccountTreeIcon /> },
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

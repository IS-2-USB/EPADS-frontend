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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DownloadIcon from '@mui/icons-material/Download';
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
import SaveIcon from "@mui/icons-material/Save";
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import styles from "./quality.module.scss";
import SearchBar from "../../searchBar";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchService } from "../../services/api";
import { useAuth } from "../../context/authContext";
const drawerWidth = 200;

export default function Quality() {
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
  const [carTables, setCarTables] = useState([]);
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


  const closeModal = () => {
    setIsOpenModal(false);
  };

  const closeModal2 = () => {
    setIsOpenModal2(false);
  };

  const selectCarOptions = [
      {
          label: "Adecuación Funcional",
          value: "Adecuación Funcional",
          id: 0,
      },
      {
          label: "Eficacia",
          value: "Eficacia",
          id: 1,
      },
  ];

  let selectSubCarDict = {"Completitud" : {name: "Completitud", id:0, valor: "0"}, "Correctitud" : {name: "Correctitud", id:1, valor:"0"}, "Apropiado" : {name: "Apropiado", id:2, valor:"0"}};

  const selectSubCarOptions = [
    {
        label: "Completitud",
        value: "Completitud",
        valor: "50%",
    },
    {
        label: "Correctitud",
        value: "Correctitud",
        valor: "100%",
    },
    {
        label: "Apropiado",
        value: "Apropiado",
        valor: "30%",
    }
];

  const [selectCar, setSelectCar] = useState("");
  const [selectSubCar, setSelectSubCar] = useState("");
  const [selectCarDict, setSelectCarDict] = useState({"Adecuación Funcional" : [], "Eficacia" : []});


  const handleSelectChange = (e, func) => {
      func(e.target.value);
  }

  const addSubCar = (car, subcar) => {
    
    setSelectCarDict(selectCarDict => ({
      ...selectCarDict,
      [car]: selectCarDict[car].concat(selectSubCarDict[subcar]),
    }));
    console.log(selectCarDict);
  }

  const addCarTable = (car) => {
    setCarTables(carTables => carTables.concat(car));
    console.log(car);
    console.log(carTables);
  }

  const handleValueChange = (e, car, index) => {
    selectCarDict[car][index]["valor"] = e.target.value; 
    console.log(e.target.value);
  }

  const handleSubCarDelete = (e, car, index) => {
    
    setSelectCarDict(selectCarDict => ({
      ...selectCarDict,
      [car]: selectCarDict[car].splice(index,1),
    }));
    console.log(selectCarDict);
  }

  return (
    <>
      <div className={styles.container}>
        <h1>Calidad del Producto de Software</h1>
        
        
        <div className={styles.header}>
        
        <FormControl>
              <InputLabel id="demo-simple-select-label">Característica</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectCar}
                style={{ width: "300px" }}
                label="Tipo"
                onChange= {(e) => handleSelectChange(e, setSelectCar)}
              >
            {selectCarOptions.map((option) => (
              <MenuItem key={option.id} value={option.value}>{option.label}</MenuItem>
            ))}
              </Select>
        </FormControl>
        <div
            onClick={() => {
              addCarTable(selectCar)
            }}
            style={{ cursor: "pointer"}}
            >
            <AddCircleIcon style={{width: "40px", height: "40px"}} />
        </div>
        </div>


        <div>
{carTables?.map((table) => (
      <div key={carTables.id} style={{marginBottom: "50px"}}>

          <div className={styles.header2}>
        
          <FormControl>
          <InputLabel id="demo-simple-select-label2">{table}</InputLabel>
                  <Select
                    id="demo-simple-select2"
                    labelId="demo-simple-select-label2"
                    value={selectSubCar}
                    style={{ width: "300px" }}
                    label="Tipo2"
                    onChange= {(e) => handleSelectChange(e, setSelectSubCar)}
                  >
                  {selectSubCarOptions.map((option) => (
                  <MenuItem key={option.id} value={option.value}>{option.label}</MenuItem>
                ))}
                  </Select>


          </FormControl>
          <div
              onClick={() => {
                  addSubCar(table, selectSubCar)
              }}
              style={{ cursor: "pointer"}}
              >
              <AddCircleIcon style={{width: "40px", height: "40px"}} />
          </div>
          </div>
   <TableContainer component={Paper} className="quality-table">
        
   <Table sx={{ minWidth: 650, marginBottom: "50px"}} aria-label="simple table">
     <TableHead>
       <TableRow>
         <TableCell>Id </TableCell>
         <TableCell align="center">Sub-característica</TableCell>
         <TableCell align="center">Valor</TableCell>
         <TableCell align="center">Acciones</TableCell>
       </TableRow>
     </TableHead>
     <TableBody>
       {selectCarDict[table]?.map((row, index) => (
         <TableRow
           key={row.id}
           sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
         >
           <TableCell component="th" scope="row">
             {index}
           </TableCell>
           <TableCell align="center">
            {row.name}
           </TableCell>
           <TableCell align="center">
             {editable === row.id ? (
                <TextField
                label=""
                variant="standard"
                onChange={(e) => handleValueChange(e,table,index)}
                defaultValue={row.valor}
                /*onKeyDown={(e) => {
                  e.key === "Enter" && editProject(row.id);
                }}*/
              />
             ) : (
               row.valor
             )} %
           </TableCell>
           <TableCell align="center">
             <div className={styles.icons_row}>
               <div
                 onClick={() => {
                   setIsOpenModal2(true);
                   setDescription(row.name);
                   setType(row.valor)
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
                   setDescription(row.name)
                   setType(row.valor)
                 }}
                 style={{ cursor: "pointer" }}
               >
                 <EditIcon />
               </div>
               <div
                 onClick={(e) => handleSubCarDelete(e, table, index)}
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
                   /*onClick={() => editProject(row.id, row.description)}*/
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
   </div>
   ))} 

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

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import styles from "./logger.module.scss";
import SearchBar from "../../searchBar";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchService } from "../../services/api";
import { useAuth } from "../../context/authContext";
const drawerWidth = 200;

export default function Logger() {
  const { state } = useAuth();
  const [currentPage, setCurrenPage] = useState(1);
  const [currentLog, setCurrentLog] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const [loggerEvents, setLoggerEvents] = useState([]);
  const router = useNavigate();
  const { data } = useQuery("logger", () =>
    fetchService({ url: '/logger/getall'})
  );

  useEffect(() => {
    if (data) {
      let filterData = data;
      if (searchValue) {
        filterData = data.filter((loggerEvent) =>
          loggerEvent.event
            .toLowerCase()
            .includes(searchValue.toLocaleLowerCase()) ||
          loggerEvent.loged_module
            .toLowerCase()
            .includes(searchValue.toLocaleLowerCase()) ||
          loggerEvent.user
            .toLowerCase()
            .includes(searchValue.toLocaleLowerCase())
        );
      }
      const startData = (currentPage - 1) * 5;
      const endData = startData + 5;
      setPageCount(Math.ceil(filterData.length / 5));
      setLoggerEvents(filterData.reverse().slice(startData, endData));
    }
  }, [data, currentPage, searchValue]);

  const onSearch = ({ target }) => {
    setSearchValue(target.value);
  };

  const { mutate: deleteLoggerEventMutation } = useMutation(
    (id) => {
      return fetchService({
        url: `/logger/delete/${id}`,
        method: "DELETE",
        token: "",
      });
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries("logger");
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

  return (
    <>
      <div className={styles.container}>
        <h1>Logger de eventos</h1>
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>Detalle del Log</DialogTitle>
            {currentLog && 
            <div className={styles.form}>
              <div>
                <h5 className={styles.inline_display}>Evento: </h5>{currentLog.event}
              </div>
              <div>
                <h5 className={styles.inline_display}>Módulo: </h5>{currentLog.loged_module}
              </div>
              <div>
                <h5 className={styles.inline_display}>Usuario: </h5>{currentLog.user}
              </div>
              <div>
                <h5 className={styles.inline_display}>Fecha: </h5> {currentLog.date}, {currentLog.time} 
              </div>
            </div>
            }
            <div className={styles.controls}>
                <Button variant="outlined" onClick={() => setOpenModal(false)}>
                    Cerrar
                </Button>
            </div>
        </Dialog>
        <div className={styles.header}>
          <SearchBar onSearch={onSearch} />
        </div>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Id </TableCell>
                  <TableCell align="center">Evento</TableCell>
                  <TableCell align="center">Módulo</TableCell>
                  <TableCell align="center">Usuario</TableCell>
                  <TableCell align="center">Fecha</TableCell>
                  <TableCell align="center">Hora</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loggerEvents.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">
                      {row.event}
                    </TableCell>
                    <TableCell align="center">
                      {row.loged_module}
                    </TableCell>
                    <TableCell align="center">
                      {row.user}
                    </TableCell>
                    <TableCell align="center">
                      {row.date}
                    </TableCell>
                    <TableCell align="center">
                      {row.time}
                    </TableCell>
                    <TableCell align="center">
                      <div className={styles.icons_row}>
                        <div
                            onClick={() => {
                              setCurrentLog(row);
                              setOpenModal(true);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <SearchIcon />
                        </div>
                        <div
                          onClick={() => deleteLoggerEventMutation(row.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <DeleteIcon />
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

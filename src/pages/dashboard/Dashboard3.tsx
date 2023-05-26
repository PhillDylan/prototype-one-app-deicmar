import {
  Divider,
  Grid,
  useTheme,
  Button,
  Paper,
  styled,
  Box,
  IconButton,
  AlertTitle,
  Alert,
  AlertColor,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { LayoutBaseDePagina } from "../../shared/layouts";
import React, { useEffect, useState } from "react";
import { green, red } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#ffffff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const Dashboard3 = () => {
  const theme = useTheme();
  const listaItens = useSelector((state: RootState) => state.listaItens); // Obter o estado da store Redux
  const [greenChecked, setGreenChecked] = useState(false);
  const [redChecked, setRedChecked] = useState(true);
  const mensagemFetch = useSelector((state: RootState) => state.mensagemFetch);
  const dadosFetch = useSelector((state: RootState) => state.dadosFetch);
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);
  const [erroEnvio, setErroEnvio] = useState<string | undefined>();
  const [mensagemEnvio, setMensagemEnvio] = useState("");

  useEffect(() => {
    if (listaItens.length > 0 || dadosFetch?.data.obj.container === false) {
      setGreenChecked(true);
      setRedChecked(false);
    } else {
      setGreenChecked(false);
      setRedChecked(true);
    }
  }, [listaItens, dadosFetch]);

  const enviarDados = () => {
    // Restante do código do envio dos dados
    // ...

    // Restante do código do envio dos dados
    const base64ToBlob: any = (base64String: any, mimeType: any) => {
      const byteCharacters: any = atob(base64String);
      const byteArrays: any = [];
      for (let offset: any = 0; offset < byteCharacters.length; offset += 512) {
        const slice: any = byteCharacters.slice(offset, offset + 512);
        const byteNumbers: any = new Array(slice.length);
        for (let i: any = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray: any = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      return new Blob(byteArrays, { type: mimeType });
    };
    var formData = new FormData();
    listaItens.forEach((item: { lacre: string; imagem: Buffer }) => {
      const buffer = item.imagem;
      const blobImage = base64ToBlob(buffer, "image/jpeg");
      const file = new File([blobImage], "imagem.jpg", { type: "image/jpeg" });
      var hora: any = "item.agora";
      var guide: any = "item.guide";
      var tipolacre: any = "item.tipoLacre";
      var agendamento: any = "item.numeroAgendamento4";
      var numerolacre: any = item.lacre;
      var nomeoperador: any = "item.nomeUsuario";
      var idoperador: any = "item.cpf";
      formData.append("file", file);
      formData.append("string", hora);
      formData.append("string", guide);
      formData.append("string", tipolacre);
      formData.append("string", agendamento);
      formData.append("string", numerolacre);
      formData.append("string", nomeoperador);
      formData.append("string", idoperador);
    });
    const username: any = "admin";
    const password: any = "speed12345"; // substitua isso pela senha descriptografada
    const token: any = btoa(`${username}:${password}`);
    var options: any = {
      method: "POST",
      headers: {
        Authorization: "Basic " + token,
      },
      body: formData,
    };
    
    fetch("http://192.168.13.217:1880/cadastrolacre", options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erro ao enviar");
        }
      })
      .then((data) => {
        if (data.agendamento && data.agendamento.message === "Agendamento cadastrado") {
          setAlertSeverity("success");
          setOpen(true);
          setMensagemEnvio(data.message);
          setErroEnvio(undefined);
          handleFetchResult(true, data.agendamento.message);
        } else {
          setAlertSeverity("error");
          setSeverity("error");
          setOpen(true);
          setMensagemEnvio(data.message);
          setErroEnvio(undefined);
          handleFetchResult(false, data.agendamento.message);
        }
        setAlertMessage(data.agendamento.message);
        console.log(data);
      })
      .catch((error) => {
        setAlertSeverity("error");
        setAlertMessage(error.message);
        console.error(error);
        setSeverity("error");
        setOpen(true);
        setErroEnvio(error.message);
      });
  };
  

  const handleFetchResult = (sucesso: boolean, mensagem: string) => {
    setMensagemEnvio(mensagem);
    setSeverity(sucesso ? "success" : "error");
    setErroEnvio(sucesso ? undefined : mensagem);
  };

  return (
    <>
      <LayoutBaseDePagina
        titulo={`CHECKLIST`}
        barraDeFerramentas={
          <Card>
            <CardContent>
              <h3>AGENDAMENTO N° {dadosFetch.data.agendamento.id_agendamento}</h3>
              <h3>SERVIÇO: {dadosFetch.data.agendamento.tipo_serviço}</h3>
            </CardContent>
          </Card>
        }
      >
        <Divider />
        <Box height="100vh">
          <Card variant="outlined" sx={{ height: "100%" }}>
            <Stack spacing={7}>
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemText primary="Status" />
                    <ListItemText primary="Tipo" />
                    <ListItemText primary="Ação" />
                  </ListItem>
  
                  <Divider />
  
                  <ListItem>
                    {dadosFetch !== null && dadosFetch.data.obj.container === true ? (
                      <>
                        <ListItemIcon>
                          <Checkbox
                            {...label}
                            checked={greenChecked}
                            disabled={greenChecked}
                            sx={{
                              color: green[800],
                              "&.Mui-checked": { color: green[600] },
                            }}
                          />
                        </ListItemIcon>
                        <ListItemIcon>
                          <Checkbox
                            {...label}
                            checked={redChecked}
                            disabled={redChecked}
                            sx={{ color: red[800], "&.Mui-checked": { color: red[600] } }}
                          />
                        </ListItemIcon>
                        <ListItemText primary="LACRE" />
                        <ListItemIcon>
                          <Link to="/cadastro-lacre">
                            <Button variant="contained">ADD</Button>
                          </Link>
                        </ListItemIcon>
                      </>
                    ) : null}
                  </ListItem>
  
                  <Divider />
  
                  <ListItem>
                    <ListItemIcon>
                      <Checkbox
                        {...label}
                        checked={mensagemFetch === true || dadosFetch?.data.face === true}
                        disabled={mensagemFetch === true || dadosFetch?.data.face === true}
                        sx={{
                          color: green[800],
                          "&.Mui-checked": { color: green[600] },
                        }}
                      />
                    </ListItemIcon>
                    <ListItemIcon>
                      <Checkbox
                        {...label}
                        checked={mensagemFetch === false && dadosFetch?.data.face === false}
                        disabled={mensagemFetch === false || dadosFetch?.data.face === false}
                        sx={{ color: red[800], "&.Mui-checked": { color: red[600] } }}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Cadastro Facial" />
                    <ListItemIcon>
                      <Link to="/cadastro-facial">
                        <Button variant="contained" disabled={mensagemFetch === true || dadosFetch?.data.face === true}>
                          ADD
                        </Button>
                      </Link>
                    </ListItemIcon>
                  </ListItem>
                </List>
  
                <Collapse in={open}>
                  <Alert
                    variant="filled"
                    severity={severity}
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    <AlertTitle>{severity}</AlertTitle>
                    {erroEnvio || mensagemEnvio}
                  </Alert>
                </Collapse>
  
                <Button
                  variant="contained"
                  size="large"
                  onClick={enviarDados}
                  disabled={!greenChecked || (!mensagemFetch && dadosFetch?.data.face === false)}
                >
                  ENVIAR
                </Button>
              </CardContent>
            </Stack>
          </Card>
        </Box>
      </LayoutBaseDePagina>
    </>
  );
};  

export default Dashboard3;

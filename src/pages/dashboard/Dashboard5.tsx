import {
  Divider,
  Grid,
  useTheme,
  Button,
  Paper,
  TextField,
  Typography,
  AlertTitle,
  Collapse,
  Alert,
  IconButton,
  AlertColor,
  styled,
  Box,
} from "@mui/material";
import { LayoutBaseDePagina } from "../../shared/layouts";
import React, { useEffect, useState } from "react";
import { green, red } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";



const label = { inputProps: { "aria-label": "Checkbox demo" } };


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f2f2f2",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...(theme.palette.mode !== "dark" && {
    background: 'linear-gradient(to right, #FDFBFB, #EBEDEE 70%)',
  }),
  ...(theme.palette.mode === "dark" && {
    background: 'linear-gradient(to right, #434343, #282828 70%)',
  }),
}));

const CardWithGradient = styled(Card)(({ theme }) => ({
  height: '150%',
  ...(theme.palette.mode !== 'dark' && {
    background: 'linear-gradient(to right, #EBEDEE, #FDFBFB 90%)',
  }),
  ...(theme.palette.mode === 'dark' && {
    background: 'linear-gradient(to right, #282828, #434343 90%)',
  }),
}));



export const Dashboard5 = () => {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);
  const [erroEnvio, setErroEnvio] = useState<string | undefined>();
  const [mensagemEnvio, setMensagemEnvio] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cpf, setCpf] = useState("");
  const [statusEnvio, setStatusEnvio] = useState("certo");
  const [file, setFile] = useState<Blob | undefined>();
  const [image, setImage] = useState<
    { url: string; width: number; height: number } | undefined
  >();
  const [imagemBase64, setImagemBase64] = useState<string | undefined>();
  const [imagemSelecionada, setImagemSelecionada] = useState<
    string | undefined
  >();
  const [upImage, setResultImage] = useState<
    { url: string; width: number; height: number } | undefined
  >();

  const dispatch = useDispatch();
  const location = useLocation();

  const handleFetchResult = (mensagem: any) => {
    dispatch({ type: "SET_DADOS_FETCH", payload: mensagem });
  };


  useEffect(() => {
    const resetCache = () => {
      dispatch({ type: "SET_LISTA_ITENS", payload: [] });
      dispatch({ type: "SET_MENSAGEM_FETCH", payload: false });
      dispatch({ type: "SET_DADOS_FETCH", payload: null });
    };

    if (location.pathname === "/agendamento2") {
      resetCache();
    }
  }, [location.pathname, dispatch]);

  const [lacre, setLacre] = useState("");
  const theme = useTheme();
  return (
    <>
      <LayoutBaseDePagina
        titulo="BUSCAR AGENDAMENTO"
        barraDeFerramentas={<></>}
      >
        <Box height="100vh">
        <CardWithGradient sx={{ height: '150%' }}>
            <Stack spacing={5}>
              <CardContent>
                <Item>
                  <TextField
                    fullWidth
                    placeholder="AAA1A11"
                    error={lacre.length < 3}
                    required
                    id="outlined-required"
                    label={<Typography>Required</Typography>}
                    value={lacre}
                    InputLabelProps={{ shrink: true }}
                    margin={"normal"}
                    onChange={(event) => {
                      setLacre(event.target.value);
                    }}
                    helperText={<Typography>Digite a placa</Typography>}
                  />
                </Item>
                <Item>
                  <Grid item>
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
                            {" "}
                            <CloseIcon fontSize="inherit" />{" "}
                          </IconButton>
                        }
                        sx={{ mb: 2 }}
                      >
                        <AlertTitle>{severity}</AlertTitle>
                        {erroEnvio || mensagemEnvio}
                      </Alert>
                    </Collapse>
                  </Grid>
                </Item>
                <Item>
                  <Button
                    variant="contained"
                    disabled={statusEnvio === "enviando"}
                    onClick={async () => {
                      setStatusEnvio("enviando");
                      const username = "admin";
                      const password = "speed12345";
                      const token = btoa(`${username}:${password}`);
                      fetch("http://192.168.13.217:1880/numeroplaca", {
                        method: "POST",
                        headers: { Authorization: "Basic " + token },
                        body: JSON.stringify(lacre),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          console.log(data);
                          console.log(data.status);
                          if (data.status === "sucess") {
                            setSeverity("success");
                            setLacre("");
                            setImagemBase64(undefined);
                            setImagemSelecionada(undefined);
                            setOpen(true);
                            setMensagemEnvio(data.message);
                            setErroEnvio(undefined);
                            handleFetchResult(data);
                            navigate("/checklist");
                          } else {
                            setSeverity("error");
                            setOpen(true);
                            setMensagemEnvio(data.message);
                            setStatusEnvio("erro");
                            setErroEnvio(undefined);
                            handleFetchResult(null);
                          }
                        })
                        .catch((error) => {
                          console.error(error);
                          setSeverity("error");
                          setOpen(true);
                          setStatusEnvio("erro");
                          setErroEnvio(error.message);
                        });
                    }}
                  >
                    {statusEnvio === "enviando"
                      ? "ENVIANDO..."
                      : statusEnvio === "pronto"
                      ? "ENVIADO"
                      : statusEnvio === "erro"
                      ? "REENVIAR"
                      : "SEND"}{" "}
                  </Button>
                </Item>
              </CardContent>
            </Stack>
            </CardWithGradient>
        </Box>
      </LayoutBaseDePagina>
    </>
  );
};

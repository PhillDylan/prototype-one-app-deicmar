import { LayoutBaseDePagina } from "../../shared/layouts";
import { PhotoCamera } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import store, { RootState } from "./store";
import { Link } from "react-router-dom";


export const Dashboard2 = () => {
  const [Lacre, setLacre] = useState("");
  const [image, setImage] = useState<{ url: string; width: number; height: number } | undefined>();
  const [buffer, setBuffer] = useState<ArrayBuffer | undefined>();
  const [imagemSelecionada, setImagemSelecionada] = useState<string | undefined>();
  const [listaItens, setListaItens] = useState<{ agora: string; guide: string; tipoLacre: string; numeroAgendamento: string; lacre: string; nomeUsuario: string; cpf: string; imagem: string }[]>(() => {
    const storedItems = localStorage.getItem("listaItens");
    return storedItems ? JSON.parse(storedItems) : [];
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getImage = () => {
      if (buffer != null) {
        const blob = new Blob([buffer]);
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        img.onload = () => {
          setImage({
            url: img.src,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        };
      }
    };

    getImage();
  }, [buffer]);

  const handleImagemSelecionada = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const imagem = event.target.files[0];
      setImagemSelecionada(URL.createObjectURL(imagem));

      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        setBuffer(arrayBuffer);
      };
      reader.readAsArrayBuffer(imagem);
    }
  };


  useEffect(() => {
    // Salvar os itens no localStorage sempre que houver uma alteração na listaItens
    localStorage.setItem("listaItens", JSON.stringify(listaItens));
  }, [listaItens]);



  const adicionarItem = () => {
    
    console.log(buffer)
    var data: Date = new Date();
    var newdate: string = data.toString();

    
    if (imagemSelecionada && Lacre && buffer) {
      const uint8Array = new Uint8Array(buffer); // Cria um Uint8Array a partir do buffer
  
      let base64String = "";
      uint8Array.forEach((byte) => {
        base64String += String.fromCharCode(byte);
      });
  
      base64String = window.btoa(base64String); // Converte a string em base64
  
      const novoItem = {
        agora: newdate,
        guide: 'guide',
        tipoLacre: 'lacre normal',
        numeroAgendamento: '2',
        lacre: Lacre,
        nomeUsuario: 'Nome ainda nao definido',
        cpf: '05478591980',
        imagem: base64String, // Atribui a string base64 ao item
      };
      console.log(image)
      setListaItens([...listaItens, novoItem]);
      setLacre("");
      setImage(undefined);
      setBuffer(undefined);
      setImagemSelecionada(undefined);
  
      dispatch({ type: "SET_LISTA_ITENS", payload: [...listaItens, novoItem] });
    }
  };
  
  
  

  const removerItem = (index: number) => {
    const novaLista = [...listaItens];
    novaLista.splice(index, 1);
    setListaItens(novaLista);
  };

  const theme = useTheme();
  
  return (
    <>
      <LayoutBaseDePagina titulo="Cadastro Lacre" barraDeFerramentas={<></>}>
        <Divider />
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          padding={{ xs: theme.spacing(5), md: theme.spacing(20) }}
          sx={{
            "& > div": {
              backdropFilter: "blur(8px)",
              borderRadius: 8,
              borderColor: theme.palette.mode === "dark" ? "" : "#E7EBF0",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <Grid
            container
            direction="column"
            padding={{ xs: theme.spacing(5), md: theme.spacing(20) }}

          >
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              padding={{ xs: theme.spacing(3), md: theme.spacing(8) }}
            >
              {image ? (
                <img
                  src={image.url}
                  alt="Selected Image"
                  style={{ width: 800, height: 400 }}
                />
              ) : (
                <>
                  <label htmlFor="file">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton>
                    <input
                      onChange={handleImagemSelecionada}
                      id="file"
                      style={{ display: "none" }}
                      type="file"
                    />
                  </label>
                  <Typography>Nenhuma imagem selecionada.</Typography>
                </>
              )}

              <TextField
                fullWidth
                placeholder="AMOSTRA123456789"
                error={Lacre.length < 3}
                required
                id="outlined-required"
                label={<Typography>Required</Typography>}
                value={Lacre}
                InputLabelProps={{
                  shrink: true,
                }}
                margin={"normal"}
                onChange={(event) => {
                  setLacre(event.target.value);
                }}
                helperText={<Typography>Digite o Lacre</Typography>}
              />
              <IconButton
                color="primary"
                aria-label="Adicionar"
                onClick={adicionarItem}
              >
                <AddIcon />
              </IconButton>
            </Grid>

            <Grid item>
            <List
              sx={{
                width: "100%",
                maxHeight: 400,
                overflow: "auto",
                "& ul": {
                  padding: 0,
                  "&::-webkit-scrollbar": {
                    height: 10,
                    WebkitAppearance: "none",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    borderRadius: 8,
                    border: "2px solid",
                    borderColor: theme.palette.mode === "dark" ? "" : "#E7EBF0",
                    backgroundColor: "rgba(0 0 0 / 0.5)",
                  },
                },
              }}
              subheader={<ul />} // Aqui está a alteração
            >
              {listaItens.map((item, index) => (
                <li key={`item-${index}`}>
                  <ListItem>
                    <ListItemText primary={item.lacre} />
                    <IconButton
                      color="secondary"
                      edge="end"
                      aria-label="delete"
                      onClick={() => removerItem(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                </li>
              ))}
            </List>
            </Grid>

            <Grid item>
              <Link to="/checklist">
                <Button variant="contained">VOLTAR</Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </LayoutBaseDePagina>
    </>
  );
};

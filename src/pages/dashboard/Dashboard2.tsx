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

export const Dashboard2 = () => {
  const [Lacre, setLacre] = useState("");
  const [image, setImage] = useState<{ url: string; width: number; height: number } | undefined>();
  const [file, setFile] = useState<File | undefined>();
  const [imagemSelecionada, setImagemSelecionada] = useState<string | undefined>();
  const [listaItens, setListaItens] = useState<{ lacre: string; imagem: File }[]>(() => {
    const storedItems = localStorage.getItem("listaItens");
    return storedItems ? JSON.parse(storedItems) : [];
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getImage = () => {
      if (file != null) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
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
  }, [file]);

  const handleImagemSelecionada = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const imagem = event.target.files[0];
      setImagemSelecionada(URL.createObjectURL(imagem));
      setFile(imagem);
    }
  };


  useEffect(() => {
    // Salvar os itens no localStorage sempre que houver uma alteração na listaItens
    localStorage.setItem("listaItens", JSON.stringify(listaItens));
  }, [listaItens]);



  const adicionarItem = () => {
    if (imagemSelecionada && Lacre && file) {
      const novoItem = {
        lacre: Lacre,
        imagem: file
      };
      setListaItens([...listaItens, novoItem]);

      setLacre("");
      setImage(undefined);
      setFile(undefined);
      setImagemSelecionada(undefined);

      dispatch({ type: "SET_LISTA_ITENS", payload: [...listaItens, novoItem] });

    }
  };
  
  

  const removerItem = (index: number) => {
    const novaLista = [...listaItens];
    novaLista.splice(index, 1);
    setListaItens(novaLista);
  };

  const enviarLista = () => {
    // Lógica para enviar a lista com nomes e fotos em ordem
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
                      borderColor:
                        theme.palette.mode === "dark" ? "" : "#E7EBF0",
                      backgroundColor: "rgba(0 0 0 / 0.5)",
                    },
                  },
                }}
                subheader={<li />}
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
              <Button
                variant="contained"
                color="primary"
                onClick={enviarLista}
              >
                Enviar Lista
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </LayoutBaseDePagina>
    </>
  );
};

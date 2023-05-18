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
import compressImage from "browser-image-compression";
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';

export const Dashboard2 = () => {
  const [lacre, setLacre] = useState("");
  const [image, setImage] = useState<{ url: string; width: number; height: number } | undefined>();
  const [buffer, setBuffer] = useState<ArrayBuffer | undefined>();
  const [imagemSelecionada, setImagemSelecionada] = useState<string | undefined>();
  const listaItens = useSelector((state: RootState) => state.listaItens); // Obter o estado da lista de itens do Redux
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

      const options = {
        maxSizeMB: 0.3,
        useWebWorker: true,
      };

      try {
        const img = new Image();
        img.src = URL.createObjectURL(imagem);

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          const targetWidth = 1600;
          const targetHeight = 800;

          canvas.width = targetWidth;
          canvas.height = targetHeight;
          context?.drawImage(img, 0, 0, targetWidth, targetHeight);

          if (canvas.toBlob) {
            canvas.toBlob(async (blob) => {
              if (blob) {
                const file = new File([blob], imagem.name, { type: imagem.type, lastModified: imagem.lastModified });

                const compressedImage = await compressImage(file, options);
                const compressedDataUrl = URL.createObjectURL(compressedImage);

                const reader = new FileReader();
                reader.onload = () => {
                  const arrayBuffer = reader.result as ArrayBuffer;
                  setBuffer(arrayBuffer);

                  console.log("Tamanho original:", imagem.size, "bytes");
                  console.log("Tamanho convertido:", compressedImage.size, "bytes");
                  console.log("Largura original:", img.width);
                  console.log("Altura original:", img.height);
                  console.log("Largura redimensionada:", targetWidth);
                  console.log("Altura redimensionada:", targetHeight);
                };
                reader.readAsArrayBuffer(compressedImage);
              }
            });
          }
        };
      } catch (error) {
        console.log(error);
      }
    }
  };

  const adicionarItem = () => {
    // Restante do código...
    const novoItem = { lacre,image };
    dispatch({ type: "SET_LISTA_ITENS", payload: [...listaItens, novoItem] }); // Atualizar o estado do Redux com o novo item
  };

  const removerItem = (index: number) => {
    const novoItem = [...listaItens];
    novoItem.splice(index, 1);
    dispatch({ type: "SET_LISTA_ITENS", payload: novoItem }); // Atualizar o estado do Redux removendo o item
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
            component={Paper}
            elevation={24}
            sx={{
              zIndex: 1
            }}
          >
            <Grid item>
              {image ? (
                <img
                  src={image.url}
                  alt="Selected Image"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              ) : (
                <>
                  <label htmlFor="file">
                    <LoadingButton
                      loading={false}
                      loadingPosition="start"
                      startIcon={<PhotoCamera />}
                      variant="outlined"
                      aria-label="upload picture"
                      component="span"
                    >
                      ADICIONAR IMAGEM
                    </LoadingButton>
                    <input
                      onChange={handleImagemSelecionada}
                      id="file"
                      style={{ display: "none" }}
                      type="file"
                    />
                  </label>
                </>
              )}
            </Grid>

            <TextField
              fullWidth
              placeholder="AMOSTRA123456789"
              error={lacre.length < 3}
              required
              id="outlined-required"
              label={<Typography>Required</Typography>}
              value={lacre}
              InputLabelProps={{
                shrink: true,
              }}
              margin={"normal"}
              onChange={(event) => {
                setLacre(event.target.value);
              }}
              helperText={<Typography>Digite o Lacre</Typography>}
            />
            <LoadingButton
              loading={false}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="outlined"
              onClick={adicionarItem}
            >
              SALVAR
            </LoadingButton>
          </Grid>

      {/* Restante do código... */}

      <Grid item component={Paper} elevation={24}>
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
          subheader={
            <ListSubheader
              disableSticky
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: theme.palette.background.paper,
                height: 56,
                pl: 2,
              }}
            >
              <Typography variant="h6">Lista de Lacres</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton color="primary" edge="end" aria-label="add" onClick={adicionarItem}>
                <AddIcon />
              </IconButton>
            </ListSubheader>
          }
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

      {/* Restante do código... */}
      <Grid
              item
              component={Paper}
              elevation={24}
              textAlign="center"
            >
              <Link to="/checklist">
                <Button size="large" variant="contained">VOLTAR</Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </LayoutBaseDePagina>
    </>
  );
};

export default Dashboard2;

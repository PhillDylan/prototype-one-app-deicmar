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
  const [Lacre, setLacre] = useState("");
  const [image, setImage] = useState<{ url: string; width: number; height: number } | undefined>();
  const [buffer, setBuffer] = useState<ArrayBuffer | undefined>();
  const [imagemSelecionada, setImagemSelecionada] = useState<string | undefined>();
  const [listaItens, setListaItens] = useState<{ agora: string; guide: string; tipoLacre: string; numeroAgendamento: string; lacre: string; nomeUsuario: string; cpf: string; imagem: string }[]>(() => {
    const storedItems = sessionStorage.getItem("listaItens"); // Trocar localStorage por sessionStorage
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


  // Resto do código...
  
// Resto do código...

const handleImagemSelecionada = async (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    const imagem = event.target.files[0];
    setImagemSelecionada(URL.createObjectURL(imagem));

    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressedImage = await compressImage(imagem, options);
      const compressedDataUrl = URL.createObjectURL(compressedImage);

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const img = new Image();
      img.src = compressedDataUrl;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context?.drawImage(img, 0, 0, img.width, img.height);

        // Convertendo o conteúdo do canvas em um objeto Blob
        if (canvas.toBlob) {
          canvas.toBlob((blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                setBuffer(arrayBuffer);

                // Imprimindo as informações da imagem
                console.log("Tamanho original:", imagem.size, "bytes");
                console.log("Tamanho convertido:", blob.size, "bytes");
                console.log("Largura:", img.width);
                console.log("Altura:", img.height);
              };
              reader.readAsArrayBuffer(blob);
            }
          });
        }
      };
    } catch (error) {
      console.log(error);
    }
  }
};

// Resto do código...



useEffect(() => {
  // Salvar os itens no sessionStorage sempre que houver uma alteração na listaItens
  sessionStorage.setItem("listaItens", JSON.stringify(listaItens));
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
              component={Paper} 
              elevation={24}
              sx={{
                zIndex: 1
              }}
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

            <Grid item               
              component={Paper} 
              elevation={24}>
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

            <Grid item 
              component={Paper} 
              elevation={24}
              textAlign='center'
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

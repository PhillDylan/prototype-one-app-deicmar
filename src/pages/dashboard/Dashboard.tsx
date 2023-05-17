import { LayoutBaseDePagina } from "../../shared/layouts"
import { PhotoCamera } from "@mui/icons-material";
import { Alert, AlertColor, AlertTitle, Button, CardMedia, Divider, Grid, IconButton, Paper, Typography,  backdropClasses,  useTheme } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import TextField from '@mui/material/TextField';
import { Box } from "@mui/system";
import SendIcon from '@mui/icons-material/Send';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { NewPost } from "../../shared/components";
import { alpha } from '@mui/material/styles';


export const Dashboard = () => {

const [open, setOpen] = React.useState(false);
const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);
const [erroEnvio, setErroEnvio] = useState<string | undefined>();
const [mensagemEnvio, setMensagemEnvio] = useState("");
const [nome, setNome] = useState("");
const [sobrenome, setSobrenome] = useState("");
const [cpf, setCpf] = useState("");
const [statusEnvio, setStatusEnvio] = useState("certo");


const [file, setFile] = useState<Blob | undefined>();
const [image, setImage] = useState<{url: string, width: number, height: number} | undefined>();

const [imagemBase64, setImagemBase64] = useState<string | undefined>();
const [imagemSelecionada, setImagemSelecionada] = useState<string | undefined>();
const [upImage, setResultImage] = useState<{url: string, width: number, height: number} | undefined>();


const ValidadorCPF = (cpf: any) => {
  // inicia as variaveis que serão ultilizadas no codigo
var Soma : any ,i : any ,Resto : any , CPF = cpf;

// pega o cpf informado e retira os '.' e o  '-' para fazer a verificação
CPF = String(CPF.replace("-", "").replace(".", "").replace(/[^0-9]/g, ''));
Soma = 0;

// verifica se os caracteres são todos iguais
if (CPF.length !== 11 || !Array.from(CPF).filter(e => e !== CPF[0]).length) {
    CPF = false;
    return CPF;
}

//faz o calculo de verificação de todos os digitos para verificar se o CPF é valido
for (i = 1; i <= 9; i++) Soma = Soma + parseInt(CPF.substring(i - 1, i)) * (11 - i);
Resto = (Soma * 10) % 11;

if ((Resto === 10) || (Resto === 11)) Resto = 0;
if (Resto != parseInt(CPF.substring(9, 10))){ 
    CPF = false;
    return CPF;
}
Soma = 0;
for (i = 1; i <= 10; i++) Soma = Soma + parseInt(CPF.substring(i - 1, i)) * (12 - i);
Resto = (Soma * 10) % 11;

if ((Resto === 10) || (Resto === 11)) Resto = 0;
if (Resto !== parseInt(CPF.substring(10, 11))){
    CPF = false;
    return CPF;
}

CPF = true;
return CPF;
}


const temErro = nome.length < 3 || sobrenome.length < 3 || !ValidadorCPF(cpf);



const updateImage = async (e: {url?: string, width: number, height: number}) => {
  if (!e.url) return;

  const response = await fetch(e.url);
  const blob = await response.blob();

  const reader = new FileReader();
  reader.readAsDataURL(blob);

  reader.onload = () => {
    let base64String = reader.result?.toString();
    const index = base64String?.indexOf(',');
    if(index){
      if (index !== -1) {
        base64String = base64String?.slice(index + 1);
      }
    }
    setImagemBase64(base64String);
    // Faça o que quiser com a string Base64 aqui
  };
};

useEffect(() => {
  const username = 'admin';
  const password = 'speed12345'; // replace this with the decrypted password
  const token = btoa(`${username}:${password}`);
  fetch('http://192.168.13.224:1880/api/groupsid', {
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + token
    },
}).then(response => response.json()).then(data => {
      console.log(data);
      }).catch(error => {
      console.error(error);
      });              
}, []);



useEffect(() => {
  const getImage = () => {
    if (file != null) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const image = new Image();
              image.src = URL.createObjectURL(blob);
              image.onload = () => {
              };
              setImage({
                url: image.src,
                width: image.width,
                height: image.height,
              });
            }
          }, 'image/jpeg', 1);          
        }
      };
    }
  };

  getImage();
}, [file]);





const handleImagemSelecionada = async (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    setFile(undefined);
    setImage(undefined);
    setImagemBase64(undefined);
    setImagemSelecionada(undefined);
    const imagem = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(imagem);
    reader.onload = async () => {
      let imagemBase64 = reader.result as string;
      const index = imagemBase64.indexOf(',');
      if (index !== -1) {
        imagemBase64 = imagemBase64.slice(index + 1);
      }
      setImagemBase64(imagemBase64);
      setImagemSelecionada(imagemBase64);
    };
    reader.onerror = () => {
      console.error("Erro ao converter imagem em base64");
    };
    setFile(imagem);
  }
};

const handleApagarImagem = () => {
  setFile(undefined);
  setImage(undefined);
  setImagemBase64(undefined);
  setImagemSelecionada(undefined);
};



const removeCaracteresCPF = (cpf: string) => {
  return cpf.replace(/[.-]/g, '');
};

const theme = useTheme();

return(
  <>
    <LayoutBaseDePagina titulo="Cadastro Facial" barraDeFerramentas={<></>}>
      <Divider />
      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'
        padding={{xs: theme.spacing(5), md: theme.spacing(20)}}
        style={{
          maxHeight: '100%',
          overflow: 'auto',}}
        sx={{
            '& > div': {
            backdropFilter: 'blur(8px)',
            borderRadius: 8,
            borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
        }}
        >
          <Grid
            container
            direction='column'
            textAlign="center"
            justifyContent={{xs: "center",md: 'center'}}
            padding={{xs:theme.spacing(3),md:theme.spacing(12) }}
            
          >
        <Grid
          item
          component={Paper} 
          elevation={24}
          sx={{
            zIndex: 1
          }}
        >
          {image ? (

              <NewPost image={image} handleResult={updateImage} />

          ) : (
                  <>
                      <label htmlFor="file">
                        <IconButton color="primary" aria-label="upload picture" component="span">
                          <PhotoCamera />
                        </IconButton>
                      </label>
                      <input onChange={handleImagemSelecionada} id="file" style={{ display: 'none' }} type="file" />
                  <Typography>Nenhuma imagem selecionada.</Typography>
                  </> 
          )}

          {image && (
            <Grid container textAlign='center' alignItems='center' alignContent='center'>
            <Grid item >
                  <label htmlFor="file">
                    <IconButton color="primary" aria-label="upload picture" component="span" >
                      <PhotoCamera />
                    </IconButton>
                    </label>
                  <input onChange={handleImagemSelecionada} id="file" style={{ display: 'none' }} type="file" />
                  </Grid>
                  <Grid item>
                    <Typography>Trocar imagem</Typography>
                  </Grid>
            </Grid>
          )}
          <Grid
            item
            paddingX={{xs: theme.spacing(5),md: theme.spacing(20),}}
            
          >
            <TextField
              fullWidth 
              placeholder='NOME'
              error={nome.length < 3}
              required
              InputLabelProps={{
                shrink: true,
              }}
              id="outlined-required"
              label={<Typography>Required</Typography>}
              margin={'normal'}
              value={nome}
              onChange={(event) => {
              setNome(event.target.value);
              setStatusEnvio("certo"); 
              }}
              helperText={<Typography>Digite o nome</Typography>}
            />
          </Grid>
          <Grid
          item 
          paddingX={{xs: theme.spacing(5),md: theme.spacing(20),}}
          textAlign="center"
          >
            <TextField
              fullWidth 
              placeholder='SOBRENOME'
              error={sobrenome.length < 3}
              required
              id="outlined-required"
              label={<Typography>Required</Typography>}
              value={sobrenome}
              InputLabelProps={{
                shrink: true,
              }}
              margin={'normal'}
              onChange={(event) => {
                setSobrenome(event.target.value);
                setStatusEnvio("certo"); 
              }}
              helperText={<Typography>Digite o Sobrenome</Typography>}
            />
          </Grid>
                            
          <Grid
          item
          paddingX={{xs: theme.spacing(5),md: theme.spacing(20),}}
          >
            <TextField
              fullWidth 
              margin={'normal'}
              placeholder='00.000.000-00'
              error={!ValidadorCPF(cpf)}
              id="filled-number"
              label={<Typography>Required</Typography>}
              type="tel"
              InputLabelProps={{
                shrink: true,
              }}
              value={cpf}
              onChange={(event) => {
                const inputCPF = event.target.value.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
                let formattedCPF = '';
                if (inputCPF.length <= 3) {
                  formattedCPF = inputCPF;
                } else if (inputCPF.length <= 6) {
                  formattedCPF = inputCPF.substr(0, 3) + '.' + inputCPF.substr(3);
                } else if (inputCPF.length <= 9) {
                  formattedCPF = inputCPF.substr(0, 3) + '.' + inputCPF.substr(3, 3) + '.' + inputCPF.substr(6);
                } else {
                  formattedCPF = inputCPF.substr(0, 3) + '.' + inputCPF.substr(3, 3) + '.' + inputCPF.substr(6, 3) + '-' + inputCPF.substr(9);
                }

                setCpf(formattedCPF);
                setStatusEnvio("certo");
              }}
              inputProps={{
                maxLength: 14, // Define o limite máximo de caracteres
              }}
              helperText={!ValidadorCPF(cpf) ? <Typography>"Digite um CPF válido"</Typography> : <Typography>"Digite o CPF"</Typography>}
            />
          </Grid>
          <Grid item >
            <Collapse in={open}>
              <Alert
                variant="filled"
                severity = {severity}
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
          </Grid>
          <Grid item >
            <Button
              size="large"
              variant="contained"
              endIcon={<SendIcon />}
              disabled={!nome || !sobrenome || !cpf || statusEnvio === "enviando" || open === true || temErro || !imagemBase64} 
              onClick={async () => {
                  setStatusEnvio("enviando");
                  const username = 'admin';
                  const password = 'speed12345'; // replace this with the decrypted password
                  const token = btoa(`${username}:${password}`);
                  const cpfSemCaracteres = removeCaracteresCPF(cpf);

                  fetch('http://192.168.13.224:1880/api/cadastro', {
                      method: 'POST',
                      headers: {
                        'Authorization': 'Basic ' + token
                      },
                      body: JSON.stringify({
                          nome,
                          sobrenome,
                          cpf: cpfSemCaracteres,
                          imagem: imagemBase64,
                          transportadora: 6
                      })
                  })
                  .then(response => response.json())
                  .then(data => {
                      console.log(data);
                      console.log(data.message);
                      console.log(data.status);
                      if (data.status === 'Success') {
                        setStatusEnvio("pronto");             
                        setNome("");
                        setSobrenome("");
                        setCpf("");
                        setImagemBase64(undefined);
                        setImagemSelecionada(undefined); // reset the image preview
                        setSeverity('success');
                        setOpen(true);
                        setMensagemEnvio(data.message);
                        setErroEnvio(undefined);
                      }else{
                        setSeverity('error');
                        setOpen(true);
                        setMensagemEnvio(data.message);
                        setStatusEnvio("erro");
                        setErroEnvio(undefined);
                      }
                    })
                  .catch(error => {
                    console.error(error);
                    setSeverity('error');
                    setOpen(true);
                    setStatusEnvio("erro");
                    setErroEnvio(error.message); // ou outra forma de capturar o motivo do erro
                  });              
              }}
            >
              {statusEnvio === "enviando" ? "ENVIANDO..." : statusEnvio === "pronto"? "ENVIADO" : statusEnvio === "erro"? "REENVIAR" : "SEND"}
            </Button>                  
          </Grid>
          </Grid>
        </Grid>
      </Grid>
    </LayoutBaseDePagina>
  </>       
);
};

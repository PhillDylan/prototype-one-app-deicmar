import { LayoutBaseDePagina } from "../../shared/layouts"
import { PhotoCamera } from "@mui/icons-material";
import { Alert, AlertColor, AlertTitle, Button, Divider, Grid, IconButton, Typography } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { Box } from "@mui/system";
import SendIcon from '@mui/icons-material/Send';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { NewPost } from "../../shared/components";
import './App.css';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';
import Stack from '@mui/material/Stack';







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

return(
  <>
    <LayoutBaseDePagina titulo="Cadastro Facial" barraDeFerramentas={<></>}>
      
    <Box style={{width: '100%', height: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
  <Grid           container
          columns={{ xs: 2, md: 2 }}
          direction="column"
          justifyContent="center"
          alignItems="center">
    {image ? (
    
      <Box style={{width: '100%', height: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
     
          <NewPost image={image}  handleResult={updateImage}/>


          <Button variant="contained" color="primary" onClick={handleApagarImagem}>Apagar Imagem</Button>
          </Box>
    ) : (
      <Box >
        <Grid>
          <div className="newPostCard">
            <div className="addPost">
              <label htmlFor="file">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
                <Typography>
                  Nenhuma imagem selecionada.
                </Typography>
              </label>
              <input
                onChange={handleImagemSelecionada}
                id="file"
                style={{ display: 'none' }}
                type="file"
              />
            </div>
          </div>
        </Grid>
      </Box>
    )}
  </Grid>
</Box>


      <Divider />

          <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '38ch' },
          }}
          noValidate
          autoComplete="off"
        >
        <Grid container spacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}   direction="column"
  justifyContent="center"
  alignItems="center">

        <Grid item xs={8} >
          <TextField
            error={nome.length < 3}
            required
            id="outlined-required"
            label="Required"
            value={nome}
            onChange={(event) => {
            setNome(event.target.value);
            setStatusEnvio("certo"); 
            }}
            helperText="Digite o Nome"
          />
          </Grid>
          <Grid item xs={4}>
          <TextField
            error={sobrenome.length < 3}
            required
            id="outlined-required"
            label="Required"
            value={sobrenome}
            onChange={(event) => {
              setSobrenome(event.target.value);
              setStatusEnvio("certo"); 
            }}
            helperText="Digite o Sobrenome"
          />
          </Grid>
          <Grid item xs={8}>
          <TextField
            error={!ValidadorCPF(cpf)}
            id="filled-number"
            label="Required"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={cpf}
            onChange={(event) => {
              setCpf(event.target.value);
              setStatusEnvio("certo"); 
            }}
            helperText={!ValidadorCPF(cpf) ? "Digite um CPF válido" : "Digite o CPF"}
          />
           </Grid>

        </Grid>

      </Box>
      
      <Divider />


    <Box gap={1}> 
    <Grid item xs={8} 
          container
          columns={{ xs: 2, md: 2 }}
          direction="column"
          justifyContent="center"
          alignItems="center">
    <Box>
  
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        disabled={!nome || !sobrenome || !cpf || statusEnvio === "enviando" || open === true || temErro}
        onClick={async () => {
            setStatusEnvio("enviando");
            const username = 'admin';
            const password = 'speed12345'; // replace this with the decrypted password
            const token = btoa(`${username}:${password}`);

            fetch('http://192.168.13.224:1880/api/cadastro', {
                method: 'POST',
                headers: {
                  'Authorization': 'Basic ' + token
                },
                body: JSON.stringify({
                    nome,
                    sobrenome,
                    cpf,
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

    </Box>   

    <Box sx={{ width: '100%' }}>
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
    <Button
      disabled={open}
      variant="outlined"
      onClick={() => {
        setOpen(true);
      }}
    >Re-open
    </Button>
  </Box> 
  </Grid>
  </Box>
        
        
      </LayoutBaseDePagina>
      </>       
  );
};

import { LayoutBaseDePagina } from "../../shared/layouts"
import { PhotoCamera } from "@mui/icons-material";
import { Alert, AlertColor, AlertTitle, Button, IconButton, Typography } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { Box } from "@mui/system";
import SendIcon from '@mui/icons-material/Send';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";

// Importar bibliotecas para detecção de rosto
import * as faceapi from 'face-api.js';
import { TinyFaceDetectorOptions } from 'face-api.js';


export const Dashboard = () => {
const [open, setOpen] = React.useState(false);
const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);
const [erroEnvio, setErroEnvio] = useState<string | undefined>();
const [mensagemEnvio, setMensagemEnvio] = useState("");


const [nome, setNome] = useState("");
const [sobrenome, setSobrenome] = useState("");
const [cpf, setCpf] = useState("");
const [statusEnvio, setStatusEnvio] = useState("certo");
const [imagemBase64, setImagemBase64] = useState<string | undefined>();

const [imagemSelecionada, setImagemSelecionada] = useState<string | undefined>();


// Adicionar função para detecção de rosto
const detectarRosto = async () => {
  try {
    const img = await faceapi.fetchImage(imagemSelecionada!);
    
    const results = await faceapi.detectAllFaces(img, new TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    if (results.length > 0) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = results[0].detection.box.width;
      canvas.height = results[0].detection.box.height;
      ctx.drawImage(img, results[0].detection.box.left, results[0].detection.box.top, results[0].detection.box.width, results[0].detection.box.height, 0, 0, results[0].detection.box.width, results[0].detection.box.height);
      const croppedImageBase64 = canvas.toDataURL();
      setImagemBase64(croppedImageBase64);
      setImagemSelecionada(croppedImageBase64);
      console.log(croppedImageBase64);
    } else {
      console.log("Não foi possível detectar rosto na imagem.");
    }
  } catch (e) {
    console.error(e);
  }
};



const handleImagemSelecionada = async (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    const imagem = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(imagem);
    reader.onload = async () => {
      if(imagemSelecionada != undefined){
        setImagemSelecionada(imagemSelecionada.substring(imagemSelecionada.indexOf(',') + 1));
    }
      // Detectar rosto na imagem selecionada
      await detectarRosto();
      setImagemSelecionada(URL.createObjectURL(imagem));
      setImagemBase64(reader.result as string);
    };
    reader.onerror = () => {
      console.error("Erro ao converter imagem em base64");
    };
  }
};


  return(
      <>
      <LayoutBaseDePagina titulo="Cadastro Facial" barraDeFerramentas={<></>}>
        
        <Box>
          <input
            hidden
            accept="image/*"
            type="file"
            id="imagem-input"
            onChange={
              handleImagemSelecionada
            }
          />
          <label htmlFor="imagem-input">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
          {imagemSelecionada ? (
            <img
            sizes=""
              src={imagemSelecionada}
              style={{
                maxWidth: "300px",
                maxHeight: "300px",
                marginTop: "10px",
              }}
            />
          ) : (
            <Typography>
              Nenhuma imagem selecionada.
            </Typography>
          )}  
        </Box>
        
        
        
        
        
        
          <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '18ch' },
          }}
          noValidate
          autoComplete="off"
        >
        <div>
          <TextField
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
          <TextField
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
          <TextField
            id="filled-number"
            label="Required"
            type="number"
            InputLabelProps={{
                shrink: true,
            }}
            value={cpf}
            onChange={(event) => {
              setCpf(event.target.value)
              setStatusEnvio("certo"); 
            }}
            helperText="Digite o CPF"
          />

        </div>

      </Box>
      
    
    <Box gap={1}>   
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        disabled={!nome || !sobrenome || !cpf || statusEnvio === "enviando" || open === true}
        onClick={async () => {
            setStatusEnvio("enviando");
            fetch('http://192.168.13.217:1880/api/endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    sobrenome,
                    cpf,
                    imagem: imagemBase64,
                    transportadora: 'Parceiras'
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
        
        
      </LayoutBaseDePagina>
      </>       
  );
};
/*
fetch('http://localhost:1880/api/endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    picture: buffer,
                    name: name,
                    cpf: cpf,
                    transportadora: 'Parceiras'
                })
            })
            .then(response => response.json())
            .then(data => 
            console.log(data)
            )
            .catch(error => console.error(error));
    }
    
    */
/*
async () => {
                setStatusEnvio("enviando");
                try {
                const resposta = await fetch("http://192.168.13.217:1880/api/endpoint", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                    nome,
                    sobrenome,
                    cpf,
                    imagem: imagemSelecionada,
                    }),
                });
                const dados = await resposta.json();
                console.log(dados);
                setStatusEnvio("pronto");
                } catch (erro) {
                console.error(erro);
                setStatusEnvio("erro");
                }
            }*/
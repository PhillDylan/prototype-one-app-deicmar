import { LayoutBaseDePagina } from "../../shared/layouts"
import { PhotoCamera } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { Box } from "@mui/system";
import SendIcon from '@mui/icons-material/Send';

import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";


export const Dashboard = () => {
    
const [nome, setNome] = useState("");
const [sobrenome, setSobrenome] = useState("");
const [cpf, setCpf] = useState("");
const [statusEnvio, setStatusEnvio] = useState("pronto");

    
    
    
      const [imagemSelecionada, setImagemSelecionada] = useState<
    string | undefined
  >();

  const handleImagemSelecionada = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const imagem = URL.createObjectURL(event.target.files[0]);
      setImagemSelecionada(imagem);
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
              onChange={handleImagemSelecionada}
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
                src={imagemSelecionada}
                style={{
                  maxWidth: "300px",
                  maxHeight: "300px",
                  marginTop: "10px",
                }}
              />
            ) : (
              <p>Nenhuma imagem selecionada.</p>
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
            defaultValue={nome}
            onChange={(event) => setNome(event.target.value)}
            helperText="Digite o Nome"
            />
            <TextField
            required
            id="outlined-required"
            label="Required"
            defaultValue={sobrenome}
            onChange={(event) => setSobrenome(event.target.value)}
            helperText="Digite o Sobrenome"
            />
            <TextField
            id="filled-number"
            label="Required"
            type="number"
            InputLabelProps={{
                shrink: true,
            }}
            defaultValue={cpf}
            onChange={(event) => setCpf(event.target.value)}
            helperText="Digite o CPF"
            />

      </div>
      
    </Box>
       
    <Box gap={1}>   
      <Button
            variant="contained"
            endIcon={<SendIcon />}
            disabled={!nome || !sobrenome || !cpf || statusEnvio === "enviando"}
            onClick={async () => {
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
            }}
            >
            SEND
    </Button>

    </Box>    
          
          
        </LayoutBaseDePagina>
       </>       
    );
};


import { Divider, Grid, useTheme, Button } from "@mui/material";
import { LayoutBaseDePagina } from "../../shared/layouts";
import React, { useState, useEffect, useRef } from "react";
import { green, pink, red } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { Link } from "react-router-dom";


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const Dashboard3 = () => {
  const theme = useTheme();
  const storedListaItens = localStorage.getItem("listaItens");
  const [listaItens, setListaItens] = useState(storedListaItens ? JSON.parse(storedListaItens) : []);
  const [greenChecked, setGreenChecked] = useState(false);
  const [redChecked, setRedChecked] = useState(true);

  useEffect(() => {
    if (listaItens.length > 0) {
      setGreenChecked(true);
      setRedChecked(false);
    } else {
      setGreenChecked(false);
      setRedChecked(true);
    }
  }, [listaItens]);

  useEffect(() => {
    localStorage.setItem("listaItens", JSON.stringify(listaItens));
  }, [listaItens]);

  const enviarDados = () => {

    listaItens.forEach((item: { agora: string; guide: string; tipoLacre: string; numeroAgendamento: string; lacre: string; nomeUsuario: string; cpf: string; imagem: Buffer }) => {
      let formData = new FormData();
      const file: any = new File([item.imagem], 'imagem.jpg', { type: 'image/jpeg' });
      const informationsFile = [item.agora, item.guide, item.tipoLacre, item.numeroAgendamento, item.lacre];

      formData.append(informationsFile.toString(), file);


    
      const username: any = 'admin';
      const password: any = 'speed12345'; // substitua isso pela senha descriptografada
      const token: any = btoa(`${username}:${password}`);
  
      let options:any = {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + token
        },
        body: formData
      };
  
      fetch('http://192.168.13.217:1880/cadastrolacre', options)
        .then(response => {
          if (response.ok) {
            // Manipule a resposta aqui
            return response.json();
          } else {
            // Trate erros de resposta aqui
            throw new Error('Erro ao enviar');
          }
        })
        .then(data => {
          const result = document.getElementById('result');
          if (result) {
            result.textContent = JSON.stringify(data);
          }
          console.log(data);
        })
        .catch(error => {
          // Trate erros de rede aqui
        });
    });
  };
  
  
  
  

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
              sx={{
                "& > div": {
                  backdropFilter: "blur(8px)",
                  borderRadius: 8,
                  borderColor: theme.palette.mode === "dark" ? "" : "#E7EBF0",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <Grid item>
                <Checkbox
                  {...label}
                  checked={greenChecked}
                  disabled={greenChecked}
                  sx={{
                    color: green[800],
                    '&.Mui-checked': {
                      color: green[600],
                    },
                  }}
                />
                <Checkbox
                  {...label}
                  checked={redChecked}
                  disabled={redChecked}
                  sx={{
                    color: red[800],
                    '&.Mui-checked': {
                      color: red[600],
                    },
                  }}
                />
                <span>LACRE</span>
                <Link to="/cadastro-lacre">
                  <Button variant="contained">ADD</Button>
                </Link>
              </Grid>
              <Grid item>
              <Button variant="contained" onClick={() => {
                    enviarDados();
                  }}>ENVIAR</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </LayoutBaseDePagina>
    </>
  );
};
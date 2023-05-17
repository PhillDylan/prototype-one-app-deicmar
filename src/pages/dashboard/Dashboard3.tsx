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
    const base64ToBlob:any = (base64String:any, mimeType:any) => {
      const byteCharacters:any = atob(base64String);
      const byteArrays:any = [];
    
      for (let offset:any = 0; offset < byteCharacters.length; offset += 512) {
        const slice:any = byteCharacters.slice(offset, offset + 512);
    
        const byteNumbers:any = new Array(slice.length);
        for (let i:any = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
    
        const byteArray:any = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
    
      return new Blob(byteArrays, { type: mimeType });
    };
    
      var formData = new FormData();

    listaItens.forEach((item: { agora: string; guide: string; tipoLacre: string; numeroAgendamento: string; lacre: string; nomeUsuario: string; cpf: string; imagem: Buffer }) => {
      const base64Image = item.imagem.toString('base64');
      const blobImage = base64ToBlob(base64Image, 'image/jpeg');
      const file = new File([blobImage], 'imagem.jpg', { type: 'image/jpeg' });
    
      var hora:any = item.agora
      var guide:any = item.guide
      var tipolacre:any = item.tipoLacre
      var agendamento:any =item.numeroAgendamento
      var numerolacre:any = item.lacre
      var nomeoperador:any = item.nomeUsuario
      var idoperador:any = item.cpf

      formData.append('file', file);
      formData.append('string', hora);
      formData.append('string', guide);
      formData.append('string', tipolacre);
      formData.append('string', agendamento);
      formData.append('string', numerolacre);
      formData.append('string', nomeoperador);
      formData.append('string', idoperador);
      
    });

    const username: any = 'admin';
    const password: any = 'speed12345'; // substitua isso pela senha descriptografada
    const token: any = btoa(`${username}:${password}`);

    var options:any = {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + token
      },
      body: formData
    };

    fetch('http://192.168.13.214:1882/cadastrolacre', options)
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
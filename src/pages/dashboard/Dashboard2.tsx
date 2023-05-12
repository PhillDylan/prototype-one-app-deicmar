import { LayoutBaseDePagina } from "../../shared/layouts"
import { PhotoCamera } from "@mui/icons-material";
import {Divider, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, Typography,  useTheme } from "@mui/material";
import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { Box } from "@mui/system";
import DeleteIcon from '@mui/icons-material/Delete';

import BackgroundImage from '../../shared/assets/img/BackgroundImage.png'

export const Dashboard2 = () => {

  const [Lacre, setLacre] = useState("");
  const [image, setImage] = useState<{url: string, width: number, height: number} | undefined>();
  const [file, setFile] = useState<Blob | undefined>();
  const [imagemSelecionada, setImagemSelecionada] = useState<string | undefined>();

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
        setImagemSelecionada(imagemBase64);
      };
      reader.onerror = () => {
        console.error("Erro ao converter imagem em base64");
      };
      setFile(imagem);
    }
  };

  const theme = useTheme();

  return (
    <>
      <LayoutBaseDePagina titulo="Cadastro Lacre" barraDeFerramentas={<></>}>
        <Divider />
        <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'
        padding={{xs: theme.spacing(5), md: theme.spacing(20)}}
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
            padding={{xs: theme.spacing(5), md: theme.spacing(20)}}
            sx={{
                '& > div': {
                backdropFilter: 'blur(8px)',
                borderRadius: 8,
                borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
            }}
            >
                <Grid container       
                    justifyContent='center'
                    alignItems='center'             
                    padding={{xs:theme.spacing(3),md:theme.spacing(8) }}
                >
                    {image ? (
                        <img src={image.url} alt="Selected Image" style={{ width: 800, height: 400 }} />
                    ) : (
                        <>
                            <label htmlFor="file">
                            <IconButton color="primary" aria-label="upload picture" component="span">
                                <PhotoCamera />
                            </IconButton>
                            <input onChange={handleImagemSelecionada} id="file" style={{ display: 'none' }} type="file" />
                            </label>
                            <Typography>Nenhuma imagem selecionada.</Typography>
                        </>
                    )}


                    <TextField
                    fullWidth 
                    placeholder='AMOSTRA123456789'
                    error={Lacre.length < 3}
                    required
                    id="outlined-required"
                    label={<Typography>Required</Typography>}
                    value={Lacre}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin={'normal'}
                    onChange={(event) => {
                        setLacre(event.target.value);
                    }}
                    helperText={<Typography>Digite o Lacre</Typography>}
                    />
                </Grid>
                
                <Grid item>
    <List
        sx={{
            width: '100%',
            maxHeight: 400,
            overflow: 'auto',
            '& ul': {
                padding: 0,
                '&::-webkit-scrollbar': {
                    height: 10,
                    WebkitAppearance: 'none',
                },
                '&::-webkit-scrollbar-thumb': {
                    borderRadius: 8,
                    border: '2px solid',
                    borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                    backgroundColor: 'rgba(0 0 0 / 0.5)',
                },
            },
        }}
        subheader={<li />}
    >
        {[0, 1, 2, 3, 4].map((sectionId) => (
            <li key={`section-${sectionId}`}>
                <ul>
                    {[0, 1, 2].map((item) => (
                        <ListItem key={`item-${sectionId}-${item}`}>
                            <ListItemText primary={`Item ${item}`} />
                            <IconButton color="secondary" edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </ul>
            </li>
        ))}
    </List>
</Grid>

            </Grid>
        </Grid>
       </LayoutBaseDePagina>
    </>
  );
};

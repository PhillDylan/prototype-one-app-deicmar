import { Divider, Grid, useTheme } from "@mui/material";
import { LayoutBaseDePagina } from "../../shared/layouts";
import React, { useState, useEffect, useRef } from "react";
import { green, pink, red } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import { useSelector } from "react-redux";
import { RootState } from "./store";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const Dashboard3 = () => {
  const theme = useTheme();
  const listaItens = useSelector((state: RootState) => state.listaItens);

  console.log('lista itens'+listaItens);

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
                  defaultChecked
                  sx={{
                    color: green[800],
                    '&.Mui-checked': {
                      color: green[600],
                    },
                  }}
                />
                <Checkbox
                  {...label}
                  defaultChecked
                  sx={{
                    color: red[800],
                    '&.Mui-checked': {
                      color: red[600],
                    },
                  }}
                />
              </Grid>


            </Grid>
          </Grid>
        </Grid>
      </LayoutBaseDePagina>
    </>
  );
};

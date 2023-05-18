import { Divider, Grid, useTheme, Button, Paper } from "@mui/material";
import { LayoutBaseDePagina } from "../../shared/layouts";
import React, { useEffect, useState } from "react";
import { green, pink, red } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { Link } from "react-router-dom";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const Dashboard3 = () => {
  const theme = useTheme();
  const listaItens = useSelector((state: RootState) => state.listaItens); // Obter o estado da store Redux
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

  const enviarDados = () => {
    // Restante do código do envio dos dados
    // ...
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
              component={Paper}
              elevation={24}
              sx={{
                zIndex: 1
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
                <Button variant="contained" size="large" onClick={enviarDados}>
                  ENVIAR
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </LayoutBaseDePagina>
    </>
  );
};

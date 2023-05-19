import { Divider, Grid, useTheme, Button, Paper, TextField, Typography } from "@mui/material";
import { LayoutBaseDePagina } from "../../shared/layouts";
import React, { useEffect, useState } from "react";
import { green, red } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { Link } from "react-router-dom";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const Dashboard5 = () => {
  const [lacre, setLacre] = useState("");

  const theme = useTheme();


  return (
    <>
      <LayoutBaseDePagina titulo="CHECKLIST" barraDeFerramentas={<></>}>
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
              component={Paper}
              elevation={24}
              sx={{
                zIndex: 1
              }}
            >
             <Grid item textAlign='center'>
                <TextField
                  fullWidth
                  placeholder="AAA1A11"
                  error={lacre.length < 3}
                  required
                  id="outlined-required"
                  label={<Typography>Required</Typography>}
                  value={lacre}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin={"normal"}
                  onChange={(event) => {
                    setLacre(event.target.value);
                  }}
                  helperText={<Typography>Digite a placa</Typography>}
                />
                <Button variant="contained">Buscar</Button>
             </Grid>
          </Grid>
        </Grid>
      </Grid>
      </LayoutBaseDePagina>
    </>
  );
};

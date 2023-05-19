import { Divider, Grid, useTheme, Button, Paper } from "@mui/material";
import { LayoutBaseDePagina } from "../../shared/layouts";
import React from "react";
import { green, red } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { Link } from "react-router-dom";
import './particulas.css';

export const Dashboard4 = () => {
  return (
    <>
      <LayoutBaseDePagina titulo="CHECKLIST" barraDeFerramentas={<></>}>
        <Divider />
       <Grid className="box2">
        <div className="box">
  
        </div>
        </Grid>
      </LayoutBaseDePagina>
    </>
  );
};

import React, { ReactNode } from "react";
import { IconButton, Typography, useTheme, Icon, useMediaQuery, Theme, Grid, Paper } from "@mui/material";
import { Box } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppDrawerContext } from "../contexts";
import Speed from '../../shared/assets/img/Speed.png'

interface ILayoutBaseDePaginaProps {
  children: ReactNode;
  titulo: string;
  barraDeFerramentas?: ReactNode;
}

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({ children, titulo, barraDeFerramentas }) => {
  // Media queries to determine screen size
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const theme = useTheme();

  // Accessing the app drawer context
  const { toggleDrawerOpen } = useAppDrawerContext();

  return (
    <Box height='100%' display='flex' flexDirection='column' gap={1} sx={{
      '& > div': {
        '&::-webkit-scrollbar': { height: 10, WebkitAppearance: 'none' }, // Styling for scrollbars
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 8,
          border: '2px solid',
          borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
          backgroundColor: 'rgba(0 0 0 / 0.2)',
        },
      },
    }}>
      <Box padding={1} display='flex' alignItems='center' gap={1} height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)}>
        {smDown && (
          <IconButton color="primary" onClick={toggleDrawerOpen}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" variant={smDown ? 'h5' : mdDown ? 'h4' : 'h3'}>
          {titulo} {/* Displaying the title */}
        </Typography>
      </Box>
      {barraDeFerramentas && (
        <Box>{barraDeFerramentas}</Box> // Displaying the toolbar if available
      )}
      <Box flex={1} overflow='auto'> {/* Creating a scrollable container */}
        <Paper elevation={1} sx={{
          height: '100%',
          maxHeight: '100%',
          width: '100%',
          overflow: 'auto',
        }}>
          <Grid item sx={{
            width: '100%',
            maxHeight: '100%',
            overflow: 'auto',
          }}>
            {children} {/* Rendering the child components */}
          </Grid>
        </Paper>
      </Box>
      <Grid container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} component={Paper}>
        <Grid item>
          <img src={Speed} style={{ width: '200px', height: '100%' }} alt="" /> {/* Displaying an image */}
        </Grid>
      </Grid>
    </Box>
  );
};

import { ReactNode } from "react";
import { IconButton, Typography, useTheme, Icon, useMediaQuery, Theme } from "@mui/material";
import { Box } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppDrawerContext } from "../contexts";

interface ILayoutBaseDePaginaProps{
	children : React.ReactNode
  titulo: string;
  barraDeFerramentas: ReactNode;
}

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({ children,  titulo, barraDeFerramentas }) => {
  
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  
  const theme = useTheme();
  
  const { toggleDrawerOpen } = useAppDrawerContext();
  
  return( 
    <Box height='100%' display='flex' flexDirection='column' gap={1}>
        <Box padding={1} display='flex' alignItems='center' height={theme.spacing(12)} >
             
             {smDown && (
             <IconButton color="primary" onClick={toggleDrawerOpen}>
              <MenuIcon />
            </IconButton>
            )}
          
          <Typography variant="h5">
            {titulo}
          </Typography>
        </Box>
        <Box>
          Barra de ferramentas
        </Box>
        <Box>
          {children}
        </Box>
    </Box>
  );
};

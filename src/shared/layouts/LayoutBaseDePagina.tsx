
import { IconButton, Typography, useTheme, Icon } from "@mui/material";
import { Box } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";

interface ILayoutBaseDePaginaProps{
	children : React.ReactNode
  titulo: string;
}

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({ children,  titulo }) => {
  const theme = useTheme();
  
  return( 
    <Box height='100%' display='flex' flexDirection='column' gap={1}>
        <Box padding={1} display='flex' alignItems='center' height={theme.spacing(12)} >
             
             <IconButton color="primary">
              <MenuIcon />
            </IconButton>
          
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

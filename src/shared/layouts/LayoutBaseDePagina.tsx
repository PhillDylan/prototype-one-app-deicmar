import { Box } from "@mui/system";

interface ILayoutBaseDePaginaProps{
	children : React.ReactNode
  titulo: string;
}

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({ children,  titulo }) => {
  return( 
    <Box height='100%' display='flex' flexDirection='column'>
        <Box>
          
          {titulo}
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

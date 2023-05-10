import { BarraDeFerramentas } from "../../shared/components"
import { LayoutBaseDePagina } from "../../shared/layouts"
import PropTypes from 'prop-types';
import BellIcon from '@heroicons/react/24/solid/BellIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import {
  Avatar,
  Badge,
  Box,
  Drawer,
  IconButton,
  Paper,
  Stack,
  SvgIcon,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 1224;



export const Dashboard3 = () => {
    const theme = useTheme();

    return(
        <LayoutBaseDePagina
            titulo="Pagina de Teste"
            barraDeFerramentas={(
                <BarraDeFerramentas 
                    mostrarInputBusca="true"
                    textoBotaoNovo="Nova"
                />
            )}>
          
          <Box

        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
          position: 'sticky',
          left: {
            lg: `${SIDE_NAV_WIDTH}px`
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
          },
          zIndex: (theme) => theme.zIndex.appBar
        }}
        height={theme.spacing(5)} marginX={1} padding='85%' paddingX={2} display="flex" gap={1} alignItems="center" component={Paper} elevation={24}
      >
       
      </Box>
        
        </LayoutBaseDePagina>
    );
};
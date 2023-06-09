import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  useTheme,
  ListItemText,
  Icon,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { Box } from "@mui/system";
import { green } from "@mui/material/colors";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Avatar from "@mui/material/Avatar";
import { useAppDrawerContext, useAppThemeContext, useAuthContext } from "../../contexts";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";

import { styled } from '@mui/system';

const DrawerWithGradient = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    ...(theme.palette.mode !== 'dark' && {
      background: 'linear-gradient(to left, #DDE2E5, #FDFBFB 90%)',
    }),
    ...(theme.palette.mode === 'dark' && {
      background: 'linear-gradient(to left, #282828, #434343 90%)',
    }),
  },
}));

interface IListItemLinkProps {
  to: string;
  icon: string;
  label: string;
  onClick: (() => void) | undefined;
}

const ListItemLink: React.FC<IListItemLinkProps> = ({
  to,
  icon,
  label,
  onClick,
}) => {
  const navigate = useNavigate();

  const resolvedPath = useResolvedPath(to);

  const match = useMatch({ path: resolvedPath.pathname, end: false });

  const handleClick = () => {
    navigate(to);
    onClick?.();
  };

  return (
    <ListItemButton selected={!!match} onClick={handleClick}>
      <ListItemIcon>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

interface IMenuLateral {
  children: React.ReactNode;
}

export const MenuLateral: React.FC<IMenuLateral> = ({ children }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));

  const { isDrawerOpen, toggleDrawerOpen, drawerOptions } =
    useAppDrawerContext();
  const { toggleTheme } = useAppThemeContext();
  const { logout } = useAuthContext();

  return (
    <>
      <DrawerWithGradient
        open={isDrawerOpen}
        variant={smDown ? "temporary" : "permanent"}
        onClose={toggleDrawerOpen}
      >
        <Box
          width={theme.spacing(28)}
          height="100%"
          display="flex"
          flexDirection="column"
        >
          <Box
            width="100%"
            height={theme.spacing(28)}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar
              sx={{
                bgcolor: green[500],
                height: theme.spacing(12),
                width: theme.spacing(12),
              }}
            >
              <AssignmentIcon />
            </Avatar>
          </Box>

          <Divider />

          <Box flex={1}>
            <nav aria-label="main mailbox folders">
              <List>
                {drawerOptions.map((drawerOption) => (
                  <ListItemLink
                    key={drawerOption.path}
                    icon={drawerOption.icon}
                    to={drawerOption.path}
                    label={drawerOption.label}
                    onClick={smDown ? toggleDrawerOpen : undefined}
                  />
                ))}
              </List>
            </nav>
          </Box>
          <Box>
            <nav aria-label="main mailbox folders">
              <List>
                <ListItemButton onClick={toggleTheme}>
                  <ListItemIcon>
                    <Icon>dark_mode</Icon>
                  </ListItemIcon>
                  <ListItemText primary="Alternar tema" />
                </ListItemButton>
                <ListItemButton onClick={logout}>
                  <ListItemIcon>
                    <Icon>logout</Icon>
                  </ListItemIcon>
                  <ListItemText primary="Sair" />
                </ListItemButton>
              </List>
            </nav>
          </Box>
        </Box>
        </DrawerWithGradient>

      <Box height="100vh" marginLeft={smDown ? 0 : theme.spacing(28)}>
        {children}
      </Box>
    </>
  );
};

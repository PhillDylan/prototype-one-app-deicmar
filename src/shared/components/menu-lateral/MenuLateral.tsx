import { Divider, Drawer, List, ListItemButton, ListItemIcon, useTheme, ListItemText, Icon } from "@mui/material";
import React from "react";
import { Box } from "@mui/system";
import { green } from "@mui/material/colors";
import AssignmentIcon from '@mui/icons-material/Assignment';
import Avatar from '@mui/material/Avatar';

interface IMenuLateral{
	children : React.ReactNode
}

export const MenuLateral: React.FC<IMenuLateral> = ({ children }) => {
    const theme = useTheme();

    return (
        <>
            <Drawer variant='permanent'>
                <Box width={theme.spacing(28)} height="100%"  display="flex" flexDirection="column">

                    <Box width="100%" height={theme.spacing(28)} display="flex" alignItems="center" justifyContent="center">
                        <Avatar sx={{ bgcolor: green[500], height: theme.spacing(12), width: theme.spacing(12) }}>
                            <AssignmentIcon />
                        </Avatar>
                    </Box>

                    <Divider />

                    <Box flex={1}>

                    <nav aria-label="main mailbox folders">
                        <List>
                            <ListItemButton>
                                <ListItemIcon>
                                    <Icon>home</Icon>
                                </ListItemIcon>
                                <ListItemText primary="Página inicial" />
                            </ListItemButton>
                        </List>
                    </nav>

                    </Box>

                </Box>
            </Drawer>

            <Box height='100vh' marginLeft={theme.spacing(28)}>
                {children}
            </Box>
        </>
    )
}
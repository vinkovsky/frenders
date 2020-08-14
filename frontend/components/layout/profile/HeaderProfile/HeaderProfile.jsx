import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import Link from "next/link";
import { useTheme } from '@material-ui/core/styles';
import {
    AppBar,
    Divider,
    Drawer,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from '@material-ui/core';
import {
    FindInPage as FindSceneIcon,
    Menu as MenuIcon,
    SaveAlt as SaveIcon,
    Settings as SettingsIcon,
} from '@material-ui/icons';

import Navigation from "../../Navigation/Navigation";

import { useStyles } from "./HeaderProfile.style";

function HeaderProfile({ authToken, changeData }, props) {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(1);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleListItemClick = (event, index) => {
        setSelectedIndex((selectedIndex) => index);
        changeData(index);
    };

    const drawer = (
        <div>
            <div className={ classes.toolbar }>
                <Link href="/">
                    <a className={ classes.link }>
                        <Typography variant="h1" className={ classes.logo }>
                            Frenders
                        </Typography>
                    </a>
                </Link>
            </div>
            <Divider />
            <List>
                <ListItem
                    button
                    selected={selectedIndex === 0}
                    onClick={event => handleListItemClick(event, 0)}
                >
                    <ListItemIcon>
                        <SaveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Сохранения" />
                </ListItem>
                <ListItem
                    button
                    selected={selectedIndex === 1}
                    onClick={event => handleListItemClick(event, 1)}
                >
                    <ListItemIcon>
                        <FindSceneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Доступные сцены" />
                </ListItem>
                <Divider />
                <ListItem
                    button
                    selected={selectedIndex === 2}
                    onClick={event => handleListItemClick(event, 2)}
                >
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Настройки" />
                </ListItem>
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <>
            <AppBar position="fixed" className={ classes.appBar }>
                <Toolbar className={ classes.header }>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={ handleDrawerToggle }
                        className={ classes.menuButton }
                    >
                        <MenuIcon />
                    </IconButton>
                    <div>
                        <Navigation authToken={ authToken } />
                    </div>
                </Toolbar>
            </AppBar>
            <nav className={ classes.drawer } aria-label="mailbox folders">
                <Hidden smUp implementation="css">
                    <Drawer
                        container={ container }
                        variant="temporary"
                        anchor={ theme.direction === 'rtl' ? 'right' : 'left' }
                        open={ mobileOpen }
                        onClose={ handleDrawerToggle }
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true,
                        }}
                    >
                        { drawer }
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        { drawer }
                    </Drawer>
                </Hidden>
            </nav>
        </>
    );
}

HeaderProfile.propTypes = {
    window: PropTypes.func,
};

export default HeaderProfile;


import React from 'react';
import Link from "next/link";
import { Toolbar, Typography, AppBar } from '@material-ui/core';
import { useTheme } from "@material-ui/core/styles";

import Navigation from "../../Navigation/Navigation";

import { useStyles } from "./HeaderViewport.style";

const HeaderViewport = ({ authToken }) => {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <AppBar position="absolute" className={ classes.appbar }>
            <Toolbar className={ classes.toolbar }>

            </Toolbar>
        </AppBar>
    )
}

export default HeaderViewport

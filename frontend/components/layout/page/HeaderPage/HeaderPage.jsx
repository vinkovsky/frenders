import React from 'react';
import Link from "next/link";
import { Toolbar, Typography, AppBar } from '@material-ui/core';
import { useTheme } from "@material-ui/core/styles";

import Navigation from "../../Navigation/Navigation";

import { useStyles } from "./HeaderPage.style";

const HeaderPage = ({ authToken }) => {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <AppBar position="absolute" className={ classes.appbar }>
            <Toolbar className={ classes.toolbar }>
                <Link href="/">
                    <a className={ classes.link }>
                        <Typography variant="h1" className={ classes.logo }>
                            Frenders
                        </Typography>
                    </a>
                </Link>
                <Navigation authToken={ authToken } />
            </Toolbar>
        </AppBar>
    )
}

export default HeaderPage

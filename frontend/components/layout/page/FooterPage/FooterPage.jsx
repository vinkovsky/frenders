import React from 'react'

import { useStyles } from "./FooterPage.style";

const FooterPage = () => {
    const classes = useStyles();

    return (
        <footer className={ classes.footer }>
            &copy; { new Date().getFullYear() }
        </footer>
    );
}

export default FooterPage;

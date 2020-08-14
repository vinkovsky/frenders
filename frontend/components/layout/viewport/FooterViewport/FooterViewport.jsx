import React from 'react'

import { useStyles } from "./FooterViewport.style";

const FooterViewport = () => {
    const classes = useStyles();

    return (
        <footer className={ classes.footer } />
    );
}

export default FooterViewport;

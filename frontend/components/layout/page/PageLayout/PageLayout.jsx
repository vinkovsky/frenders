import React from 'react'

import HeaderPage from "../HeaderPage/HeaderPage";
import FooterPage from "../FooterPage/FooterPage";

import classes from './PageLayout.module.sass'

const PageLayout = ({ children, authToken }) => {
    return (
        <div className={ classes.container }>
            <HeaderPage authToken={ authToken } />
            <main className={ classes.main }>
                { children }
            </main>
            <FooterPage />
        </div>
    )
}

export default PageLayout

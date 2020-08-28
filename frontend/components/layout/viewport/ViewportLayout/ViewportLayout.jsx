import React from 'react'
import HeaderViewport from "../HeaderViewport/HeaderViewport";

import classes from './ViewportLayout.module.sass'

const ViewportLayout = ({ children, authToken }) => {
    return (
        <div className={ classes.container }>
            <HeaderViewport authToken={ authToken } />
            <main className={ classes.main }>
                { children }
            </main>
        </div>
    )
}

export default ViewportLayout;

import React from 'react'
import HeaderViewport from "../HeaderViewport/HeaderViewport";
import FooterViewport from "../FooterViewport/FooterViewport";

import classes from './ViewportLayout.module.sass'

const ViewportLayout = ({ children, authToken }) => {
    return (
        <div className={ classes.container }>
            <HeaderViewport authToken={ authToken } />
            <main className={ classes.main }>
                { children }
            </main>
            {/*<FooterViewport />*/}
        </div>
    )
}

export default ViewportLayout;

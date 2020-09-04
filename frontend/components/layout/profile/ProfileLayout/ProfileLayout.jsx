import React, { Children, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useTheme } from '@material-ui/core/styles';

import HeaderProfile from "../HeaderProfile/HeaderProfile";

import { useStyles } from "./Profile.style";

function ProfileLayout({ children, authToken }) {
    const classes = useStyles();
    const theme = useTheme();
    const [selectedIndex, setSelectedIndex] = useState(1);

    const changeData = (value) => {
        setSelectedIndex(value);
    }

    return (
        <div className={ classes.root }>
            <CssBaseline />
            <HeaderProfile authToken={ authToken } changeData={ changeData } />
            <main className={ classes.content }>
                <div className={ classes.toolbar } />
                <section className={ classes.section }>
                    {
                        Children.map(children, (child, index) => {
                            if(index === selectedIndex)
                                return child;
                        })
                    }
                </section>
            </main>
        </div>
    );
}

export default ProfileLayout;


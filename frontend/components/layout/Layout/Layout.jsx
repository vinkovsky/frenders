import React, { useContext } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress'

import ViewportLayout from "../viewport/ViewportLayout/ViewportLayout";
import ProfileLayout from "../profile/ProfileLayout/ProfileLayout";
import PageLayout from "../page/PageLayout/PageLayout";
import AppContext from "../../../context/AppContext";

import { useStyles } from "./Layout.style";

const Layout = ({ children, title = '' }) => {
    const classes = useStyles();
    const router = useRouter();

    const { user, setUser, loading } = useContext(AppContext);

    // if (loading) {
    //     return <CircularProgress className={ classes.progress } />;
    // }

    const viewLayout = (user) => {
        switch (router.pathname) {
            case '/': case '/signin': case '/signup': {
                return <PageLayout authToken={ user }>{ children }</PageLayout>
            }
            case '/profile': {
                return <ProfileLayout authToken={ user }>{ children }</ProfileLayout>
            }
            default: {
                return <ViewportLayout authToken={ user }>{ children }</ViewportLayout>
            }
        }
    }

    return (
        <>
            <Head>
                <title>{ title }</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            {
                viewLayout(user)
            }
        </>
    )
}

export default Layout

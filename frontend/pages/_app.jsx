import React, { Suspense } from "react";
import App from "next/app";
import Cookie from "js-cookie";
import fetch from "isomorphic-fetch";
import AppContext from "../context/AppContext";
import withData from "../graphql/apolloClient";
import { ThemeProvider } from '@material-ui/core/styles';

import theme from '../public/js/theme';

import './index.sass'

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

class MyApp extends App {
    state = {
        user: null,
        loading: true
    };

    componentDidMount() {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }

        const token = Cookie.get("token");

        if (token) {
            fetch(`${ API_URL }/users/me`, {
                headers: {
                    Authorization: `Bearer ${ token }`,
                },
            }).then(async (res) => {
                if (!res.ok) {
                    Cookie.remove("token");
                    this.setState({ user: null });
                    return null;
                }
                const user = await res.json();
                this.setUser(user);
            }).catch(err => {
                console.log(err);
            });
        }
    }

    setUser = (user) => {
        this.setState({ user });
    };

    render() {
        const { Component, pageProps } = this.props;

        return (
            <ThemeProvider theme={ theme }>
                <AppContext.Provider
                    value={{
                        user: this.state.user,
                        isAuthenticated: !!this.state.user,
                        setUser: this.setUser,
                        loading: this.state.loading
                    }}
                >
                    <Component { ...pageProps } />
                </AppContext.Provider>
            </ThemeProvider>
        );
    }
}

export default withData(MyApp);

import React, { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import axios from "axios";

const LOCAL_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
const HEROKU_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://frenders-api.herokuapp.com";

export const registerUser = (username, email, password) => {
    if (typeof window === "undefined") {
        return;
    }
    return new Promise((resolve, reject) => {
        axios
            .post(`${LOCAL_API_URL}/auth/local/register`, { username, email, password })
            .then((res) => {
                Cookie.set("token", res.data.jwt);
                resolve(res);
                Router.push("/profile");
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const login = (identifier, password) => {
    if (typeof window === "undefined") {
        return;
    }
    return new Promise((resolve, reject) => {
        axios
            .post(`${ LOCAL_API_URL }/auth/local/`, { identifier, password })
            .then((res) => {
                Cookie.set("token", res.data.jwt);
                resolve(res);
                Router.push("/profile");
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const logout = () => {
    Cookie.remove("token");
    delete window.__user;
    window.localStorage.setItem("logout", Date.now());
    Router.push("/");
};

export const withAuthSync = (Component) => {
    const Wrapper = (props) => {
        const syncLogout = (event) => {
            if (event.key === "logout") {
                //Router.push("/");
                Router.reload()
            }
        };

        useEffect(() => {
            window.addEventListener("storage", syncLogout);

            return () => {
                window.removeEventListener("storage", syncLogout);
                window.localStorage.removeItem("logout");
            };
        }, []);

        return <Component {...props} />;
    };

    if (Component.getInitialProps) {
        Wrapper.getInitialProps = Component.getInitialProps;
    }

    return Wrapper;
};
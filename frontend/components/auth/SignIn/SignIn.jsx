import React, { useState, useEffect, useContext } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';
import { Grid, Card, CardContent, CardActions, Button, Paper, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress'

import { InputField } from "../InputField/InputField";
import { useFieldChange } from "../../../hooks/auth/useFieldChange";
import { useErrorMessage } from "../../../hooks/auth/useErrorMessage";

import { login } from "../../../lib/auth";
import AppContext from "../../../context/AppContext";

import { useStyles } from "./SignIn.style";

const SignIn = () => {
    const classes = useStyles();
    const router = useRouter();
    const appContext = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const handleChange = useFieldChange(setLoginData);

    useEffect(() => {
        if (appContext.isAuthenticated) {
            router.push("/");
        }
    }, []);

    const handleSubmit =  async(e) => {
        e.preventDefault();
        setLoading(true);
        login(loginData.email, loginData.password)
            .then((res) => {
                setLoading(false);
                appContext.setUser(res.data.user);
            })
            .catch((error) => {
                setError(useErrorMessage(error.response.data));
                setLoading(false);
            });
    }

    if(loading) {
        return <CircularProgress className={ classes.progress } />;
    }

    return (
        <>
            <Grid container className={ classes.root } spacing={6}>
                <Grid item xs={12}>
                    <Card className={ classes.card }>
                        <Typography variant="h1" className={ classes.title }>
                            Вход
                        </Typography>
                        <CardContent>
                            <form onSubmit={ handleSubmit } id="formSignIn">
                                { error && <p className={ classes.error }>{ error }</p> }
                                <InputField
                                    type="email"
                                    label="Введите email"
                                    name="email"
                                    autoComplete="email"
                                    required
                                    value={ loginData.email }
                                    onChange={ handleChange('email') }
                                />
                                <InputField
                                    type="password"
                                    label="Введите пароль"
                                    name="password"
                                    autoComplete="password"
                                    required
                                    value={ loginData.password }
                                    onChange={ handleChange('password') }
                                />
                            </form>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" color="primary" type="submit" disabled={ loading }
                                    form="formSignIn" className={ classes.button }>
                                { loading ? "Загрузка... " : "Войти" }
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            <Grid container className={ classes.root } spacing={6}>
                <Grid item xs={12}>
                    <Paper className={ classes.paper }>
                        У вас еще нет аккаунта? {' '}
                        <Link href="/signup">
                            <a>Зарегистрируйтесь</a>
                        </Link>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default SignIn;

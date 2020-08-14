import React, { useState, useContext } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";
import { Grid, Card, CardContent, CardActions, Button, Paper, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import { InputField } from "../InputField/InputField";
import { useFieldChange } from "../../../hooks/auth/useFieldChange";
import { useErrorMessage } from "../../../hooks/auth/useErrorMessage";
import { registerUser } from "../../../lib/auth";
import AppContext from "../../../context/AppContext";

import { useStyles } from "../SignIn/SignIn.style";

const SignUp = () => {
    const classes = useStyles();
    const theme = useTheme();
    const router = useRouter();
    const appContext = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const handleChange = useFieldChange(setRegisterData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        registerUser(registerData.username, registerData.email, registerData.password)
            .then((res) => {
                appContext.setUser(res.data.user);
                setLoading(false);
            })
            .catch((error) => {
                setError(useErrorMessage(error.response.data));
                setLoading(false);
            });
    };

    return (
        <>
            <Grid container className={ classes.root } spacing={6}>
                <Grid item xs={12}>
                    <Card className={ classes.card }>
                        <Typography variant="h1" className={ classes.title }>
                            Регистрация
                        </Typography>
                        <CardContent>
                            <form id="formSignUp" onSubmit={ handleSubmit }>
                                { error && <p className={ classes.error }>{ error }</p> }
                                <InputField
                                    type="text"
                                    label="Введите логин"
                                    name="username"
                                    autoComplete="username"
                                    required
                                    value={ registerData.username }
                                    onChange={ handleChange('username') }
                                />
                                <InputField
                                    type="email"
                                    label="Введите email"
                                    name="email"
                                    autoComplete="email"
                                    required
                                    value={ registerData.email }
                                    onChange={ handleChange('email') }
                                />
                                <InputField
                                    type="password"
                                    label="Введите пароль"
                                    name="password"
                                    autoComplete="password"
                                    required
                                    value={ registerData.password }
                                    onChange={ handleChange('password') }
                                />
                            </form>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" color="primary" disabled={ loading }
                                    type="submit" form="formSignUp" className={ classes.button }>
                                { loading ? "Загрузка..." : "Зарегистрироваться" }
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            <Grid container className={ classes.root } spacing={6}>
                <Grid item xs={12}>
                    <Paper className={ classes.paper }>
                        Уже зарегистрированы? {' '}
                        <Link href="/signin">
                            <a>Войдите</a>
                        </Link>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default SignUp;
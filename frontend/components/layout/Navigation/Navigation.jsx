import React, { useContext } from 'react'
import Link from "next/link";
import { useRouter } from 'next/router';
import Button from "@material-ui/core/Button";

import ButtonLink from "../ButtonLink/ButtonLink";
import AppContext from "../../../context/AppContext";
import { logout } from "../../../lib/auth";

import classes from './Navigation.module.sass';

const Navigation = ({ authToken }) => {
    const router = useRouter();
    const { user, setUser } = useContext(AppContext);

    const signOut = () => {
        logout();
        setUser(null);
    }

    if (authToken) {
        return (
            <nav>
                <ul>
                    <li className={ classes.item }>
                        <Link href="/profile">
                            <a>Профиль - { authToken.username }</a>
                        </Link>{' '}
                    </li>
                    <li className={ classes.item }>
                        <Button variant="outlined" color="secondary" onClick={ signOut }>
                            Выход
                        </Button>
                    </li>
                </ul>
            </nav>
        )
    }
    else {
        return (
            <nav>
                <ul>
                    <li className={ classes.item }>
                        <Button component={ ButtonLink } variant="outlined" color="secondary" href="/signup">
                            Регистрация
                        </Button>
                    </li>
                    <li className={ classes.item }>
                        <Button component={ ButtonLink } variant="outlined" color="secondary" href="/signin">
                            Вход
                        </Button>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Navigation

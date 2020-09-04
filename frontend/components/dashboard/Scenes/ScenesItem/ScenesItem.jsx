import React, {useContext} from 'react';
import Link from 'next/link';
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Typography
} from '@material-ui/core';

import { useStyles } from "./ScenesItem.style";
import axios from "axios";
import AppContext from "../../../../context/AppContext";
import {useRouter} from "next/router";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const ScenesItem = ({ items }) => {
    const classes = useStyles();
    const { name, img, model } = items;
    const { user } = useContext(AppContext);
    const router = useRouter();

    const createModel = async () => {
        const response = await axios({
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            url: `${API_URL}/models`,
            data: JSON.stringify(
                {
                    name: name,
                    user: user.id,
                    img: img.id,
                    model: model.id
                }
            )
        })
        console.log(model.id)
        console.log(response.data._id)
        if (response.status === 200) {
            router.push(`/scene?id=${response.data._id}`, `/scene/${response.data._id}`)
        }

    }

    return (
        <Card className={ classes.root }>
            <CardActionArea className={ classes.actionArea }>
                <CardMedia
                    component="img"
                    alt={ name }
                    height="150"
                    image={ img.url }
                    title={ name }
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        { name }
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions className={ classes.action }>
                <Button variant="contained" color="primary" disableElevation onClick={createModel}>
                    Создать
                </Button>
            </CardActions>
        </Card>
    )
}

export default React.memo(ScenesItem)

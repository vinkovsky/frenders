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

import { useStyles } from "./SaveScenesItem.style";
import axios from "axios";
import AppContext from "../../../../context/AppContext";
import {useRouter} from "next/router";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const SaveScenesListItem = ({ items }) => {
    const classes = useStyles();
    const { name, img, model, id } = items;
    const { user } = useContext(AppContext);
    const router = useRouter();

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
                <Button variant="contained" color="primary" disableElevation onClick={() => {
                    router.push(`/scene?id=${id}`, `/scene/${id}`)
                }}>
                    Редактировать
                </Button>
            </CardActions>
        </Card>
    )
}

export default React.memo(SaveScenesListItem)

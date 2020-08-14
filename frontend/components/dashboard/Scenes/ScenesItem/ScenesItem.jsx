import React from 'react';
import Link from 'next/link';
import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Typography
} from '@material-ui/core';

import { useStyles } from "./ScenesItem.style";

const ScenesItem = ({ items }) => {
    const classes = useStyles();
    const { id, name, img, model } = items;

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
                <Link href={{ pathname: `/scene?id=${id}`/*, query: { model: model.url }*/ }} as={`/scene/${id}`} shallow={true}>
                    <a className={ classes.button }>
                        Создать
                    </a>
                </Link>
            </CardActions>
        </Card>
    )
}

export default React.memo(ScenesItem)

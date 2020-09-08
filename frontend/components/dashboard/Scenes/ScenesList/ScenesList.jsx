import React from 'react'

import ScenesItem from "../ScenesItem/ScenesItem";
import {useStyles} from "./ScenesList.style";
import {useQuery} from "@apollo/react-hooks";
import ModelsQuery from "../../../../graphql/queries/dashboard/models";
import CircularProgress from "@material-ui/core/CircularProgress";

const ScenesList = () => {
    const classes = useStyles();

    const { data, loading, error, refetch } = useQuery(ModelsQuery);

    if (loading) {
        return <CircularProgress className={ classes.progress }/>;
    }
    else {
        refetch();
    }

    if (error) {
        return <p>Ошибка</p>;
    }

    return (
        <>

            {
                data.assets.map((item, key) => {
                    return <ScenesItem items={ item } key={ key } />
                })
            }
        </>
    )
}

export default React.memo(ScenesList)

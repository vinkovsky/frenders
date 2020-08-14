import React from 'react'
import { useQuery } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";

import ScenesList from "../../dashboard/Scenes/ScenesList/ScenesList";
import ModelsQuery from "../../../graphql/queries/dashboard/models";

import { useStyles } from "./Profile.style";

const Profile = () => {
    const classes = useStyles();
    const { data, loading, error, refetch } = useQuery(ModelsQuery);

    if (loading) {
        return <CircularProgress className={ classes.progress }/>;
    }
    else {
        refetch();
    }

    if(error) {
        return <p>Ошибка</p>;
    }

    return <ScenesList items={ data.models } />;
}

export default React.memo(Profile);

import React, {useContext, useEffect} from 'react'

import SaveScenesListItem from "../SaveScenesListItem/SaveScenesListItem";
import {useStyles} from "../../Scenes/ScenesList/ScenesList.style";
import {useLazyQuery, useQuery} from "@apollo/react-hooks";

import CircularProgress from "@material-ui/core/CircularProgress";
import SavedModelsQuery from "../../../../graphql/queries/dashboard/SavedModelsQuery";
import AppContext from "../../../../context/AppContext";

const SaveScenesList = () => {
    const classes = useStyles();
    const appContext = useContext(AppContext);
    const [getUser, { loading, data }]  = useLazyQuery(SavedModelsQuery);

    useEffect(() => {
        if(!appContext.user) return

        getUser({
            variables: {
                id: appContext.user.id
                // id: "5f1a572978ef3c0038e66a69"
            }
        })

    }, [appContext.user])

    if (loading) {
        return <CircularProgress className={ classes.progress }/>;
    }

    return (
        <>
            {data &&
                data.user.models.map((item, key) => {
                    return <SaveScenesListItem items={ item } key={ key } />
                })
            }
        </>
    )
}

export default SaveScenesList

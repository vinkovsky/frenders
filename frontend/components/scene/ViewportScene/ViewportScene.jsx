import React, {useState, useReducer, useMemo} from 'react';
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import { NoSsr, CssBaseline, Paper, Tabs, Tab, CircularProgress } from "@material-ui/core";

import ToolBox from "../toolbox/ToolBox/ToolBox";
import SettingsViewport from "../settings/SettingsViewport/SettingsViewport";
import FooterViewport from "../footer/FooterViewport/FooterViewport";
import ViewportSceneContext from "../../../context/ViewportSceneContext";

import EnvironmentsQuery from "../../../graphql/queries/viewport/environments";
import ModelsQuery from "../../../graphql/queries/dashboard/models";

import getCanvasReducer from "../../../reducers/getCanvasReducer";
import getObjectsReducer from "../../../reducers/getObjectsReducer";
import getRendererReducer from "../../../reducers/getRendererReducer";

import Viewport from "../viewport/Viewport";
import Uvw from '../viewport/Uvw';

import classes from './ViewportScene.module.sass'
import getColorReducer from "../../../reducers/getColorReducer";
import getDataReducer from "../../../reducers/getDataReducer";
import getCurrentObjectReducer from "../../../reducers/getCurrentObjectReducer";

function combineReducers(reducers) {
    return (state = {}, action) => {
        const newState = {};
        for (let key in reducers) {
            if (reducers.hasOwnProperty(key)) {
                newState[key] = reducers[key](state[key], action);
            }
        }
        return newState;
    }
}

const ViewportScene = () => {
    const [active, setActive] = useState(0);
    const router = useRouter();

    const { data, loading, error, refetch } = useQuery(EnvironmentsQuery);

    const initialState = {
        update: null,
        getObjects: [],
        getRenderer: {
            toneMappingValue: 4,
            exposureValue: 1.5,
            envMap: "https://res.cloudinary.com/frenders/raw/upload/v1595923417/shanghai_bund_2k_8d026479c4",
            background: true,
            backgroundColor: 'transparent'
        },
        getColor: 'transparent',
        getData: {
            container: null,
            scene: null,
            camera: null,
            transformControls: null,
            renderer: null,
            model: null,
            highlighter: null
        },
        getCurrentObject: {
            name: null,
            object: null
        }

    }

    const [state, dispatch] = useReducer(combineReducers({
        getCanvas: getCanvasReducer,
        getObjects: getObjectsReducer,
        getRenderer: getRendererReducer,
        getCurrentObject: getCurrentObjectReducer,
        getColor: getColorReducer,
        getData: getDataReducer
    }), initialState);

    const [combinedState, combinedDispatch] = useMemo(() => [state, dispatch], [state]);

    const handleChange = (event, newValue) => {
        setActive(newValue);
    };

    if (loading) {
        return <CircularProgress className={classes.progress}/>;
    }
    else {
        refetch();
    }

    return (
        <NoSsr>
            <ViewportSceneContext.Provider value={[combinedState, combinedDispatch]}>
                <CssBaseline />
                <ToolBox active={ active } />
                <div className={ classes.tabs } >
                    <Paper className={ classes.root }>
                        <Tabs
                            value={ active }
                            onChange={ handleChange }
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="Viewport" />
                            <Tab label="Uvw" />
                        </Tabs>
                    </Paper>
                    <div className={ active ? classes.none : classes.block }>
                        <Viewport envMaps={ data } />
                    </div>
                    <div className={ active ? classes.block : classes.none }>
                        <Uvw />
                    </div>
                    <FooterViewport />
                </div>
                <SettingsViewport active={ active } envMaps={ data } />
            </ViewportSceneContext.Provider>
        </NoSsr>
    )
}

export default ViewportScene;

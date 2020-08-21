import React, { Component, useContext, useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import Loader from "./Loader";
import Renderer from "./renders/Renderer";
import ViewportSceneContext from "../../../context/ViewportSceneContext";

import ModelIdQuery from "../../../graphql/queries/dashboard/modelId";

import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import {useQuery} from "@apollo/react-hooks";
import {CircularProgress} from "@material-ui/core";
import classes from "../ViewportScene/ViewportScene.module.sass";
import {useRouter} from "next/router";

//import { ContextApp } from "../ViewportScene/ViewportScene";

const Viewport = React.memo(({ envMaps }) => {

    const [assets, setAssets] = useState(null);
    const [active, setActive] = useState(true);
    const [state, dispatch] = useContext(ViewportSceneContext);

    const router = useRouter();

    const { data, loading, error, refetch } = useQuery(ModelIdQuery, {
        variables: {
            id: router.query.id
        }
    });

    useEffect(() => {
        if (!state.getCanvas || data === undefined || !state.getRenderer.envMap) return;

        const { GLTFLoader } = require("three/examples/jsm/loaders/GLTFLoader");
        const { DRACOLoader } = require("three/examples/jsm/loaders/DRACOLoader");
        const { RGBELoader } = require("three/examples/jsm/loaders/RGBELoader");

        async function init() {

            const gltf = await Loader([GLTFLoader, DRACOLoader], data.model.model.url);
            const env = await Loader([RGBELoader], state.getRenderer.envMap);
        
            env.dispose();
            
            let objects = [];
            gltf.scene.traverse((child) => {
                if(!child.isMesh ) return;
                objects.push(child.name);
            })

            dispatch({
                type: 'getObjects',
                payload: {
                    objects
                }
            });


            setAssets({ model: gltf.scene, canvas: state.getCanvas, env })
        }
        init();
    }, [state.getCanvas, state.getRenderer.envMap, data])

    if (!assets) {
        return null;
    }

    const changeRenderer = () => {
        setActive(active => !active);
    }

    return (
        <>
            <Button variant="contained" style={{ position: 'absolute', top: 0, right: 0, zIndex: 100, width: '47px', height: '47px', borderRadius: 0 }}
                    color="primary" onClick={changeRenderer}>
                <PhotoCameraIcon />
            </Button>
        
            <Renderer assets={assets} type={active} />
        </>

    )

});




export default React.memo(Viewport);




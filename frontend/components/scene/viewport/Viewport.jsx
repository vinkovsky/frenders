import React, { Component, useContext, useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import Loader from "./Loader";
import Renderer from "./renders/Renderer";
import ViewportSceneContext from "../../../context/ViewportSceneContext";

import ModelIdQuery from "../../../graphql/queries/dashboard/modelId";
import * as THREE from 'three'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import {useMutation, useQuery} from "@apollo/react-hooks";
import {CircularProgress} from "@material-ui/core";
import classes from "../ViewportScene/ViewportScene.module.sass";
import {useRouter} from "next/router";
import AppContext from "../../../context/AppContext";
import gql from "graphql-tag";
import ScenesItem from "../../dashboard/Scenes/ScenesItem/ScenesItem";
import FooterViewport from "../footer/FooterViewport/FooterViewport";

//import { ContextApp } from "../ViewportScene/ViewportScene";

// const SAVE_MODEL = gql`
//     mutation saveModelJSON(
//         $id: ID!
//         $saveModel: JSON!
//     ){
//         updateUser(
//             input: {
//                 where: { id: $id }
//                 data: {
//                     saveModel: $saveModel
//                 }
//             }
//         ) {
//             user {
//                 saveModel
//             }
//         }
//     }
// `;

const Viewport = React.memo(({ envMaps }) => {
    const appContext = useContext(AppContext);
    const [assets, setAssets] = useState(null);
    const [active, setActive] = useState(true);
    const [state, dispatch] = useContext(ViewportSceneContext);

    const router = useRouter();

    const { data, loading, error, refetch } = useQuery(ModelIdQuery, {
        variables: {
            id: router.query.id
        }
    });

    // const [ saveModelJSON ] = useMutation(SAVE_MODEL)

    useEffect(() => {
        if (data === undefined || appContext.user === null) return;

        // console.log(data.model)
        //
        // const { name, img, model, __typename, ...rest  } = data.model;
        //
        // console.log(rest)
        //
        // saveModelJSON({
        //     variables: {
        //         id: appContext.user.id,
        //         saveModel: rest
        //     }
        // })
    }, [data])

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
                child.material = new THREE.MeshStandardMaterial()
                child.material.side = THREE.DoubleSide;
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




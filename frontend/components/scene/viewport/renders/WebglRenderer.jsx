import React from "react";
import { WebGLRenderer, PMREMGenerator, Color } from "three";
import { useEffect, useState, useRef,forwardRef, useContext, memo } from "react";
import useFrame from "./useFrame"
import useResize from "./useResize";
import Controls from "../Controls";
import ViewportSceneContext from "../../../../context/ViewportSceneContext";
import Loader from "../Loader";

const WebglRenderer = (env, scene, background) => {
    const renderer = new WebGLRenderer({antialias: true});


    let pmremGenerator = new PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    let hdr = pmremGenerator.fromEquirectangular(env).texture;

    // if (env === "#000000" || env === null) {
    //     scene.background = new Color(env);
    // } else {
    //     let hdr = pmremGenerator.fromEquirectangular(env).texture;
    //
    //     scene.environment = hdr;
    //     scene.background = hdr;
    // }
    if(!background) {
        scene.background = new Color('#000000');
        scene.environment = hdr;
    } else {
        scene.environment = hdr;
        scene.background = hdr;
    }

    return renderer;
}

export default WebglRenderer;

// import React, {useContext, useEffect, useLayoutEffect, useRef, useState, useMemo} from "react";
// import WebglRenderer from "./WebglRenderer";
// import Container from "../Container";
// import Scene from "../Scene";
// import Camera from "../Camera";
// import RayTraceRenderer from "./RayTraceRenderer";
// import Controls from "../Controls";
// import * as THREE from "three";
// import ViewportSceneContext from "../../../../context/ViewportSceneContext";
// import {useRouter} from "next/router";
// import { useCallback } from "react";
// import Canvas from "./Canvas";

// import Highlighter from "../Highlighter";
// import EffectComposer from "../EffectComposer";


// // const Renderer = ({ assets, type }) => {
// const Renderer = ({ env, model, type }) => {
//     const containerRef = useRef();
//     const frameIdRef = useRef();
//     const rendererRef = useRef();
//     const sceneRef = useRef();
//     const cameraRef = useRef();
//     const controlsRef = useRef();
//     const transformControls = useRef();
//     const [target, setTarget] = useState(new THREE.Vector3(0, 70, 0))
//     const [state, dispatch] = useContext(ViewportSceneContext);
//     const router = useRouter()

//     useEffect(() => {
//         cameraRef.current = Camera();
//         model.models.traverse((child) => {
//             if(!child.isMesh ) return;
//             child.material = new THREE.MeshStandardMaterial()
//         })
//     }, [])

//     useEffect(() => {
//         // const { env, models, textures } = assets;
//         const { models, textures } = model;

//         sceneRef.current = Scene(models, textures);
//        // textures.canvas.defineProps(containerRef.current, sceneRef.current, cameraRef.current);

//         rendererRef.current = type ?
//             WebglRenderer(env, sceneRef.current, state.getRenderer.background) :
//             RayTraceRenderer(env, sceneRef.current, state.getRenderer.background);
//         containerRef.current.appendChild(rendererRef.current.domElement);

//         rendererRef.current.outputEncoding = THREE.sRGBEncoding;
//         rendererRef.current.setPixelRatio(1.0);
//         rendererRef.current.toneMapping = 4;
//         rendererRef.current.toneMappingExposure = 1.5;
//         rendererRef.current.renderWhenOffFocus = false;
//         rendererRef.current.bounces = 3;
//    //     textures.canvas.addRaycaster();

//         controlsRef.current = Controls(cameraRef.current, rendererRef.current.domElement, models);

//         const highlighter = Highlighter(rendererRef.current.domElement, sceneRef.current, cameraRef.current);

//         dispatch({
//             type: 'getData',
//             payload: {
//                 container: containerRef.current,
//                 scene: sceneRef.current,
//                 camera: cameraRef.current,
//                 renderer: rendererRef.current,
//                 transformControls: controlsRef.current[1],
//                 model: models,
//                 highlighter: highlighter
//             }
//         });

//         return () => {
//            // textures.canvas.removeRaycaster()
//             controlsRef.current[0].dispose();
//             controlsRef.current[1].dispose();
//             rendererRef.current.dispose();
//             rendererRef.current.domElement.remove();
//             cancelAnimationFrame(frameIdRef.current);
//         }
//     }, [model, type])

//     useEffect(() => {
//         if (!state.getRenderer) return;
//         rendererRef.current.toneMappingExposure = state.getRenderer.exposureValue;
//         rendererRef.current.toneMapping = state.getRenderer.toneMappingValue;
//     }, [state.getRenderer.exposureValue, state.getRenderer.toneMappingValue])

//     useLayoutEffect(() => {
//         return () => {
//             controlsRef.current[0].target.copy(target);
//             cameraRef.current.lookAt(target);
//         }
//     }, [target])

//     useEffect(() => {
//         setTarget(target => controlsRef.current.target);
//     }, [type])

//     useEffect(() => {
//         const animate = (time) => {
//             if (rendererRef.current.sync) {
//                 rendererRef.current.sync(time);
//             }
//             controlsRef.current[0].update()
//             rendererRef.current.render(sceneRef.current, cameraRef.current);
//             frameIdRef.current = requestAnimationFrame(animate);
//         }
//         resize();
//         animate();
//     }, [type])

//     let width, height;

//     function resize() {
//         width = containerRef.current.offsetWidth;
//         height = containerRef.current.offsetHeight;
//         rendererRef.current.setSize(width, height);
//         cameraRef.current.aspect = width / height;
//         cameraRef.current.updateProjectionMatrix();
//     }

//     return <Container ref={containerRef} resize={resize} />;
// }

// export default Renderer;


import React, {useContext, useEffect, useLayoutEffect, useRef, useState, useMemo} from "react";
import WebglRenderer from "./WebglRenderer";
import Container from "../Container";
import Scene from "../Scene";
import Camera from "../Camera";
import RayTraceRenderer from "./RayTraceRenderer";
import Controls from "../Controls";
import * as THREE from "three";
import ViewportSceneContext from "../../../../context/ViewportSceneContext";
import {useRouter} from "next/router";
import { useCallback } from "react";
import Canvas from "./Canvas";
import Loader from "../Loader";

// const Renderer = ({ assets, type }) => {
const Renderer = ({ assets, type }) => {

    return (
        type ? 
            <WebglRenderer assets={assets} /> : 
            <RayTraceRenderer assets={assets} />
    )
        
}

export default Renderer;

import React from "react";
import { WebGLRenderer, PMREMGenerator, Color } from "three";
import { useEffect, useState, useRef,forwardRef, useContext, memo } from "react";
import useFrame from "./useFrame"
import useResize from "./useResize";
import Controls from "../Controls";
import ViewportSceneContext from "../../../../context/ViewportSceneContext";
import Loader from "../Loader";
import Camera from "../Camera";
import Scene from "../Scene";
import Highlighter from "../Highlighter";
import EffectComposer from "../EffectComposer";

const WebglRenderer = ({ assets: { model, canvas, env } }) => {
    const canvasRef = useRef();
    const rendererRef = useRef(null);
    const sceneRef = useRef();
    const cameraRef = useRef();
    const { width, height } = useResize()
    const [state, dispatch] = useContext(ViewportSceneContext);
    const hdrRef = useRef();
    const transformControls = useRef();

    useEffect(() => {
        rendererRef.current = new WebGLRenderer({
            antialias: true, 
            canvas: canvasRef.current
        });
        sceneRef.current = Scene(model, canvas)
        cameraRef.current = Camera()
        const controls = Controls(cameraRef.current, canvasRef.current)[0]
        const highlighter = Highlighter(rendererRef.current.domElement, sceneRef.current, cameraRef.current);
        //rendererRef.current.setSize(1000, 1000)
        dispatch({
            type: 'getData',
            payload: {
                container: canvasRef.current,
                scene: sceneRef.current,
                camera: cameraRef.current,
                renderer: rendererRef.current,
                transformControls: controls[1],
                model: model,
                highlighter: highlighter
            }
        });
        const animate = () => {
            controls.update()
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            requestAnimationFrame(animate);
        }
        
        animate();

        return () => {
            controlsRef.current[0].dispose();
            controlsRef.current[1].dispose();
            sceneRef.current.dispose();
            rendererRef.current.dispose();
            cancelAnimationFrame(animate);
        }
    }, [])

    useEffect(() => {
        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
    }, [width, height])
    
      
    useEffect(() => {
        if (!state.getRenderer.exposureValue) return;
        rendererRef.current.toneMappingExposure = state.getRenderer.exposureValue;
        rendererRef.current.toneMapping = state.getRenderer.toneMappingValue;
    }, [state.getRenderer.exposureValue, state.getRenderer.toneMappingValue])



    useEffect(() => {
        // if (!(state.getColor.color)) return;
      
        if (state.getRenderer.background) {
           
            sceneRef.current.background = new Color(state.getColor.color);
            // sceneRef.current.environment = state.getColor.color
        } else {
            console.log(state.getRenderer.background, state.getColor.color)
            sceneRef.current.background = hdrRef.current;
            console.log(sceneRef.current.background)
        }
    }, [state.getRenderer.background, state.getColor.color])

    useEffect(() => {
        if (!state.getRenderer.envMap) return;
        
        const { RGBELoader } = require("three/examples/jsm/loaders/RGBELoader");
        (async function () {
            const env = await Loader([RGBELoader], state.getRenderer.envMap);
            let pmremGenerator = new PMREMGenerator(rendererRef.current);
            pmremGenerator.compileEquirectangularShader();
           
            let hdr = pmremGenerator.fromEquirectangular(env).texture;
            hdrRef.current = hdr;        
            sceneRef.current.environment = hdr;
         //   if (!sceneRef.current.background) {
                sceneRef.current.background = hdr;
          //  }
            
            env.dispose()
            pmremGenerator.dispose()
        })()
     
    }, [state.getRenderer.envMap])
 
   
     
    return <canvas ref={canvasRef} />;
}

export default memo(WebglRenderer);

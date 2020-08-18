import { Color } from "three";
import { useEffect, useRef, useContext, memo } from "react";
import Scene from "../Scene";
import Controls from "../Controls";
import ViewportSceneContext from "../../../../context/ViewportSceneContext";
import Camera from "../Camera";
import Loader from "../Loader";
import { useState } from "react";
import useResize from "./useResize";
const RayTraceRenderer = ({ assets: { model, canvas, env } }) => {
    const canvasRef = useRef();
    const rendererRef = useRef(null);
    const sceneRef = useRef();
    const cameraRef = useRef();
    const [state, dispatch] = useContext(ViewportSceneContext);
    const { width, height } = useResize();
    const isFirstRun = useRef(true);
    
    useEffect(() => {
        if (!state.getRenderer.envMap) return;
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        const { EnvironmentLight } = require("ray-tracing-renderer");
        const { RGBELoader } = require("three/examples/jsm/loaders/RGBELoader");
        (async function () {
            const env = await Loader([RGBELoader], state.getRenderer.envMap);
            const currentEnv = sceneRef.current.getObjectById(44, true);
            
            if (currentEnv) {
                sceneRef.current.remove(currentEnv)
            }
            let hdr = new EnvironmentLight(env);
            // hdr.name = 'environment';

            sceneRef.current.add(hdr);
           
         
            rendererRef.current.needsUpdate = true;
          //  sceneRef.current.background = hdr;
            env.dispose();
        })()
     
    }, [state.getRenderer])
 


    useEffect(() => {
        if (!state.getCamera.camera) return;
        const { EnvironmentLight, RayTracingRenderer } = require("ray-tracing-renderer");

        rendererRef.current = new RayTracingRenderer({
            canvas: canvasRef.current
        });

       // if(state.getCamera)

        cameraRef.current = Camera()
        let controls = Controls(cameraRef.current, canvasRef.current)[0]
        sceneRef.current = Scene(model, canvas)
        if (state.getCamera.controls) {
            controls.target.copy(state.getCamera.controls.target);
            cameraRef.current.lookAt(state.getCamera.controls.target);
            cameraRef.current.position.copy(state.getCamera.camera.position)
        }

        let hdr = new EnvironmentLight(env);
        console.log(state.getCamera)
        sceneRef.current.add(hdr);
        rendererRef.current.setSize(1000, 1000)
        
        const animate = (time) => {
            if (!rendererRef.current) return;
            if (rendererRef.current.sync) {
                rendererRef.current.sync(time);
            }
            controls.update()
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            requestAnimationFrame(animate);
        }

        animate();

        return () => {
            dispatch({
                type: 'getCamera',
                payload: {
                    camera: cameraRef.current,
                    controls
                }
            });
            cancelAnimationFrame(animate);
            rendererRef.current.dispose();
            sceneRef.current.dispose();
            controls.dispose();
            rendererRef.current = null;
            sceneRef.current = null;
            controls = null;
        }
    }, [state.getCamera])

    useEffect(() => {
        if(!(rendererRef.current && width && height)) return;
        console.log(rendererRef.current)
        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
    }, [width, height, rendererRef.current])
    
      
    return <canvas ref={canvasRef} />;
}

export default RayTraceRenderer;

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
        sceneRef.current = Scene(model, canvas)
    }, [])

    useEffect(() => {
        if (!state.getRenderer.envMap) return;
        const { EnvironmentLight } = require("ray-tracing-renderer");
        const { RayTracingRenderer } = require("ray-tracing-renderer");
        rendererRef.current = new RayTracingRenderer({
            canvas: canvasRef.current
        });
    
        cameraRef.current = Camera()
        const controls = Controls(cameraRef.current, canvasRef.current)
        let hdr = new EnvironmentLight(env);

        sceneRef.current.add(hdr);
        rendererRef.current.setSize(1000, 1000)
        
        const animate = (time) => {
            if (rendererRef.current.sync) {
                rendererRef.current.sync(time);
            }

            controls.update()
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            requestAnimationFrame(animate);
        }
        
        animate();

        return () => {
            cancelAnimationFrame(animate);
            rendererRef.current.dispose();
            sceneRef.current.dispose();
            controls.dispose();
        }
    }, [])

    useEffect(() => {
        if(!(rendererRef.current && width && height)) return;
        console.log(rendererRef.current)
        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
    }, [width, height, rendererRef.current])
    
      
    return <canvas ref={canvasRef} />;
}

export default memo(RayTraceRenderer);

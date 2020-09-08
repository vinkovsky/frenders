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
    const controlsRef = useRef();


    useEffect(() => {
      //  if (!state.getCamera.camera) return;

        if (!(state.getRenderer.exposureValue && state.getRenderer.toneMappingValue)) return;

        const { EnvironmentLight, RayTracingRenderer } = require("ray-tracing-renderer");

        rendererRef.current = new RayTracingRenderer({
            canvas: canvasRef.current
        });

        rendererRef.current.toneMappingExposure = state.getRenderer.exposureValue;
        rendererRef.current.toneMapping = state.getRenderer.toneMappingValue;
       // if(state.getCamera)

        cameraRef.current = Camera()
        controlsRef.current = Controls(cameraRef.current, canvasRef.current)[0]
        sceneRef.current = Scene(model, canvas)

        let hdr = new EnvironmentLight(env);

        sceneRef.current.add(hdr);

            if (state.getRenderer.background) {
                sceneRef.current.background = new Color(state.getColor);
            } else {
                sceneRef.current.background = null;
            }


        rendererRef.current.setSize(1000, 1000)

        const animate = (time) => {
            if (!rendererRef.current) return;
            if (rendererRef.current.sync) {
                rendererRef.current.sync(time);
            }
            controlsRef.current.update()
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            requestAnimationFrame(animate);
        }

        animate();
        console.log(state.getCamera)
        return () => {

                dispatch({
                    type: 'getCamera',
                    payload: {
                        camera: cameraRef.current,
                        controls: controlsRef.current
                    }
                });

            cancelAnimationFrame(animate);
            rendererRef.current.dispose();
            sceneRef.current.dispose();
            controlsRef.current.dispose();
            rendererRef.current = null;
            sceneRef.current = null;
            controlsRef.current = null;
        }
    }, [state.getRenderer.exposureValue, state.getRenderer.toneMappingValue])

    useEffect(() => {
        if(!rendererRef.current) return;
        // if (!controlsRef.current) return;
        if (state.getCamera.controls && state.getCamera.camera) {
            controlsRef.current.target.copy(state.getCamera.controls.target);
            cameraRef.current.lookAt(state.getCamera.controls.target);
            cameraRef.current.position.copy(state.getCamera.camera.position)
        }

    }, [ state.getCamera, controlsRef.current])

    useEffect(() => {
        if(!(rendererRef.current && width && height)) return;
        console.log(rendererRef.current)
        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
    }, [width, height, rendererRef.current])


    useEffect(() => {
        if(!rendererRef.current) return;
        if (state.getRenderer.envMap === "none") {
            sceneRef.current.background = new Color(state.getColor);
        }
    }, [state.getRenderer.envMap, state.getColor])

    return <canvas ref={canvasRef} />;
}

export default RayTraceRenderer;

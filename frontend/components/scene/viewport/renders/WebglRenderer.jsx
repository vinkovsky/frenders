import React from "react";
import { WebGLRenderer, PMREMGenerator, Color, Vector2 } from "three";
import { useEffect, useState, useRef,forwardRef, useContext, memo } from "react";
import useFrame from "./useFrame"
import useResize from "./useResize";
import Controls from "../Controls";
import ViewportSceneContext from "../../../../context/ViewportSceneContext";
import Loader from "../Loader";
import Camera from "../Camera";
import Scene from "../Scene";
import Highlighter from "../Highlighter";
//import EffectComposer from "../EffectComposer";

 import OutlinePatch from '../OutlinePatch';


const WebglRenderer = ({ assets: { model, canvas, env } }) => {
    const canvasRef = useRef();
    const rendererRef = useRef(null);
    const sceneRef = useRef();
    const cameraRef = useRef();
    const { width, height } = useResize()
    const [state, dispatch] = useContext(ViewportSceneContext);
    const hdrRef = useRef();
    const composerRef = useRef();
    const controlsRef = useRef();
    const transformControls = useRef();
    const [ready, setReady] = useState(false);
    const effectFXAA = useRef();
    const outlinePass = useRef();
    const [object, setObject] = useState([]);
    const meshesRef = useRef([]);
    const clickedRef = useRef(false);
    const controledObjectRef = useRef(null);



    useEffect(() => {
       // if (!state.getCamera.camera) return;
        rendererRef.current = new WebGLRenderer({
            antialias: true, 
            canvas: canvasRef.current
        });
        cameraRef.current = Camera()
        controlsRef.current = Controls(cameraRef.current, canvasRef.current)
        sceneRef.current = Scene(model, canvas, controlsRef.current[1])


        controlsRef.current[1].addEventListener( 'dragging-changed',  event => {

            controlsRef.current[0].enabled = ! event.value;

        } );


        if (state.getCamera.controls) {
            controlsRef.current[0].target.copy(state.getCamera.controls.target);
            cameraRef.current.lookAt(state.getCamera.controls.target);
            cameraRef.current.position.copy(state.getCamera.camera.position)
        }


        //const highlighter = Highlighter(rendererRef.current.domElement, sceneRef.current, cameraRef.current);
        //rendererRef.current.setSize(1000, 1000)
        dispatch({
            type: 'getData',
            payload: {
                container: canvasRef.current,
                scene: sceneRef.current,
                camera: cameraRef.current,
                renderer: rendererRef.current,
                transformControls: controlsRef.current[1],
                model: model,
             //   highlighter: highlighter
            }
        });

        setReady(true)

        return () => {
            dispatch({
                type: 'getCamera',
                payload: {
                    camera: cameraRef.current,
                    controls: controlsRef.current[0]
                }
            });

            controlsRef.current[0].dispose();
            sceneRef.current.dispose();
            rendererRef.current.dispose();
            rendererRef.current = null;
            sceneRef.current = null;
            controlsRef.current[0] = null;
        }
    }, [])

    useEffect(() => {
        if (!state.getCurrentObject.object) return;
        //console.log(controlsRef.current[1].object !== state.getCurrentObject.object)

        if ( controlsRef.current[1].object === undefined || controlsRef.current[1].object !== state.getCurrentObject.object ) {
            controlsRef.current[1].attach( state.getCurrentObject.object );
        }

        console.log(state.getCurrentObject.object)

        outlinePass.current.selectedObjects = [state.getCurrentObject.object]
        console.log( outlinePass.current.selectedObjects)

    }, [state.getCurrentObject.object])


    useEffect(() => {
        if (!ready) return;
        const { EffectComposer } = require('three/examples/jsm/postprocessing/EffectComposer');
        const { RenderPass } = require('three/examples/jsm/postprocessing/RenderPass');
        const { ShaderPass } = require('three/examples/jsm/postprocessing/ShaderPass');
        const { OutlinePass } = require('three/examples/jsm/postprocessing/OutlinePass');
        const { FXAAShader } = require('three/examples/jsm/shaders/FXAAShader');
        composerRef.current = new EffectComposer(rendererRef.current);


        composerRef.current.addPass(new RenderPass(sceneRef.current, cameraRef.current));

        outlinePass.current = new OutlinePass(new Vector2(window.innerWidth, window.innerHeight), sceneRef.current, cameraRef.current);
        outlinePass.current.hiddenEdgeColor.set('#007BFF');
        composerRef.current.addPass(outlinePass.current);
        effectFXAA.current = new ShaderPass(FXAAShader);
     //   effectFXAA.current.uniforms['resolution'].value.set(  window.innerWidth,   window.innerHeight);
        composerRef.current.addPass(effectFXAA.current);

        return () => {
            composerRef.current = null;
            outlinePass.current = null;
            effectFXAA.current = null;
        }
    },[ready])



    useEffect(() => {
        if (!ready) return;

        const animate = (time) => {
            if (!rendererRef.current) return;
            controlsRef.current[0].update()
            //rendererRef.current.render(sceneRef.current, cameraRef.current);
            composerRef.current.render()
            requestAnimationFrame(animate);
        }

        animate();
        return () => {
            cancelAnimationFrame(animate);
        }
    }, [ready])

    useEffect(() => {
        if (!ready) return;
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();

        rendererRef.current.setSize(width, height);
        composerRef.current.setSize(width, height);
         effectFXAA.current.uniforms['resolution'].value.set(1 / width, 1 / height);
    }, [width, height, ready])

      
    useEffect(() => {
        if (!state.getRenderer.exposureValue) return;
        rendererRef.current.toneMappingExposure = state.getRenderer.exposureValue;
        rendererRef.current.toneMapping = state.getRenderer.toneMappingValue;
        model.traverse(child => {
            if (!child.isMesh) return
            child.material.needsUpdate = true;
        })
    }, [state.getRenderer.exposureValue, state.getRenderer.toneMappingValue])



    useEffect(() => {
        // if (!(state.getColor.color)) return;
      
        if (state.getRenderer.background) {
           
            sceneRef.current.background = new Color(state.getColor.color);
            // sceneRef.current.environment = state.getColor.color
        } else {
         //   console.log(state.getRenderer.background, state.getColor.color)
            sceneRef.current.background = hdrRef.current;
         //   console.log(sceneRef.current.background)
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

export default WebglRenderer;

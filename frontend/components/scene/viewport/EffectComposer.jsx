import * as THREE from "three";
import {useEffect} from "react";

const EffectComposer = (highlighter, renderer, scene, camera) => {
    const { EffectComposer } = require("three/examples/jsm/postprocessing/EffectComposer");
    const { RenderPass } = require("three/examples/jsm/postprocessing/RenderPass");
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    composer.addPass(highlighter);
    useEffect(() => {
        const animate = () => {
            requestAnimationFrame(animate);
            composer.render();
        }
        animate();
    }, [renderer]);
}

export default EffectComposer;

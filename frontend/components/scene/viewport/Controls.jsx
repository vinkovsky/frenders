import {useEffect} from "react";


const Controls = (cam, domEl, models) => {
    const { OrbitControls } = require("three/examples/jsm/controls/OrbitControls");
    const { TransformControls } = require("three/examples/jsm/controls/TransformControls");
    const transformControls = new TransformControls(cam, domEl);
    const controls = new OrbitControls(cam, domEl);
    controls.screenSpacePanning = true;
    controls.enableDamping = true;

   // controls.enabled = false;
    return [controls, transformControls];
}

export default Controls;

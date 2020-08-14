import * as THREE from "three";

const Highlighter = (domElement, scene, camera) => {
    const {OutlinePass} = require("three/examples/jsm/postprocessing/OutlinePass");

    let pass = new OutlinePass(
        new THREE.Vector2( domElement.clientWidth, domElement.clientHeight ),
        scene,
        camera
    );

    // const add = (obj) => {
    //     if (obj instanceof Array) {
    //         for (let i = 0, len = obj.length; i < len; i++) {
    //             pass.selectedObjects.push(obj[i]);
    //         }
    //     } else {
    //         pass.selectedObjects.push(obj);
    //     }
    // }
    //
    // const set = (obj) => {
    //     if (!(obj instanceof Array)) obj = [obj];
    //     pass.selectedObjects = obj;
    // }
    //
    // const clear = (obj) => {
    //     pass.selectedObjects = [];
    // }

    return pass;
}

export default Highlighter;
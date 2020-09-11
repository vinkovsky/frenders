import { Scene as Scene$1 } from 'three';
import * as THREE from "three";
import {useEffect} from "react";


const Scene = (model, { canvas, maps }, transformControls = null) => {
    const scene = new Scene$1();
    const textures = [];

    if (transformControls) scene.add(transformControls)

    model.traverse((child) => {
        if (!child.isMesh) return;

        if (child.name === 'drink') {
            maps.map((canvas) => {
                let texture = new THREE.CanvasTexture(canvas);
                child.material[canvas.id] = texture;
                textures.push(texture);
            })
        }
    });

    // canvas.isDrawingMode = true;
    // canvas.freeDrawingBrush.width = 50;
    canvas.on('mouse:move', e => {

        textures.map((val) => {
            val.needsUpdate = true;
        })
    });

    scene.add(model);
    scene.add( new THREE.GridHelper( 1000, 10 ) );
    return scene;
}

export default Scene;

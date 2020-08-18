import { Scene as Scene$1 } from 'three';
import * as THREE from "three";


const Scene = (model, { canvas, maps }, transformControls = null) => {
    const scene = new Scene$1();
    const textures = [];

    if (transformControls) scene.add(transformControls)
    model.traverse((child) => {
        if (!child.isMesh) return;
        // child.material = new THREE.MeshStandardMaterial()
        child.material.side = THREE.DoubleSide;

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
    // canvas.on('path:created', e => {
    //     textures.map((val) => {
    //         val.needsUpdate = true;
    //     })
    // });
  // canvas.on('after:render', canvas._afterRender());
    scene.add(model);
    scene.add( new THREE.GridHelper( 1000, 10 ) );
    //   scene.background = new Color('#000');
    return scene;
}

export default Scene;

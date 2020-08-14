import React, {useContext} from 'react';
import {Raycaster, Vector2} from "three";
import ViewportSceneContext from "../../context/ViewportSceneContext";


const fabricHOC = (WrappedComponent, canvas) => {
    const [state, dispatch] = useContext(ViewportSceneContext);
    let onClickPosition = new Vector2();

    state.getData.container.addEventListener("mousedown", onMouseEvt, false);

    const onMouseEvt = (evt) => {
        evt.preventDefault();
        const positionOnScene = getPositionOnScene(state.getData.container, evt)
        if (positionOnScene) {
            const canvasRect = canvas._offset;
            const simEvt = new MouseEvent(evt.type, {
                clientX: canvasRect.left + positionOnScene.x,
                clientY: canvasRect.top + positionOnScene.y
            });
            canvas.upperCanvasEl.dispatchEvent(simEvt);
        }
    }

    const getPositionOnScene = (sceneContainer, evt) => {
        let array = getMousePosition(state.getData.container, evt.clientX, evt.clientY);
        onClickPosition.fromArray(array);
        let intersects = getIntersects(onClickPosition, state.getData.scene.children);
        if (intersects.length > 0 && intersects[0].uv) {
            let uv = intersects[0].uv;
            intersects[0].object.material.map.transformUv(uv);
            return {
                x: getRealPosition('x', uv.x),
                y: getRealPosition('y', uv.y)
            }
        }
        return null;
    }

    const getRealPosition = (axis, value) => {
        let CORRECTION_VALUE = axis === "x" ? 0 : 0;
        return Math.round(value * 512) - CORRECTION_VALUE;
    }

    const getMousePosition = (dom, x, y) => {
        let rect = dom.getBoundingClientRect();
        return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
    };

    const getIntersects = (point, objects) => {
        const mouse = new Vector2()
        const raycaster = new Raycaster();
        mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);
        raycaster.setFromCamera(mouse, state.getData.camera);
        return raycaster.intersectObjects(objects);
    };

    const hocComponent = ({ ...props }) => {
        return <WrappedComponent {...props}
                                 container={state.getData.container}
                                 getPositionOnScene={this.getPositionOnScene} />;
    }

};

export default fabricHOC;
import { Vector2, Raycaster } from 'three';

import { fabric } from 'fabric';

class FabricExtend extends fabric.Canvas {
    constructor(...args) {
        super(...args)
    }

    static currentObject = null;

    getPointer(e, ignoreZoom) {
        if (this._absolutePointer && !ignoreZoom) {
            return this._absolutePointer;
        }
        if (this._pointer && ignoreZoom) {
            return this._pointer;
        }
        var pointer = fabric.util.getPointer(e),
            upperCanvasEl = this.upperCanvasEl,
            bounds = upperCanvasEl.getBoundingClientRect(),
            boundsWidth = bounds.width || 0,
            boundsHeight = bounds.height || 0,
            cssScale;

        if (!boundsWidth || !boundsHeight) {
            if ('top' in bounds && 'bottom' in bounds) {
                boundsHeight = Math.abs(bounds.top - bounds.bottom);
            }
            if ('right' in bounds && 'left' in bounds) {
                boundsWidth = Math.abs(bounds.right - bounds.left);
            }
        }
        this.calcOffset();
        pointer.x = pointer.x - this._offset.left;
        pointer.y = pointer.y - this._offset.top;
        /* BEGIN PATCH CODE */
        if (e.target !== this.upperCanvasEl) {
            var positionOnScene = this.getPositionOnScene(this.container, e);

            /* var obj = canvas.getActiveObject();
      console.log(obj.left + "," + obj.top);*/
            if (positionOnScene) {
                pointer.x = positionOnScene.x;
                pointer.y = positionOnScene.y;
            }
        }
        /* END PATCH CODE */
        if (!ignoreZoom) {
            pointer = this.restorePointerVpt(pointer);
        }
        // var retinaScaling = this.getRetinaScaling();
        // if (retinaScaling !== 1) {
        //     pointer.x /= retinaScaling;
        //     pointer.y /= retinaScaling;
        // }
        if (boundsWidth === 0 || boundsHeight === 0) {
            cssScale = {
                width: 1,
                height: 1
            };
        } else {
            cssScale = {
                width: upperCanvasEl.width / boundsWidth,
                height: upperCanvasEl.height / boundsHeight
            };
        }

        return {
            x: pointer.x * cssScale.width,
            y: pointer.y * cssScale.height
        };
    }

    defineProps = (container, scene, camera) => {
        this.container = container;
        this.scene = scene;
        this.camera = camera;

        //this.on('after:render', this._afterRender())
    }

    addRaycaster = () => {
        this.container.addEventListener("mousedown", this.onMouseEvt, false);
    }
    removeRaycaster = () => {
        this.container.removeEventListener("mousedown", this.onMouseEvt, false);
    }

    updateCacheMap = (map) => {
        this.cacheMap = map;
    }

    drawCopyOnCanvas = (canvasEl) => {
        // save values
        const originalInteractive = this.interactive

        // reset

        this.interactive = false;

        // draw on copy
        this.renderCanvas(canvasEl.getContext('2d'), this._objects);

        this.interactive = originalInteractive;
    }

    _afterRender() {
        if (!this.cacheMap) return;
        // remove 'after:render' listener as canvas.toCanvasElement()
        // calls renderCanvas(), which results in an infinite recursion
        this.off('after:render', this._afterRender);

        // draw c1 contents on c2
        this.drawCopyOnCanvas(this.cacheMap);

        setTimeout(() => {
            // re-attach the listener in the next event loop
            this.on('after:render', this._afterRender);
        });
    }

    getPositionOnScene = (container, evt) => {
        const array = this.getMousePosition(container, evt.clientX, evt.clientY);
        const onClickPosition = new Vector2();
        onClickPosition.fromArray(array);
        var intersects = this.getIntersects(onClickPosition, this.scene.children, this.camera);

        if (intersects.length > 0 && intersects[0].uv) {

            FabricExtend.currentObject = intersects[0].object;

            this.scene.traverse((child) => {
                if(!child.isObject3D ) return;
                console.log(child);
            })

            console.log(FabricExtend.currentObject)

            if (!intersects[0].object.material.map) return;
            const uv = intersects[0].uv;
            intersects[0].object.material.map.transformUv(uv);
            return {
                x: this.getRealPosition('x', uv.x),
                y: this.getRealPosition('y', uv.y)
            }
        }
        return null;
    }

    getRealPosition = (axis, value) => {
        let CORRECTION_VALUE = axis === "x" ? 0 : 0;
        return Math.round(value * 512) - CORRECTION_VALUE;
    }

    getMousePosition = (dom, x, y) => {
        var rect = dom.getBoundingClientRect();
        return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
    }

    getIntersects = (point, objects, camera) => {
        const mouse = new Vector2()
        const raycaster = new Raycaster();
        mouse.set(point.x * 2 - 1, - (point.y * 2) + 1);
        raycaster.setFromCamera(mouse, camera);
        return raycaster.intersectObjects(objects, true);
    }

    onMouseEvt = (evt) => {
        evt.preventDefault();
        const positionOnScene = this.getPositionOnScene(this.container, evt)

        if (positionOnScene) {
            const canvasRect = this._offset;
            const simEvt = new MouseEvent(evt.type, {
                clientX: canvasRect.left + positionOnScene.x,
                clientY: canvasRect.top + positionOnScene.y
            });
            this.upperCanvasEl.dispatchEvent(simEvt);
        }
    }
}

fabric.Object.prototype.originX = 'center';
fabric.Object.prototype.originY = 'center';

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.borderScaleFactor = 2;
fabric.Object.prototype.borderColor = "#38ADFC";
fabric.Object.prototype.cornerColor = "#ffffff";
fabric.Object.prototype.cornerStrokeColor = "#38ADFC";
fabric.Object.prototype.borderOpacityWhenMoving = 1;


fabric.Object.prototype.rotatingPointOffset = 70;
fabric.Object.prototype.cornerStyle = "circle";
fabric.Object.prototype.cornerSize = 20;

fabric.textureSize = 1024;

fabric.Object.prototype.noScaleCache = false;
fabric.Object.prototype.objectCaching = false;

fabric.Object.prototype._drawControl = function (
    control,
    ctx,
    methodName,
    left,
    top,
    styleOverride
) {
    styleOverride = styleOverride || {};
    if (!this.isControlVisible(control)) {
        return;
    }
    let size = this.cornerSize,
        stroke = !this.transparentCorners && this.cornerStrokeColor;
    switch (styleOverride.cornerStyle || this.cornerStyle) {
        case "circle":
            if (control == this.__corner) {
                ctx.save();
                ctx.strokeStyle = ctx.fillStyle = "#007bff";
            }
            ctx.beginPath();
            ctx.arc(left + size / 2, top + size / 2, size / 2, 0, 2 * Math.PI, false);
            ctx[methodName]();
            if (stroke) {
                ctx.stroke();
            }
            if (control == this.__corner) {
                ctx.restore();
            }
            break;
        default:
            this.transparentCorners || ctx.clearRect(left, top, size, size);
            ctx[methodName + "Rect"](left, top, size, size);
            if (stroke) {
                ctx.strokeRect(left, top, size, size);
            }
    }
};

export default FabricExtend;

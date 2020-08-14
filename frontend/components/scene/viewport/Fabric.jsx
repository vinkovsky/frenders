import React from 'react';

import { fabric } from 'fabric';

const Fabric = ({container, getPositionOnScene}) => {

    fabric.Canvas.prototype.getPointer = function(e, ignoreZoom) {
        if (this._absolutePointer && !ignoreZoom) {
            return this._absolutePointer;
        }
        if (this._pointer && ignoreZoom) {
            return this._pointer;
        }
        let pointer = fabric.util.getPointer(e),
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

        if (e.target !== this.upperCanvasEl) {
            let positionOnScene = getPositionOnScene(container, e);

            if (positionOnScene) {
                pointer.x = positionOnScene.x;
                pointer.y = positionOnScene.y;
            }
        }

        if (!ignoreZoom) {
            pointer = this.restorePointerVpt(pointer);
        }

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

    return null;
}

export default Fabric;
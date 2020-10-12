import React, {useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import { fabric } from 'fabric';

import {Raycaster, Vector2} from "three";
import {useRouter} from "next/router";
import {Save, CloudUpload} from '@material-ui/icons';
import { Button } from "@material-ui/core";
import gql from "graphql-tag";
import axios from 'axios';
import {useMutation, useQuery} from "@apollo/react-hooks";
import ModelsQuery from "../../../graphql/queries/dashboard/models";
import useFabric from "./useFabric";
import styles from './Uvw.module.sass'
import TextureTabs from './TextureTabs'
import ViewportSceneContext from "../../../context/ViewportSceneContext";
import {history} from './history'


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const ModelsUvwQuery = gql`
    query ModelUvw($id: ID!) {
        model(id: $id) {
            map
            roughnessMap
            metalnessMap
            normalMap
        }
    }
`;

const AssetsUvQuery = gql`
    query ModelUv($id: ID!) {
        asset(id: $id) {
            uv {
                url
            }
        }
    }
`;


const ModelsMutationQuery = gql`
    mutation updateModelJSON(
        $id: ID!

        $roughnessMap: JSON!
        $metalnessMap: JSON!
        $normalMap: JSON!
        $map: JSON!
    ){
        updateModel(
            input: {
                where: { id: $id }
                data: {

                    roughnessMap: $roughnessMap
                    metalnessMap: $metalnessMap
                    normalMap: $normalMap
                    map: $map
                }
            }
        ) {
            model {
                roughnessMap
                metalnessMap
                normalMap
                map
            }
        }
    }
`;

let activeMap = 'map';
let dataMap = {
    map: [],
    roughnessMap: [],
    metalnessMap: [],
    normalMap: []
}

const Uvw = () => {
    const router = useRouter();
    const [state, dispatch] = useContext(ViewportSceneContext);
    const itemsRef = useRef([]);
    const uvwRef = useRef();
    const drawingRef = useRef();
    const containerRef = useRef()
    const width = 512, height = 512;
    const [value, setValue] = useState(0);
    const [activeObject, setActiveObject] = useState(null);
    const activeCanvasRef = useRef();
    const activeContextCanvasRef = useRef();
    const [readyUv, setReadyUv] = useState(false)
    const isDrawingRef = useRef(false);
    const zoomRef = useRef(1);
    const lastPosXref = useRef();
    const lastPosYref = useRef();
    const cssScaleRef = useRef({});
    const clipboardRef = useRef(null);
    let index = 0;

    const TEXTURES_DATA = [
        {
            name: 'map',
            id: '1',
        },
        {
            name: 'roughnessMap',
            id: '2',
        },
        {
            name: 'metalnessMap',
            id: '3',
        },
        {
            name: 'normalMap',
            id: '4',
        }
    ];
    const { data, loading, error, refetch } = useQuery(ModelsUvwQuery, {
        variables: {
            id: router.query.id
        }
    });

    const { data: dataUv, loading: loadingUv } = useQuery(AssetsUvQuery, {
        variables: {
            id: "5f51d8e1a3a8dc0088d1d06c"
        }
    });

    const [updateModelJSON, {loading: mutationLoading}] = useMutation(ModelsMutationQuery, {
        errorPolicy: "all"
    });

    if (data === undefined) refetch();

    useEffect(() => {
        if (data === undefined) return;
        itemsRef.current = [...itemsRef.current];

        dispatch({
            type: 'getCanvas',
            payload: {
                canvas: uvwRef.current,
                maps: itemsRef.current
            }
        });
    }, [data])

    const updateStateMap = (map) => {
        // if (activeMap === map) return;

        dataMap[map] = [];

        // uvwRef.current._objects.map((item, index) => {
        //     item.id = (index).toString();
        // })

        dataMap[map].push(JSON.stringify(uvwRef.current.toJSON()));

    }
    useEffect(() => {
        if (!(data && uvwRef.current && dataUv?.asset)) return;

        function loadMap(entries, index) {
            --index;
            const isset = entries[index][1][0] ? entries[index][1][0] : JSON.stringify(uvwRef.current.toJSON())
            //uvwRef.current.offHistory();
            uvwRef.current.loadFromJSON(isset, () => {
                dataMap[entries[index][0]].push(isset)

                updateBackground(entries[index][0], uvwRef.current)

                const canvas = itemsRef.current.find((canvas) => canvas.id === entries[index][0]);

                drawCopyOnCanvas(canvas)
                //  uvwRef.current.onHistory();
                if(index > 0) {
                    return loadMap(Object.entries(data.model), index)
                } else {
                    uvwRef.current._historyInit()
                    return null;
                }
            });
        }

        fabric.loadSVGFromURL(dataUv.asset.uv.url, (objects, options) => {
            const svg = fabric.util.groupSVGElements(objects, options);
            // uvwRef.current.offHistory();
            svg.left = svg.width / 4;
            svg.top = svg.height / 4;

            svg.selectable = false;
            svg.evented = true

            svg.scaleToWidth(uvwRef.current.width);
            svg.scaleToHeight(uvwRef.current.height);
            svg.excludeFromExport = true;

            loadMap(Object.entries(data.model), Object.entries(data.model).length - 1);

            uvwRef.current.setOverlayImage(svg, () => {
                uvwRef.current.renderAll()
                // uvwRef.current._historyInit()
                // uvwRef.current.onHistory();
            })

        });

        setReadyUv(true)
    }, [data, uvwRef.current, dataUv])

    function updateBackground(map, canvas) {
        if (map === 'normalMap' && canvas.backgroundColor !== "#8080FF") {
            canvas.backgroundColor = "#8080FF";
        } else if (canvas.backgroundColor !== "#FFFFFF") {
            canvas.backgroundColor = "#FFFFFF";
        }
        canvas.renderAll()
    }

    // useEffect(() => {
    //
    //     if (!(uvwRef.current && dataUv?.asset && readyUv)) return;
    //
    //     fabric.loadSVGFromURL(dataUv.asset.uv.url, (objects, options) => {
    //         const svg = fabric.util.groupSVGElements(objects, options);
    //
    //         svg.left = svg.width / 4;
    //         svg.top = svg.height / 4;
    //
    //         svg.selectable = false;
    //         svg.evented = true
    //
    //         svg.scaleToWidth(uvwRef.current.width);
    //         svg.scaleToHeight(uvwRef.current.height);
    //         // svg.excludeFromExport = true;
    //
    //         uvwRef.current.setOverlayImage(svg, uvwRef.current.renderAll.bind(uvwRef.current))
    //
    //     });
    // }, [uvwRef.current, dataUv, readyUv])

    // const uvwContainer = styles.container
    // const uvwOpts = {containerClass: uvwContainer}

    const uvwDomRef = useFabric((canvas) => {
        uvwRef.current = canvas;
        canvas.width = width;
        canvas.height = height;
        canvas.setWidth(width)
        canvas.setHeight(height)
        canvas.controlsAboveOverlay = true;
        canvas._historyNext = function () {
            return JSON.stringify(this.toDatalessJSON(this.extraProps));
        }

        /**
         * Returns an object with fabricjs event mappings
         */
        canvas._historyEvents = function() {
            return {
                'object:added': this._historySaveAction,
                'object:removed': this._historySaveAction,
                'object:modified': this._historySaveAction,
                'object:skewing': this._historySaveAction
            }
        }

        /**
         * Initialization of the plugin
         */
        canvas._historyInit = function () {
            this.historyUndo = [];
            this.historyRedo = [];
            this.extraProps = ['selectable'];
            this.historyNextState = this._historyNext();

            this.on(this._historyEvents());
        }

        /**
         * Remove the custom event listeners
         */
        canvas._historyDispose = function () {
            this.off(this._historyEvents())
        }

        /**
         * It pushes the state of the canvas into history stack
         */
        canvas._historySaveAction = function () {

            if (this.historyProcessing)
                return;

            const json = this.historyNextState;
            this.historyUndo.push(json);
            this.historyNextState = this._historyNext();
            this.fire('history:append', { json: json });
        }

        /**
         * Undo to latest history.
         * Pop the latest state of the history. Re-render.
         * Also, pushes into redo history.
         */
        canvas.undo = function (callback) {
            // The undo process will render the new states of the objects
            // Therefore, object:added and object:modified events will triggered again
            // To ignore those events, we are setting a flag.
            this.historyProcessing = true;

            const history = this.historyUndo.pop();
            if (history) {
                // Push the current state to the redo history
                this.historyRedo.push(this._historyNext());
                this.historyNextState = history;
                this._loadHistory(history, 'history:undo', callback);
            } else {
                this.historyProcessing = false;
            }

        }

        /**
         * Redo to latest undo history.
         */
        canvas.redo = function (callback) {
            // The undo process will render the new states of the objects
            // Therefore, object:added and object:modified events will triggered again
            // To ignore those events, we are setting a flag.
            this.historyProcessing = true;
            const history = this.historyRedo.pop();
            if (history) {
                // Every redo action is actually a new action to the undo history
                this.historyUndo.push(this._historyNext());
                this.historyNextState = history;
                this._loadHistory(history, 'history:redo', callback);
            } else {
                this.historyProcessing = false;
            }
        }

        canvas._loadHistory = function(history, event, callback) {
            var self = this;

            this.loadFromJSON(history, function() {
                self.renderAll();
                self.fire(event);
                self.historyProcessing = false;

                if (callback && typeof callback === 'function')
                    callback();
            });
        }

        /**
         * Clear undo and redo history stacks
         */
        canvas.clearHistory = function() {
            this.historyUndo = [];
            this.historyRedo = [];
            this.fire('history:clear');
        }

        /**
         * Off the history
         */
        canvas.offHistory = function() {
            this.historyProcessing = true;
        }

        /**
         * On the history
         */
        canvas.onHistory = function() {
            this.historyProcessing = false;

            this._historySaveAction();
        }


        // canvas.setDimensions({width: 512, height: 512})
    });

    const drawingDomRef = useFabric((canvas) => {
        drawingRef.current = canvas;
        canvas.width = width;
        canvas.height = height;
        canvas.setWidth(width)
        canvas.setHeight(height)

        // canvas.setDimensions({width: 512, height: 512})
    });

    useEffect(() => {
        if (!(drawingRef.current && uvwRef.current)) return;

        drawingRef.current.freeDrawingBrush.width = uvwRef.current.freeDrawingBrush.width;
        drawingRef.current.freeDrawingBrush.color = uvwRef.current.freeDrawingBrush.color;
        drawingRef.current.isDrawingMode = uvwRef.current.isDrawingMode;

    }, [uvwRef.current?.freeDrawingBrush.width, uvwRef.current?.freeDrawingBrush.color, uvwRef.current?.isDrawingMode])

    const drawCopyOnCanvas = (canvasEl, fabricCanvas) => {
        // save values

        const vp = uvwRef.current.viewportTransform,
            originalInteractive = uvwRef.current.interactive,
            newVp = [1, 0, 0, 1, 0, 0],
            originalRetina = uvwRef.current.enableRetinaScaling,
            originalContextTop = uvwRef.current.contextTop;
        // reset
        uvwRef.current.contextTop = null;
        uvwRef.current.enableRetinaScaling = false;
        uvwRef.current.interactive = false;
        uvwRef.current.viewportTransform = newVp;
        uvwRef.current.calcViewportBoundaries();
        // draw on copy
        uvwRef.current.renderCanvas(canvasEl.getContext('2d'), uvwRef.current._objects);
        // restore values
        uvwRef.current.viewportTransform = vp;
        uvwRef.current.calcViewportBoundaries();
        uvwRef.current.interactive = originalInteractive;
        uvwRef.current.enableRetinaScaling = originalRetina;
        uvwRef.current.contextTop = originalContextTop;
    }

    function _afterRender() {
        uvwRef.current.off('after:render', _afterRender);

        drawCopyOnCanvas(activeCanvasRef.current);
        setTimeout(() => {
            uvwRef.current.on('after:render', _afterRender);
        });
    }

    function copyThePencil(canvasEl) {

        const ctx = canvasEl.getContext('2d');
        if (uvwRef.current._isCurrentlyDrawing) {
            ctx.save();
            const m = fabric.util.invertTransform(drawingRef.current.viewportTransform);
            ctx.transform.apply(ctx, m);
            ctx.drawImage(drawingRef.current.upperCanvasEl, 0, 0,
                drawingRef.current.upperCanvasEl.width / drawingRef.current.getRetinaScaling(),
                drawingRef.current.upperCanvasEl.height / drawingRef.current.getRetinaScaling())
            ctx.restore();
        }
    }

    useEffect(() => {
        if(!(activeCanvasRef.current && uvwRef.current)) return;

        uvwRef.current.on('after:render', _afterRender);

        return () => {
            uvwRef.current.off('after:render', _afterRender);
        }
    }, [activeCanvasRef.current])

    const saveCanvasHandler = async () => {
        await updateModelJSON({
            variables: {
                id: router.query.id,
                roughnessMap: dataMap.roughnessMap,
                metalnessMap: dataMap.metalnessMap,
                normalMap: dataMap.normalMap,
                map: dataMap.map,
            }
        })
    }

    const onImageLoad = async (e) => {
        const formData = new FormData()
        formData.append('files', e.target.files[0] )

        // formData.append('ref', 'model')
        // formData.append('refId', router.query.id)
        // formData.append('field', itemsRef.current[value].id)


        const response = await axios({
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            url: `${API_URL}/upload`,
            data: formData
        })

        fabric.Image.fromURL(response.data[0].url, (img) => {
            img.set({
                originX: 'center',
                originY: 'center',
            })
            img.scaleToWidth(uvwRef.current.width);

            uvwRef.current.add(img);
            img.center();

            img.setCoords();
            dispatch({
                type: 'getCanvas',
                payload: {
                    canvas: uvwRef.current,
                    maps: itemsRef.current
                }
            });
            //setActiveObject(img)
            uvwRef.current.setActiveObject(img);
            updateStateMap(itemsRef.current[value].id)
            uvwRef.current.renderAll()
            //  drawCopyOnCanvas(activeCanvasRef.current);
        }, {
            crossOrigin: 'Anonymous'
        });
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const switchMap = (map/*, activeCanvas*/) => {

        if (dataMap[map][0]) {
            uvwRef.current.loadFromJSON(dataMap[map][0], () => {

                updateBackground(map, uvwRef.current)
                uvwRef.current.clearHistory()
                //
                // drawCopyOnCanvas(activeCanvas);
            });
        }

    }

    useEffect(() => {
        activeCanvasRef.current = itemsRef.current[value];
        switchMap(itemsRef.current[value].id/*, activeCanvasRef.current*/)
        dispatch({
            type: 'getCanvas',
            payload: {
                canvas: uvwRef.current,
                maps: itemsRef.current
            }
        });
    }, [value])

    useEffect(() => {
        const handleChange = () => {
            updateStateMap(itemsRef.current[value].id)
        }
        uvwRef.current.on('mouse:up', handleChange)
        return () => {
            uvwRef.current.off('mouse:up', handleChange)
        }
    }, [itemsRef.current[value]])

    useEffect(() => {
        if (!state.getCurrentObject || state.getData.model === null) return;
        state.getData.model.traverse((child) => {
            if (!child.isMesh) return;

            if(child.name === state.getCurrentObject.name) {
                setActiveObject(child);
            }

        });
    }, [state.getCurrentObject, state.getData])

    useEffect(() => {
        if (!activeObject) return;
        dispatch({
            type: 'getCurrentObject',
            payload: {
                name: activeObject.name,
                object: activeObject
            }
        })
    }, [activeObject])

    useEffect(() => {
        if (!uvwRef.current) return;

        uvwRef.current.on('mouse:wheel', (opt) => {
            const delta = opt.e.deltaY;
            zoomRef.current = uvwRef.current.getZoom();
            zoomRef.current += delta / 200;
            if (zoomRef.current > 20) zoomRef.current = 20;
            if (zoomRef.current < 1) zoomRef.current = 1;
            const ratio = width / uvwRef.current.wrapperEl.offsetWidth;
            uvwRef.current.zoomToPoint({ x: opt.e.offsetX * ratio, y: opt.e.offsetY * ratio }, zoomRef.current);
            if (zoomRef.current < 0.1) {
                uvwRef.current.viewportTransform[4] = uvwRef.current.getWidth() * zoomRef.current;
                uvwRef.current.viewportTransform[5] = uvwRef.current.getWidth() * zoomRef.current;
            } else {
                if (uvwRef.current.viewportTransform[4] >= 0) {
                    uvwRef.current.viewportTransform[4] = 0;
                } else if (uvwRef.current.viewportTransform[4] < uvwRef.current.getHeight() - uvwRef.current.getHeight() * zoomRef.current) {
                    uvwRef.current.viewportTransform[4] = uvwRef.current.getHeight() - uvwRef.current.getHeight() * zoomRef.current;
                }
                if (uvwRef.current.viewportTransform[5] >= 0) {
                    uvwRef.current.viewportTransform[5] = 0;
                } else if (uvwRef.current.viewportTransform[5] < uvwRef.current.getHeight() - uvwRef.current.getHeight() * zoomRef.current) {
                    uvwRef.current.viewportTransform[5] = uvwRef.current.getHeight() - uvwRef.current.getHeight() * zoomRef.current;
                }
            }
            uvwRef.current.requestRenderAll()
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });


        uvwRef.current.on('mouse:down', (opt) => {
            isDrawingRef.current = true;
            if (uvwRef.current.isDrawingMode) {
                const pointer = uvwRef.current.getPointer(opt.e);
                drawingRef.current.freeDrawingBrush.onMouseDown(pointer, opt);
            }

            const evt = opt.e;
            if (evt.altKey === true) {
                uvwRef.current.isDragging = true;
                uvwRef.current.selection = false;
                uvwRef.current.forEachObject((o) => {
                    o.selectable = false;
                    o.evented = false;
                    o.setCoords();
                });
                uvwRef.current._currentTransform = null
                lastPosXref.current = evt.clientX;
                lastPosYref.current = evt.clientY;
                uvwRef.current.discardActiveObject();

            }
            uvwRef.current.bringToFront(uvwRef.current.getActiveObject())
        });

        uvwRef.current.on('mouse:move', (opt) => {
            copyThePencil(activeCanvasRef.current)
            if (isDrawingRef.current && uvwRef.current.isDrawingMode) {
                const pointer = uvwRef.current.getPointer(opt.e);
                drawingRef.current.freeDrawingBrush.onMouseMove(pointer, opt);
            }

            if (uvwRef.current.isDragging) {
                const e = opt.e;
                if (zoomRef.current < 0.1) {
                    uvwRef.current.viewportTransform[4] = uvwRef.current.getWidth() * zoomRef.current;
                    uvwRef.current.viewportTransform[5] = uvwRef.current.getWidth() * zoomRef.current;
                } else {
                    uvwRef.current.viewportTransform[4] += e.clientX - lastPosXref.current;
                    uvwRef.current.viewportTransform[5] += e.clientY - lastPosYref.current;
                    if (uvwRef.current.viewportTransform[4] >= 0) {
                        uvwRef.current.viewportTransform[4] = 0;
                    } else if (uvwRef.current.viewportTransform[4] < uvwRef.current.getWidth() - uvwRef.current.getHeight() * zoomRef.current) {
                        uvwRef.current.viewportTransform[4] = uvwRef.current.getWidth() - uvwRef.current.getHeight() * zoomRef.current;
                    }
                    if (uvwRef.current.viewportTransform[5] >= 0) {
                        uvwRef.current.viewportTransform[5] = 0;
                    } else if (uvwRef.current.viewportTransform[5] < uvwRef.current.getHeight() - uvwRef.current.getHeight() * zoomRef.current) {
                        uvwRef.current.viewportTransform[5] = uvwRef.current.getHeight() - uvwRef.current.getHeight() * zoomRef.current;
                    }
                }

                uvwRef.current.requestRenderAll();
                lastPosXref.current = e.clientX;
                lastPosYref.current = e.clientY;
            }
        });

        uvwRef.current.on('mouse:up', (opt) => {
            isDrawingRef.current = false;
            if (uvwRef.current.isDrawingMode) {
                drawingRef.current.clear();
                drawingRef.current.freeDrawingBrush.onMouseUp(opt);
                uvwRef.current.requestRenderAll()
            }
            drawCopyOnCanvas(activeCanvasRef.current);
            uvwRef.current.requestRenderAll()
            uvwRef.current.isDragging = false;
            uvwRef.current.selection = true;
            uvwRef.current.forEachObject((o) => {
                o.selectable = true;
                o.evented = true;
                o.setCoords();
            });
        });

        // uvwRef.current.on("path:created", function (opt) {
        //     opt.path.id = fabric.Object.__uid++
        //     console.log(opt.path.id)
        // });

    }, [uvwRef.current])

    const keydown = useCallback((e) => {
        const { controls } = state.getData;
        if (!controls) return;
        if (e.key == 'Alt') {

            state.getData.controls[0].enabled = false;

        }
    }, [state.getData])

    const keyup = useCallback((e) => {
        const { controls } = state.getData;
        if (!controls) return;
        if (e.key == 'Alt') {

            state.getData.controls[0].enabled = true;

        }
    }, [state.getData])

    useLayoutEffect(() => {
        const { container } = state.getData;
        if (!container) return;
        state.getData.container.addEventListener('keydown', keydown);
        state.getData.container.addEventListener('keyup', keyup);

        return () => {
            state.getData.container.removeEventListener('keydown', keydown);
            state.getData.container.removeEventListener('keyup', keyup);
        }

    }, [state.getData])

    useLayoutEffect(() => {
        const { container, scene, camera } = state.getData;
        if (!(container && scene && camera)) return;

        let onClickPosition = new Vector2();
        let currentObject = null;
        let mouseOver = false;

        function getMousePosition (dom, x, y)  {
            let rect = dom.getBoundingClientRect();
            return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
        }

        let cssScaleCanvas = {};
        const getPositionOnScene = (sceneContainer, evt) => {
            let array = getMousePosition(sceneContainer, evt.clientX, evt.clientY);
            onClickPosition.fromArray(array);
            let intersects = getIntersects(onClickPosition, state.getData.scene.children[1].children[0].children);

            if (intersects.length > 0 && intersects[0].uv) {
                currentObject = intersects[0].object;
                let uv = intersects[0].uv;
                console.log(uv)
                if(uv.x === 0.0 || uv.x === 1.0 || uv.y === 0.0 || uv.y === 1.0) {
                    let evt = new MouseEvent("mouseup", {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    uvwRef.current.upperCanvasEl.dispatchEvent(evt);
                }
                if (intersects[0].object.material.map) intersects[0].object.material.map.transformUv(uv);

                const retinaScaling = uvwRef.current.getRetinaScaling()
                const { cssWidth = 1, cssHeight = 1} = cssScaleCanvas
                return {
                    x: (uv.x * width / cssWidth * zoomRef.current + uvwRef.current.viewportTransform[4]) * retinaScaling,
                    y: (uv.y * height / cssHeight * zoomRef.current + uvwRef.current.viewportTransform[5]) * retinaScaling
                }
            } else {
                currentObject = [];
            }
            return null;
        }

        uvwRef.current.upperCanvasEl.addEventListener('mouseover', () => {
            mouseOver = true;
        })

        const onMouseEvt = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if ( e.altKey ) {
                const positionOnScene = getPositionOnScene(state.getData.container, e)

                if (positionOnScene) {
                    mouseOver = false;
                    const canvasRect = uvwRef.current._offset;
                    const simEvt = new MouseEvent(e.type, {
                        clientX: canvasRect.left + positionOnScene.x,
                        clientY: canvasRect.top + positionOnScene.y
                    });
                    uvwRef.current.upperCanvasEl.dispatchEvent(simEvt);
                    setActiveObject(activeObject => currentObject);
                }
            }
        }

        function getIntersects (point, objects) {
            const mouse = new Vector2()
            const raycaster = new Raycaster();
            mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);
            raycaster.setFromCamera(mouse, state.getData.camera);
            return raycaster.intersectObjects(objects, true);
        }

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

            if (!ignoreZoom) {
                pointer = this.restorePointerVpt(pointer);
            }
            const retinaScaling = this.getRetinaScaling();
            if (e.target !== this.upperCanvasEl) {

                let positionOnScene = getPositionOnScene(container, e);

                if (positionOnScene) {
                    pointer.x = positionOnScene.x;
                    pointer.y = positionOnScene.y;

                } else if (!mouseOver) {
                    let evt = new MouseEvent("mouseup", {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    this.upperCanvasEl.dispatchEvent(evt);
                    console.log('Mouse on canvas:', mouseOver)
                } else {
                    console.log('Mouse on canvas:', mouseOver)

                }
            }

            if (retinaScaling !== 1) {
                pointer.x /= retinaScaling;
                pointer.y /= retinaScaling;
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

            cssScaleCanvas = {
                cssWidth: cssScale.width,
                cssHeight: cssScale.height
            }

            return {
                x: pointer.x * cssScale.width,
                y: pointer.y * cssScale.height
            };
        }

        const calcCssScale = () => {

        }

        state.getData.container.addEventListener("mousedown", onMouseEvt, false);

        return () => {
            state.getData.container.removeEventListener("mousedown", onMouseEvt, false);
        }

    }, [state.getData, activeObject])

    const _copy = () => {
        let active = uvwRef.current.getActiveObject()
        if (active) {
            active.clone((cloned) => {
                clipboardRef.current = cloned;
                cloned.set({
                    left: cloned.left + 10,
                    top: cloned.top + 10
                })
            });
        }
    }

    const _cut = () => {
        let active = uvwRef.current.getActiveObject()
        if (active) {
            active.clone((cloned) => {
                clipboardRef.current = cloned;
            });
        }
        _delete()
    }

    const _delete = () => {
        const activeObj = uvwRef.current.getActiveObjects()
        if (activeObj) {
            activeObj.forEach((object) => {
                uvwRef.current.remove(object);
            });
            uvwRef.current.discardActiveObject();

        }
        // uvwRef.current.setActiveObject(activeObj);
        setActiveObject(activeObj);
        uvwRef.current.requestRenderAll();
    }

    const _paste = () => {
        if (!clipboardRef.current) return;
        clipboardRef.current.clone((clonedObj) => {
            uvwRef.current.discardActiveObject();

            let matrix = clonedObj.calcTransformMatrix();
            let transforms = fabric.util.qrDecompose(matrix);
            clonedObj.set({
                angle: transforms.angle,
                skewX: transforms.skewX,
                skewY: transforms.skewY,
                scaleX: transforms.scaleX,
                scaleY: transforms.scaleY,
                top: transforms.translateY,
                left: transforms.translateX,
            });

            if (clonedObj.type === 'activeSelection') {
                clonedObj.canvas = this;
                clonedObj.forEachObject((obj) => {
                    uvwRef.current.add(obj);
                });
                clonedObj.setCoords();
            } else {
                uvwRef.current.add(clonedObj);
            }
            uvwRef.current.setActiveObject(clonedObj);
            setActiveObject(clonedObj);
            uvwRef.current.requestRenderAll();
        });
    }

    const actions = useCallback((e) => {
        // e.preventDefault();

        if (e.key === 'Delete') {
            _delete()
        }
        if (e.code === 'KeyV' && (e.ctrlKey || e.metaKey)) {
            _paste()
        }
        if (e.code === 'KeyC' && (e.ctrlKey || e.metaKey)) {
            _copy()
        }
        if (e.code === 'KeyX' && (e.ctrlKey || e.metaKey)) {
            _cut()
        }
        if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) {
            uvwRef.current.undo()
            updateStateMap(itemsRef.current[value].id)
            // drawCopyOnCanvas(activeCanvasRef.current);
            dispatch({
                type: 'getCanvas',
                payload: {
                    canvas: uvwRef.current,
                    maps: itemsRef.current
                }
            });
        }
        if (e.code === 'KeyY' && (e.ctrlKey || e.metaKey)) {
            uvwRef.current.redo()
            updateStateMap(itemsRef.current[value].id)
            //  drawCopyOnCanvas(activeCanvasRef.current);
            dispatch({
                type: 'getCanvas',
                payload: {
                    canvas: uvwRef.current,
                    maps: itemsRef.current
                }
            });
        }
    }, [value]);

    useEffect(() => {

        if (!uvwRef.current) return

        document.addEventListener('keydown', actions, false)

        return () => {
            document.removeEventListener('keydown', actions, false);
        }
    }, [uvwRef.current, value])


    fabric.Object.prototype.originX = 'center';
    fabric.Object.prototype.originY = 'center';

    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.borderScaleFactor = 2;
    fabric.Object.prototype.borderColor = "#38ADFC";
    fabric.Object.prototype.cornerColor = "#ffffff";
    fabric.Object.prototype.cornerStrokeColor = "#38ADFC";
    fabric.Object.prototype.borderOpacityWhenMoving = 1;

    fabric.textureSize = 8192;

    fabric.Object.prototype.rotatingPointOffset = 70;
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.cornerSize = 20;

    fabric.Object.prototype.noScaleCache = false;
    fabric.Object.prototype.objectCaching = false;

    fabric.Canvas.prototype.loadFromJSON = function (json, callback, reviver) {
        if (!json) {
            return;
        }
        // serialize if it wasn't already
        var serialized = (typeof json === 'string')
            ? JSON.parse(json)
            : fabric.util.object.clone(json);
        var _this = this,
            clipPath = serialized.clipPath,
            renderOnAddRemove = this.renderOnAddRemove;
        this.renderOnAddRemove = false;
        delete serialized.clipPath;
        this._enlivenObjects(serialized.objects, function (enlivenedObjects) {
            // _this.clear();
            _this.remove(..._this.getObjects().concat())
            _this._setBgOverlay(serialized, function () {
                if (clipPath) {
                    _this._enlivenObjects([clipPath], function (enlivenedCanvasClip) {
                        _this.clipPath = enlivenedCanvasClip[0];
                        _this.__setupCanvas.call(_this, serialized, enlivenedObjects, renderOnAddRemove, callback);
                    });
                }
                else {
                    _this.__setupCanvas.call(_this, serialized, enlivenedObjects, renderOnAddRemove, callback);
                }
            });
        }, reviver);
        return this;
    }

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

    return (
        <div className={styles.uvw}>
            <Button variant="contained" component="label"
                    style={{ position: 'absolute', top: 0, right: 0, zIndex: 100, width: '47px', height: '47px', borderRadius: 0 }}
                    color="primary">
                <CloudUpload />
                <input
                    type="file"
                    name="files"
                    accept='image/*'
                    style={{ display: "none" }}
                    onChange={onImageLoad}
                />
            </Button>
            <Button variant="contained" component="label" onClick={saveCanvasHandler}
                    style={{ position: 'absolute', top: 0, right: 65, zIndex: 100, width: '47px', height: '47px', borderRadius: 0 }}
                    color="primary">
                <Save />
            </Button>
            <div ref={containerRef} className={styles.containerRef}>
                <canvas ref={uvwDomRef} id="uvw" style={{border: '1px solid gray'}}/>
                <canvas ref={drawingDomRef} id="drawing" />
            </div>

            <TextureTabs handleChange={handleChange} value={value}/>

            <div>
                {
                    TEXTURES_DATA.map((item, i) => {
                        return <canvas key={i} id={item.name} className={ styles.none }
                                       width={width} height={height} ref={el => itemsRef.current[i] = el} />
                    })
                }
            </div>
        </div>
    );
}

export default React.memo(Uvw);


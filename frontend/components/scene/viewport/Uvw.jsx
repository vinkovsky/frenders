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
        // canvas.on('after:render', canvas._afterRender());

    }, [data])



    const updateStateMap = (map) => {
        // if (activeMap === map) return;

        dataMap[map] = [];
        dataMap[map].push(JSON.stringify(uvwRef.current.toJSON()));

    }
    useEffect(() => {
        if (!(data && uvwRef.current && dataUv?.asset)) return;

        function loadMap(entries, index) {
            --index;
            const isset = entries[index][1][0] ? entries[index][1][0] : JSON.stringify(uvwRef.current.toJSON())


            uvwRef.current.loadFromJSON(isset, () => {
                dataMap[entries[index][0]].push(isset)

                updateBackground(entries[index][0], uvwRef.current)

                const canvas = itemsRef.current.find((canvas) => canvas.id === entries[index][0]);

                drawCopyOnCanvas(canvas)

                if(index > 0) {
                    return loadMap(Object.entries(data.model), index)
                } else {
                    return null;
                }
            });
        }

        fabric.loadSVGFromURL(dataUv.asset.uv.url, (objects, options) => {
            const svg = fabric.util.groupSVGElements(objects, options);

            svg.left = svg.width / 4;
            svg.top = svg.height / 4;

            svg.selectable = false;
            svg.evented = true

            svg.scaleToWidth(uvwRef.current.width);
            svg.scaleToHeight(uvwRef.current.height);
            svg.excludeFromExport = true;

            loadMap(Object.entries(data.model), Object.entries(data.model).length - 1)
            uvwRef.current.setOverlayImage(svg, () => {

                uvwRef.current.renderAll()
                console.log(JSON.stringify(uvwRef.current.toJSON()))
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

    const uvwContainer = styles.container
    const uvwOpts = {containerClass: uvwContainer}

    const uvwDomRef = useFabric((canvas) => {
        uvwRef.current = canvas;
        canvas.width = width;
        canvas.height = height;
        canvas.setWidth(width)
        canvas.setHeight(height)
        canvas.controlsAboveOverlay = true;
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

        drawingRef.current.freeDrawingBrush.width = uvwRef.current.freeDrawingBrush.width
        drawingRef.current.freeDrawingBrush.color = uvwRef.current.freeDrawingBrush.color
        drawingRef.current.isDrawingMode = uvwRef.current.isDrawingMode

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
            updateStateMap(itemsRef.current[value].id)
            uvwRef.current.renderAll()

        }, {
            crossOrigin: 'Anonymous'
        });
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const switchMap = (map, activeCanvas) => {

        if (dataMap[map][0]) {
            uvwRef.current.loadFromJSON(dataMap[map][0], () => {

                updateBackground(map, uvwRef.current)
                //
                // drawCopyOnCanvas(activeCanvas);
            });
        }

    }

    useEffect(() => {
        activeCanvasRef.current = itemsRef.current[value];
        switchMap(itemsRef.current[value].id, activeCanvasRef.current)

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
    }, [uvwRef.current])

    useEffect(() => {
        const { container, scene, camera } = state.getData;
        if (!(container && scene && camera)) return;

        let onClickPosition = new Vector2();
        let currentObject = null;
        state.getData.container.addEventListener('keydown', (e) => {
            e.preventDefault()
            if (e.key == 'Alt') {
                state.getData.controls[0].enabled = false;
            }
        });
        state.getData.container.addEventListener('keyup', (e) => {
            e.preventDefault()
            if (e.key == 'Alt') {
                state.getData.controls[0].enabled = true;
            }
        });

        const onMouseEvt = (e) => {
            e.preventDefault();

            if ( !state.getData.controls[0].enabled ) {
                const positionOnScene = getPositionOnScene(state.getData.container, e)
                if (positionOnScene) {
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


        let cssScaleCanvas = {};
        const getPositionOnScene = (sceneContainer, evt) => {
            let array = getMousePosition(sceneContainer, evt.clientX, evt.clientY);
            onClickPosition.fromArray(array);
            let intersects = getIntersects(onClickPosition, state.getData.scene.children[1].children[0].children);

            if (intersects.length > 0 && intersects[0].uv) {
                currentObject = intersects[0].object;
                let uv = intersects[0].uv;
                if (intersects[0].object.material.map) intersects[0].object.material.map.transformUv(uv);

                const retinaScaling = uvwRef.current.getRetinaScaling()
                //const retinaScaling = window.devicePixelRatio
                const { cssWidth = 1, cssHeight = 1} = cssScaleCanvas

                // console.log(
                //     'uv.x: ', uv.x,
                //     '\n',
                //     'retina: ', window.devicePixelRatio,
                //     '\n',
                //     'cssWidth: ', cssWidth,
                //     '\n',
                //     'canvasWidth: ', width,
                //     '\n',
                //     'zoom: ', zoomRef.current,
                //     '\n',
                //     'viewportTransform: ', canvasRef.current.viewportTransform[4],
                //     '\n',
                //     'cssWidth: ', cssWidth
                // )
                //console.log(uv.x * width / cssWidth * retinaScaling - (canvasRef.current.viewportTransform[4] / (zoomRef.current * retinaScaling * cssWidth)))
                return {
                    x: (uv.x * width / cssWidth * zoomRef.current + uvwRef.current.viewportTransform[4]) * retinaScaling,
                    y: (uv.y * height / cssHeight * zoomRef.current + uvwRef.current.viewportTransform[5]) * retinaScaling
                    // x: uv.x * width / cssWidth * retinaScaling ,
                    // y: uv.y * height / cssHeight * retinaScaling
                }
            } else {
                currentObject = [];
            }
            return null;
        }

        function getMousePosition (dom, x, y)  {
            let rect = dom.getBoundingClientRect();
            return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
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
        <div>
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
            <div ref={containerRef} style={{ padding: '30px', display: 'flex', justifyContent: 'center' }}>
                <canvas ref={uvwDomRef} id="uvw" style={{border: '1px solid gray'}}/>
                <canvas ref={drawingDomRef} id="drawing" style={{border: '1px solid gray', display: 'none'}}/>
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


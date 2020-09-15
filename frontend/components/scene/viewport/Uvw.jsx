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
    const canvasRef = useRef();
    const containerRef = useRef()
    const width = 512, height = 512;
    const [value, setValue] = useState(0);
    const [activeObject, setActiveObject] = useState(null);
    const activeCanvasRef = useRef();
    const activeContextCanvasRef = useRef();
    const [readyUv, setReadyUv] = useState(false)

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
                canvas: canvasRef.current,
                maps: itemsRef.current
            }
        });
        // canvas.on('after:render', canvas._afterRender());

    }, [data])



    const updateStateMap = (map) => {
        // if (activeMap === map) return;

        dataMap[map] = [];
        dataMap[map].push(JSON.stringify(canvasRef.current.toJSON()));

    }
    useEffect(() => {
        if (!data) return;

        Object.entries(data.model).reverse().map((item) => {
            if (item[0] == '__typename') return;

            dataMap[item[0]].push(item[1][0])
            let i = 0;
            if (item[0] == activeMap) {
                canvasRef.current.loadFromJSON(item[1][0],canvasRef.current.renderAll.bind(canvasRef.current), (obj, o) => {
                    o.id = i
                    i++;
                } );

            }

            const sourceCtx = canvasRef.current.getContext('2d');
            const canvas = itemsRef.current.find((canvas) => canvas.id == item[0]);

            const myImageData = sourceCtx.getImageData(0, 0, width, height);
            canvas.getContext('2d').putImageData(myImageData, 0, 0);

        })
        console.log(1)
        setReadyUv(true)
    }, [data])

    const drawCopyOnCanvas = (canvasEl, canvas) => {
        // save values
        const vp = canvas.viewportTransform,
            originalInteractive = canvas.interactive,
            newVp = [1, 0, 0, 1, 0, 0],
            originalRetina = canvas.enableRetinaScaling,
            originalContextTop = canvas.contextTop;
        // reset
        canvas.contextTop = null;
        canvas.enableRetinaScaling = false;
        canvas.interactive = false;
        canvas.viewportTransform = newVp;
        canvas.calcViewportBoundaries();
        // draw on copy
        canvas.renderCanvas(canvasEl.getContext('2d'), canvas._objects);
        // restore values
        canvas.viewportTransform = vp;
        canvas.calcViewportBoundaries();
        canvas.interactive = originalInteractive;
        canvas.enableRetinaScaling = originalRetina;
        canvas.contextTop = originalContextTop;
    }

    useEffect(() => {

        if (!(canvasRef.current && dataUv?.asset && readyUv)) return;

        fabric.loadSVGFromURL(dataUv.asset.uv.url, (objects, options) => {
            const svg = fabric.util.groupSVGElements(objects, options);

            svg.left = svg.width / 4;
            svg.top = svg.height / 4;

            svg.selectable = false;
            svg.evented = true

            svg.scaleToWidth(canvasRef.current.width);
            svg.scaleToHeight(canvasRef.current.height);
           // svg.excludeFromExport = true;

            canvasRef.current.setOverlayImage(svg, canvasRef.current.renderAll.bind(canvasRef.current))

        });
    }, [canvasRef.current, dataUv, readyUv])

    const ref = useFabric((canvas) => {
        canvasRef.current = canvas;
        // canvas.on({"after:render": function(e) {
        //     const sourceCtx = canvas.getContext('2d');
        //     const activeContextCanvasRef = activeCanvasRef.current.getContext('2d');
        //     const myImageData = sourceCtx.getImageData(0, 0, 512, 512);
        //     activeContextCanvasRef.putImageData(myImageData, 0, 0);
        // }});

        canvas.containerClass = styles.container
        console.log(styles.container)

            //  canvas.isDrawingMode = true;
        canvas.width = width;
        canvas.height = height;
        canvas.setWidth(width)
        canvas.setHeight(height)
       // canvas.setDimensions({width: 512, height: 512})
    });
    function _afterRender() {
        canvasRef.current.off('after:render', _afterRender);
        drawCopyOnCanvas(activeCanvasRef.current, canvasRef.current);
        setTimeout(() => {
            canvasRef.current.on('after:render', _afterRender);
        });
        console.log(2312)
    }
    useEffect(() => {
        if(!(activeCanvasRef.current && canvasRef.current)) return;

        canvasRef.current.on('after:render', _afterRender);

        return () => {
            canvasRef.current.off('after:render', _afterRender);
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
            img.scaleToWidth(canvasRef.current.width);

            canvasRef.current.add(img);
            img.center();

            img.setCoords();
            updateStateMap(itemsRef.current[value].id)
            canvasRef.current.renderAll()

        }, {
            crossOrigin: 'Anonymous'
        });
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const switchMap = (map) => {
        if (activeMap !== map) canvasRef.current.remove(...canvasRef.current.getObjects().concat());
        if (dataMap[map][0]) {
            canvasRef.current.loadFromDatalessJSON(dataMap[map][0], canvasRef.current.renderAll.bind(canvasRef.current));
        }

        if (map === 'normalMap') {
            canvasRef.current.backgroundColor = "#8080FF";
        } else {
            canvasRef.current.backgroundColor = "#FFFFFF";
        }
        canvasRef.current.renderAll();
        activeMap = map;
    }

    useEffect(() => {
        activeCanvasRef.current = itemsRef.current[value];
        switchMap(itemsRef.current[value].id)

    }, [value])

    useEffect(() => {
        const handleChange = () => {
            updateStateMap(itemsRef.current[value].id)
        }
        canvasRef.current.on('mouse:up', handleChange)
        return () => {
            canvasRef.current.off('mouse:up', handleChange)
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
        if (!canvasRef.current) return;
        canvasRef.current.on('mouse:wheel', (opt) => {
            const delta = opt.e.deltaY;
            zoomRef.current = canvasRef.current.getZoom();
            zoomRef.current += delta / 200;
            if (zoomRef.current > 20) zoomRef.current = 20;
            if (zoomRef.current < 1) zoomRef.current = 1;
            const ratio = width / canvasRef.current.wrapperEl.offsetWidth;
            canvasRef.current.zoomToPoint({ x: opt.e.offsetX * ratio, y: opt.e.offsetY * ratio }, zoomRef.current);
            if (zoomRef.current < 0.1) {
                canvasRef.current.viewportTransform[4] = canvasRef.current.getWidth() * zoomRef.current;
                canvasRef.current.viewportTransform[5] = canvasRef.current.getWidth() * zoomRef.current;
            } else {
                if (canvasRef.current.viewportTransform[4] >= 0) {
                    canvasRef.current.viewportTransform[4] = 0;
                } else if (canvasRef.current.viewportTransform[4] < canvasRef.current.getHeight() - canvasRef.current.getHeight() * zoomRef.current) {
                    canvasRef.current.viewportTransform[4] = canvasRef.current.getHeight() - canvasRef.current.getHeight() * zoomRef.current;
                }
                if (canvasRef.current.viewportTransform[5] >= 0) {
                    canvasRef.current.viewportTransform[5] = 0;
                } else if (canvasRef.current.viewportTransform[5] < canvasRef.current.getHeight() - canvasRef.current.getHeight() * zoomRef.current) {
                    canvasRef.current.viewportTransform[5] = canvasRef.current.getHeight() - canvasRef.current.getHeight() * zoomRef.current;
                }
            }
            canvasRef.current.requestRenderAll()
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });

        canvasRef.current.on('mouse:down', (opt) => {

            const evt = opt.e;
            if (evt.altKey === true) {
                canvasRef.current.isDragging = true;
                canvasRef.current.selection = false;
                canvasRef.current.forEachObject((o) => {
                    o.selectable = false;
                    o.evented = false;
                    o.setCoords();
                });
                canvasRef.current._currentTransform = null
                lastPosXref.current = evt.clientX;
                lastPosYref.current = evt.clientY;
                canvasRef.current.discardActiveObject();
            }
            canvasRef.current.bringToFront(canvasRef.current.getActiveObject())
        });

        canvasRef.current.on('mouse:move', (opt) => {

            if (canvasRef.current.isDragging) {
                const e = opt.e;
                if (zoomRef.current < 0.1) {
                    canvasRef.current.viewportTransform[4] = canvasRef.current.getWidth() * zoomRef.current;
                    canvasRef.current.viewportTransform[5] = canvasRef.current.getWidth() * zoomRef.current;
                } else {
                    canvasRef.current.viewportTransform[4] += e.clientX - lastPosXref.current;
                    canvasRef.current.viewportTransform[5] += e.clientY - lastPosYref.current;
                    if (canvasRef.current.viewportTransform[4] >= 0) {
                        canvasRef.current.viewportTransform[4] = 0;
                    } else if (canvasRef.current.viewportTransform[4] < canvasRef.current.getWidth() - canvasRef.current.getHeight() * zoomRef.current) {
                        canvasRef.current.viewportTransform[4] = canvasRef.current.getWidth() - canvasRef.current.getHeight() * zoomRef.current;
                    }
                    if (canvasRef.current.viewportTransform[5] >= 0) {
                        canvasRef.current.viewportTransform[5] = 0;
                    } else if (canvasRef.current.viewportTransform[5] < canvasRef.current.getHeight() - canvasRef.current.getHeight() * zoomRef.current) {
                        canvasRef.current.viewportTransform[5] = canvasRef.current.getHeight() - canvasRef.current.getHeight() * zoomRef.current;
                    }
                }

                canvasRef.current.requestRenderAll();
                lastPosXref.current = e.clientX;
                lastPosYref.current = e.clientY;
            }
        });

        canvasRef.current.on('mouse:up', (opt) => {
            canvasRef.current.isDragging = false;
            canvasRef.current.selection = true;
            canvasRef.current.forEachObject((o) => {
                o.selectable = true;
                o.evented = true;
                o.setCoords();
            });
        });
    }, [canvasRef.current])

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
                    const canvasRect = canvasRef.current._offset;
                    const simEvt = new MouseEvent(e.type, {
                        clientX: canvasRect.left + positionOnScene.x,
                        clientY: canvasRect.top + positionOnScene.y
                    });
                    canvasRef.current.upperCanvasEl.dispatchEvent(simEvt);
                    setActiveObject(activeObject => currentObject);
                }
            }

        }

        const getPositionOnScene = (sceneContainer, evt) => {
            let array = getMousePosition(sceneContainer, evt.clientX, evt.clientY);
            onClickPosition.fromArray(array);
            let intersects = getIntersects(onClickPosition, state.getData.scene.children[1].children[0].children);

            if (intersects.length > 0 && intersects[0].uv) {
                currentObject = intersects[0].object;
                let uv = intersects[0].uv;
                if (intersects[0].object.material.map) intersects[0].object.material.map.transformUv(uv);

                //const retinaScaling = canvasRef.current.getRetinaScaling()
                const retinaScaling = window.devicePixelRatio
                const { cssWidth = 1, cssHeight = 1} = cssScaleRef.current
                console.log(
                    'uv.x: ', uv.x,
                    '\n',
                    'retina: ', window.devicePixelRatio,
                    '\n',
                    'cssWidth: ', cssWidth,
                    '\n',
                    'canvasWidth: ', width,
                    '\n',
                    'zoom: ', zoomRef.current,
                    '\n',
                    'viewportTransform: ', canvasRef.current.viewportTransform[4],
                    '\n',
                    'cssWidth: ', cssWidth
                )
                console.log(uv.x * width / cssWidth * retinaScaling - (canvasRef.current.viewportTransform[4] / (zoomRef.current * retinaScaling * cssWidth)))
                return {
                    // x: uv.x * width / cssWidth * zoomRef.current  + canvasRef.current.viewportTransform[4] / cssWidth ,
                    // y: uv.y * height / cssHeight * zoomRef.current + canvasRef.current.viewportTransform[5] / cssHeight
                    x: uv.x * width / cssWidth * retinaScaling ,
                    y: uv.y * height / cssHeight * retinaScaling 
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

            const canvasCssScale = {
                cssWidth: cssScale.width,
                cssHeight: cssScale.height
            }
            cssScaleRef.current = canvasCssScale
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
                <canvas ref={ref} id="canvas" style={{border: '1px solid gray'}}/>
            </div>

            <TextureTabs handleChange={handleChange} value={value}/>

            <div>
                {
                    TEXTURES_DATA.map((item, i) => {
                        return <canvas key={i} id={item.name} className={ i === value ? styles.block : styles.none }
                                       width={width} height={height} ref={el => itemsRef.current[i] = el} />
                    })
                }
            </div>
        </div>
    );
}

export default React.memo(Uvw);


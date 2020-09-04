import React, {useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import { fabric } from 'fabric';

import {Raycaster, Vector2} from "three";
import {useRouter} from "next/router";
import {Save, CloudUpload} from '@material-ui/icons';
import { Button } from "@material-ui/core";
import gql from "graphql-tag";
import axios from 'axios';
import {useMutation, useQuery} from "@apollo/react-hooks";

import useFabric from "./useFabric";

import styles from './Uvw.module.sass'
import TextureTabs from './TextureTabs'
import ViewportSceneContext from "../../../context/ViewportSceneContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const ModelsQuery = gql`
    query ModelUvw($id: ID!) {
        model(id: $id) {
            map
            roughnessMap
            metalnessMap
            normalMap
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
    const { data, loading, error, refetch } = useQuery(ModelsQuery, {
        variables: {
            id: router.query.id
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
            if (item[0] == activeMap) {
                canvasRef.current.loadFromJSON(item[1][0]);
                canvasRef.current.renderAll()
            }

            const sourceCtx = canvasRef.current.getContext('2d');
            const canvas = itemsRef.current.find((canvas) => canvas.id == item[0]);

            const myImageData = sourceCtx.getImageData(0, 0, 512, 512);
            canvas.getContext('2d').putImageData(myImageData, 0, 0);

        })

    }, [data])

    const ref = useFabric((canvas) => {
        canvasRef.current = canvas;
        canvas.on({"after:render": function(e) {
            const sourceCtx = canvas.getContext('2d');
            activeContextCanvasRef.current = activeCanvasRef.current.getContext('2d');
            const myImageData = sourceCtx.getImageData(0, 0, 512, 512);
            activeContextCanvasRef.current.putImageData(myImageData, 0, 0);
        }});

        canvas.isDrawingMode = true;
        canvas.width = width;
        canvas.height = height;
        canvas.setWidth(512)
        canvas.setHeight(512)

    });


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
        console.log(mutationLoading)
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
        console.log('loaded')
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
        const { container, scene, camera } = state.getData;
        if (!(container && scene && camera)) return;

        let onClickPosition = new Vector2();
        let currentObject = null;

        const onMouseEvt = (evt) => {
            evt.preventDefault();

            const positionOnScene = getPositionOnScene(state.getData.container, evt)
            if (positionOnScene) {
                const canvasRect = canvasRef.current._offset;
                const simEvt = new MouseEvent(evt.type, {
                    clientX: canvasRect.left + positionOnScene.x,
                    clientY: canvasRect.top + positionOnScene.y
                });
                canvasRef.current.upperCanvasEl.dispatchEvent(simEvt);
                setActiveObject(activeObject => currentObject);
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

                return {
                    x: uv.x * 512,
                    y: uv.y * 512
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
    fabric.Object.prototype.objectCaching = true;

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
                <canvas ref={ref} id="canvas" />
            </div>

            <TextureTabs handleChange={handleChange} value={value}/>

            <div>
                {
                    TEXTURES_DATA.map((item, i) => {
                        return <canvas key={i} id={item.name} className={ i === value ? styles.block: styles.none }
                                       width={width} height={height} ref={el => itemsRef.current[i] = el} />
                    })
                }
            </div>
        </div>
    );
}

export default React.memo(Uvw);


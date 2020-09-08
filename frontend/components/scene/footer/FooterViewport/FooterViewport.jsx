import React, {useContext, useEffect, useState, useRef} from 'react';
import * as THREE from "three";
import { Vector3 } from "three";
import { AppBar, Card, CardContent, Tab, Tabs, TextField } from '@material-ui/core';

import ViewportSceneContext from "../../../../context/ViewportSceneContext";

import { useStyles } from "./FooterViewport.style";
import { optionsMap } from "../../settings/viewport/MaterialOptions/MaterialOptions";

export let optionsCoords = new Map();

function FooterViewport() {
    const classes = useStyles();
    const [value, setValue] = useState(null);
    const [state, dispatch] = useContext(ViewportSceneContext);
    const [disabled, setDisabled] = useState(true);
    const [coords, setCoords] = useState({
        x: 0,
        y: 0,
        z: 0
    });

    let arr = [];
    if (state.getObjects.objects !== undefined) {
        arr = Object.entries(state.getObjects.objects);
    }

    useEffect(() => {
        if (!state.getObjects.objects) return;
        state.getObjects.objects.map((item) => {
            optionsCoords.set(item, new Vector3(0,0,0))
        })
    }, [state.getObjects])

    useEffect(() => {
      //  if (!state.getCurrentObject) return;
        if (state.getCurrentObject.name === null) {
            setValue(false);
            setDisabled(true);
        }
        else {
            arr.map((item) => {
                if (item[1] === state.getCurrentObject.name) {
                    setValue(+item[0]);
                }
            })
            state.getData.model.traverse((child) => {
                if (!child.isMesh) return;
                const prop = optionsMap.get(child.name);
                if (prop !== undefined) {
                    child.material.transparent = prop.transparent;
                    if (prop.transparent) child.material.opacity = 0.5;
                    child.material.shadowCatcher = prop.shadowCatcher;
                    if (prop.shadowCatcher) child.material.opacity = 0;
                    child.material.color = new THREE.Color(prop.color);
                }
            });

            const propCoords = optionsCoords.get(state.getCurrentObject.name);
            if(propCoords !== undefined) {
                setCoords(propCoords);
            }

            setDisabled(false);
        }
    }, [state.getCurrentObject])

    const handleChange = (event, newValue) => {
        setValue(newValue);
        arr.map((item) => {
            if (+item[0] === newValue) {
                dispatch({
                    type: 'getCurrentObject',
                    payload: {
                        name: item[1],
                        object: state.getCurrentObject.object
                    }
                })
            }
        })
    };

    const coordsChange = (event) => {
        setCoords({...coords, [event.target.name]: +event.target.value});
    }

    useEffect(() => {
        if (state.getCurrentObject.object !== null){
            optionsCoords.set(state.getCurrentObject.name, new Vector3(coords.x, coords.y, coords.z))
            dispatch({
                type: 'getCoords',
                payload: new Vector3(coords.x, coords.y, coords.z)
            })
        }
    }, [coords])

    useEffect(() => {
        console.log(state.getData.controls)
        if (!state.getData.controls) return;

        setCoords({
            x: state.getCoords.x,
            y: state.getCoords.y,
            z: state.getCoords.z
        });
    }, [state.getData.controls ? state.getData.controls[1].dragging : state.getData.controls])

    return (
        <footer className={ classes.footer }>
            <div className={ classes.materials }>
                <div className={ classes.root }>
                    <AppBar position="static">
                        <Tabs
                            value={ value }
                            onChange={ handleChange }
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs"
                         >
                            {
                                arr.map((item) => {
                                     return <Tab label={ item[1] } key={ item[0] }/>
                                })
                            }
                        </Tabs>
                    </AppBar>
                    {
                        arr.map((item, index) => {
                            return (
                                <div key={ item[0] } className={ value === index ? classes.block : classes.none } />
                            )
                        })
                    }
                </div>
            </div>

            <div className={ classes.coords }>
                <Card className={ classes.root }>
                    <div className={ classes.header }>
                        Координаты
                    </div>
                    <CardContent className={ classes.content }>
                        <TextField
                            label="X"
                            type="number"
                            id="outlined-size-normal"
                            defaultValue="0"
                            className={ classes.textField }
                            margin="normal"
                            variant="outlined"
                            size="small"
                            disabled={disabled}
                            name="x"
                            onChange={coordsChange}
                            value={coords.x.toFixed(2)}
                        />
                        <TextField
                            label="Y"
                            type="number"
                            id="outlined-size-normal"
                            defaultValue="0"
                            className={ classes.textField }
                            margin="normal"
                            variant="outlined"
                            size="small"
                            disabled={disabled}
                            name="y"
                            onChange={coordsChange}
                            value={coords.y.toFixed(2)}
                        />
                        <TextField
                            label="Z"
                            type="number"
                            id="outlined-size-normal"
                            defaultValue="0"
                            className={ classes.textField }
                            margin="normal"
                            variant="outlined"
                            size="small"
                            disabled={disabled}
                            name="z"
                            onChange={coordsChange}
                            value={coords.z.toFixed(2)}
                        />
                    </CardContent>
                </Card>
            </div>
        </footer>
    );
}

export default FooterViewport

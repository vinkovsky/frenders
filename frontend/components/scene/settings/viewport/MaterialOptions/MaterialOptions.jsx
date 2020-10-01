import React, {useContext, useEffect, useState, useCallback} from 'react';
import {Box, FormControl, FormControlLabel, FormGroup, Switch} from '@material-ui/core';

import * as THREE from "three";

import { useStyles } from "./MaterialOptions.style";
import ViewportSceneContext from "../../../../../context/ViewportSceneContext";
import {SketchPicker} from "react-color";

export let optionsMap = new Map();

function MaterialOptions() {
    const classes = useStyles();
    const [state, dispatch] = useContext(ViewportSceneContext);
    const [stateSwitch, setStateSwitch] = useState({
        checkedA: false,
        checkedB: true,
        checkedC: false
    });
    const [background, setBackground] = useState(false);
    const [color, setColor] = useState('transparent');
    const [disabledOptions, setDisabledOptions] = useState({
        disabled: false,
        pointer: "none"
    });

    const handleClick = () => {
        setBackground(!background)
    };
    const handleClose = () => {
        setBackground(false)
    };

    const handleChangeComplete = useCallback((color) => {
        setColor(color.hex);
    }, []);

    useEffect(() => {
        if (!state.getObjects.objects) return;
        state.getObjects.objects.map((item) => {
            optionsMap.set(item, {
                transparent: stateSwitch.checkedA,
                solid: stateSwitch.checkedB,
                shadowCatcher: stateSwitch.checkedC,
                color: color
            })
        })
    }, [state.getObjects])

    useEffect(() => {
        if (!state.getCurrentObject) return;

        if (state.getCurrentObject.name === null) {
            setDisabledOptions({
                disabled: true,
                pointer: "none"
            });
            setColor("transparent")
        } else {
            setDisabledOptions({
                disabled: false,
                pointer: "auto"
            });
            const prop = optionsMap.get(state.getCurrentObject.name)
            if (prop !== undefined) {
                setStateSwitch({
                    checkedA: prop.transparent,
                    checkedB: prop.solid,
                    checkedC: prop.shadowCatcher
                })
                setColor(prop.color)
            }

        }
    }, [state.getCurrentObject])

    const handleChange = (event) => {
        setStateSwitch(prevState => ({ ...prevState, [event.target.name]: event.target.checked }));
    };

    useEffect(() => {
        optionsMap.set(state.getCurrentObject.name, {
            transparent: stateSwitch.checkedA,
            solid: stateSwitch.checkedB,
            shadowCatcher: stateSwitch.checkedC,
            color: color
        })

        const prop = optionsMap.get(state.getCurrentObject.name);
        if(!state.getCurrentObject.object) return;
        state.getCurrentObject.object.material.color = new THREE.Color(prop.color);
        state.getCurrentObject.object.material.transparent = prop.transparent;
        if (prop.transparent) state.getCurrentObject.object.material.opacity = 0.5;
        state.getCurrentObject.object.material.shadowCatcher = prop.shadowCatcher;
        if (prop.shadowCatcher) state.getCurrentObject.object.material.opacity = 0;

    }, [stateSwitch, color])

     return (
        <>
            <FormControl component="fieldset" disabled={disabledOptions.disabled} >
                <FormGroup>
                    <FormControlLabel control={
                        <Switch checked={ stateSwitch.checkedA } onChange={ handleChange } color="primary" name="checkedA" />
                    } label="Transparent" />
                    <FormControlLabel control={
                        <Switch checked={ stateSwitch.checkedB } onChange={ handleChange } color="primary" name="checkedB" />
                    } label="Solid" />
                </FormGroup>
            </FormControl>
            <FormControl component="fieldset" disabled={disabledOptions.disabled} >
                <FormGroup>
                    <FormControlLabel control={
                        <Switch checked={ stateSwitch.checkedC } onChange={ handleChange } color="primary" name="checkedC" />
                    } label="Shadow catcher" />
                    <FormControlLabel control={
                        <Box style={{ background: color, pointerEvents: disabledOptions.pointer }} className={ classes.swatch } onClick={ handleClick } />
                    } label="Цвет" />
                    { background ? <div className={ classes.popover }>
                        <div className={ classes.cover } onClick={ handleClose }/>
                        <SketchPicker color={ color } onChange={ handleChangeComplete } />
                    </div> : null }
                </FormGroup>
            </FormControl>
        </>
    );
}

export default React.memo(MaterialOptions);

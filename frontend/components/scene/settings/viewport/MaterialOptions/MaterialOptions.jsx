import React, {useContext, useEffect, useState, useCallback} from 'react';
import { FormControl, FormControlLabel, FormGroup, Switch } from '@material-ui/core';

import * as THREE from "three";

import ColorPicker from '../../../ColorPicker/ColorPicker'
import ViewportSceneContext from "../../../../../context/ViewportSceneContext";

export let optionsMap = new Map();

export default function MaterialOptions() {
    const [stateSwitch, setStateSwitch] = useState({
        checkedA: false,
        checkedB: true,
        checkedC: false
    });
    const [disabled, setDisabled] = useState(true);
    const [state, dispatch] = useContext(ViewportSceneContext);

    useEffect(() => {
        if (!state.getObjects.objects) return;
        state.getObjects.objects.map((item) => {
            optionsMap.set(item, {
                transparent: stateSwitch.checkedA,
                solid: stateSwitch.checkedB,
                shadowCatcher: stateSwitch.checkedC,
                color: state.getColor.color
            })
        })
    }, [state.getObjects])

    useEffect(() => {
        if (!state.getCurrentObject) return;

        if (state.getCurrentObject.name === null) {
            setDisabled(true);
        } else {
            setDisabled(false);
            const prop = optionsMap.get(state.getCurrentObject.name)
            if (prop !== undefined) {
                setStateSwitch({
                    checkedA: prop.transparent,
                    checkedB: prop.solid,
                    checkedC: prop.shadowCatcher,
                })
                state.getColor.color = prop.color
            }
        }
      //  console.log(optionsMap);
    }, [state.getCurrentObject])

    useEffect(() => {
        if (!state.getCurrentObject.object) return;
        const prop = optionsMap.get(state.getCurrentObject.name);

        state.getCurrentObject.object.material.color = new THREE.Color(state.getColor.color);
    }, [state.getColor])


    // const onChange = useCallback(e => handleChange(e), []);

    const handleChange = (event) => {
        setStateSwitch(prevState => ({ ...prevState, [event.target.name]: event.target.checked }));

        optionsMap.set(state.getCurrentObject.name, {
            transparent: stateSwitch.checkedA,
            solid: stateSwitch.checkedB,
            shadowCatcher: stateSwitch.checkedC,
            color: state.getColor.color
        })
        const prop = optionsMap.get(state.getCurrentObject.name);
        state.getCurrentObject.object.material.transparent = prop.transparent;
        if (prop.transparent) state.getCurrentObject.object.material.opacity = 0.5;
        state.getCurrentObject.object.material.shadowCatcher = prop.shadowCatcher;
        if (prop.shadowCatcher) state.getCurrentObject.object.material.opacity = 0;
    };

    return (
        <>
            <FormControl component="fieldset" disabled={disabled} >
                <FormGroup>
                    <FormControlLabel control={
                        <Switch checked={ stateSwitch.checkedA } onChange={ handleChange } color="primary" name="checkedA" />
                    } label="Transparent" />
                    <FormControlLabel control={
                        <Switch checked={ stateSwitch.checkedB } onChange={ handleChange } color="primary" name="checkedB" />
                    } label="Solid" />
                </FormGroup>
            </FormControl>
            <FormControl component="fieldset" disabled={disabled} >
                <FormGroup>
                    <FormControlLabel control={
                        <Switch checked={ stateSwitch.checkedC } onChange={ handleChange } color="primary" name="checkedC" />
                    } label="Shadow catcher" />
                    <ColorPicker />
                </FormGroup>
            </FormControl>
        </>
    );
}
import React, {useContext, useEffect, useState} from 'react';
import BrushIcon from '@material-ui/icons/Brush';
import ToggleButton from '@material-ui/lab/ToggleButton';
import NearMeIcon from '@material-ui/icons/NearMe';
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import { useStyles } from "./ToolBoxUvw.style";
import ViewportSceneContext from "../../../../context/ViewportSceneContext";

export default function ToolBoxUvw({active}) {
    const classes = useStyles();
    const [state, dispatch] = useContext(ViewportSceneContext);
    const [view, setView] = React.useState('arrow');

    useEffect(() => {
        if(!(state.getCanvas && state.getSettingsBrush)) return;
        state.getCanvas.canvas.freeDrawingBrush.width = state.getSettingsBrush.size;
        state.getCanvas.canvas.freeDrawingBrush.color = state.getSettingsBrush.color;
    }, [state.getCanvas, state.getSettingsBrush])

    const handleChange = (event, nextView) => {
        if (nextView !== null) {
            setView(nextView);
        }
    };

    const handleArrowClick = () => {
        state.getCanvas.canvas.isDrawingMode = false;
    }

    const handleBrushClick = () => {
        state.getCanvas.canvas.isDrawingMode = true;
    }

    return (
        <aside className={ active === 1 ? classes.block : classes.none }>
            <ToggleButtonGroup orientation="vertical" value={ view } exclusive
                               onChange={ handleChange } className={ classes.group }>
                <ToggleButton value="arrow" aria-label="arrow" className={ classes.button } onClick={handleArrowClick}>
                    <NearMeIcon />
                </ToggleButton>
                <ToggleButton value="brush" aria-label="brush" className={ classes.button } onClick={handleBrushClick}>
                    <BrushIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </aside>
    );
}

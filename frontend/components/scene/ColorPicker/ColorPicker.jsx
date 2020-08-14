import React, {useContext, useEffect, useState} from "react";
import { Box, FormControlLabel } from "@material-ui/core";
import { SketchPicker } from "react-color";

import { useStyles } from "./ColorPicker.style";
import ViewportSceneContext from "../../../context/ViewportSceneContext";

const ColorPicker = () => {
    const classes = useStyles();
    const [background, setBackground] = useState(false);
    const [color, setColor] = useState('transparent');
    const [state, dispatch] = useContext(ViewportSceneContext);

    const handleClick = () => {
        setBackground(!background)
    };

    const handleClose = () => {
        setBackground(false)
    };

    const handleChangeComplete = (color) => {
        setColor(color.hex);
    };

    useEffect(() => {
        dispatch({
            type: 'getColor',
            payload: {
                color: color.toString(),
            }
        });
    }, [color])

    return (
        <>
            <FormControlLabel control={
                <Box style={{ background: state.getColor.color }} className={ classes.swatch } onClick={ handleClick } />
            } label="Цвет" />
            { background ? <div className={ classes.popover }>
                <div className={ classes.cover } onClick={ handleClose }/>
                <SketchPicker color={ state.getColor.color } onChange={ handleChangeComplete } />
            </div> : null }
        </>
    )
}

export default ColorPicker;

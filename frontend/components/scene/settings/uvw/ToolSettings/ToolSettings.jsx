import React, {useCallback, useContext, useEffect, useState} from 'react';
import { makeStyles, useTheme  } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {Box} from "@material-ui/core";
import {SketchPicker} from "react-color";

import { useStyles } from "./ToolSettings.style";
import Grid from "@material-ui/core/Grid";
import ViewportSceneContext from "../../../../../context/ViewportSceneContext";

export default function ToolSettings() {
    const classes = useStyles();
    const theme = useTheme();
    const [state, dispatch] = useContext(ViewportSceneContext);
    const [brushSize, setBrushSize] = useState(1);
    const [background, setBackground] = useState(false);
    const [color, setColor] = useState('#000000');
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

    const handleBrushSizeChange = (event, newValue) => {
        setBrushSize(newValue);
    }

    const handleChangeComplete = useCallback((color) => {
        setColor(color.hex);
    }, []);

    useEffect(() => {
        dispatch({
            type: 'getSettingsBrush',
            payload: {
                color: color,
                size: brushSize
            }
        })
    }, [color, brushSize])

    return (
        <div className={classes.root}>
            <FormControl component="fieldset" className={classes.root}>
                <Grid container spacing={2} alignItems="center" className={classes.root}>
                    <Grid item xs={8}>
                        <Typography id="discrete-slider" gutterBottom>
                            Размер кисти
                        </Typography>
                        <Slider
                            defaultValue={1}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={1}
                            max={100}
                            onChange={handleBrushSizeChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FormGroup>
                            <FormControlLabel control={
                                <Box style={{ background: color }}
                                     className={ classes.swatch } onClick={ handleClick } />
                            } label="Цвет" />
                            { background ? <div className={ classes.popover }>
                                <div className={ classes.cover } onClick={ handleClose }/>
                                <SketchPicker color={ color } onChange={ handleChangeComplete } />
                            </div> : null }
                        </FormGroup>
                    </Grid>
                </Grid>
            </FormControl>
        </div>
    );
}

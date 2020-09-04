import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import { makeStyles, useTheme  } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import ViewportSceneContext from "../../../../../context/ViewportSceneContext";
import Grid from '@material-ui/core/Grid';

import { useStyles } from "./RenderSettings.style";
import {useRouter} from "next/router";
import {Box} from "@material-ui/core";
import {SketchPicker} from "react-color";

function RenderSettings({ envMaps }) {
    const classes = useStyles();
    const router = useRouter();
    const [state, dispatch] = useContext(ViewportSceneContext);
    const [exposureValue, setExposureValue] = useState(1.5);
    const [toneMappingValue, setToneMappingValue] = useState('4');
    // const [background, setBackground] = useState(true);
    const [switchBackground, setSwitchBackground] = useState({
        disabled: true,
        pointer: "none"
    });
    const [envMap, setEnvMap] = useState("https://res.cloudinary.com/frenders/raw/upload/v1598926961/shanghai_bund_2k_0ecb264c7c");
    const [viewPanelBackground, setViewPanelBackground] = useState(false);
    const [color, setColor] = useState('#000000');

    const handleChange = (event) => {
        setToneMappingValue(event.target.value);
    };

    const handleEnvMapChange = (event) => {
        setEnvMap(event.target.value);
    }

    // const handleBackgroundChange = () => {
    //     setBackground(!background)
    // }

    const handleSliderExposureChange = (event, newValue) => {
        setExposureValue(newValue);
    };

    const handleClick = () => {
        setViewPanelBackground(!viewPanelBackground)
    };

    const handleClose = () => {
        setViewPanelBackground(false)
    };

    useEffect(() => {
        if (envMap === "none") {
            setSwitchBackground({
                disabled: false,
                pointer: "auto"
            })
        }
        else {
            setSwitchBackground({
                disabled: true,
                pointer: "none"
            });
        }
    }, [envMap])

    const handleChangeComplete = useCallback((color) => {
        setColor(color.hex);
    }, []);

    useEffect(() => {
        dispatch({
            type: 'getRenderer',
            payload: {
                toneMappingValue: parseInt(toneMappingValue),
                exposureValue: exposureValue,
                envMap: envMap,
                // background: background
            }
        });
    }, [toneMappingValue, exposureValue, envMap])

    useEffect(() => {
        return () => {
            dispatch({
                type: 'getColor',
                payload: color
            })
        }
    }, [color])

    return (
        <div className={ classes.root }>
            <FormControl className={ classes.formControl } component="fieldset">
                <Typography component="h5">
                    Экспозиция
                </Typography>
                <Slider
                    defaultValue={1.5}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={0.5}
                    marks
                    min={0}
                    max={20}
                    value={ typeof exposureValue === 'number' ? exposureValue : 0 }
                    onChange={ handleSliderExposureChange }
                />
            </FormControl>
            <FormControl className={ classes.formControl } component="fieldset">
                <Typography component="h5">
                    Тональное отображение
                </Typography>
                <Select
                    value={toneMappingValue}
                    onChange={handleChange}
                    className={classes.select}
                    aria-label='Tone Mapping'
                >
                    <MenuItem value="0">Нет</MenuItem>
                    <MenuItem value="1">Linear</MenuItem>
                    <MenuItem value="2">Reinhard</MenuItem>
                    <MenuItem value="3">Cineon</MenuItem>
                    <MenuItem value="4">ACESFilmic</MenuItem>
                </Select>
            </FormControl>
            <FormControl className={ classes.formControl } component="fieldset">
                <Typography component="h5">
                    Окружение
                </Typography>
                <Select
                    value={envMap}
                    onChange={handleEnvMapChange}
                    className={classes.select}
                    aria-label='environment'
                >
                    <MenuItem value="none">Нет</MenuItem>
                    {
                        envMaps.environments.map((item) => (
                            <MenuItem key={item.name} value={item.file.url}>
                                {item.name}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <FormControl className={ classes.formControl } component="fieldset" disabled={switchBackground.disabled}>
                <Grid container spacing={2} alignItems="center">
                    {/*<Grid item xs>*/}
                    {/*    <FormControlLabel control={*/}
                    {/*        <Switch checked={background} color="primary" name="background"*/}
                    {/*                onChange={handleBackgroundChange} />*/}
                    {/*    } label="Фон" />*/}
                    {/*</Grid>*/}
                    <Grid item xs>
                        <FormControlLabel control={
                            <Box style={{ background: color, pointerEvents: switchBackground.pointer }}
                                 className={ classes.swatch } onClick={ handleClick } />
                        } label="Цвет" />
                        { viewPanelBackground ? <div className={ classes.popover }>
                            <div className={ classes.cover } onClick={ handleClose }/>
                            <SketchPicker color={ color } onChange={ handleChangeComplete } />
                        </div> : null }
                    </Grid>
                </Grid>
            </FormControl>
        </div>
    )
}

export default React.memo(RenderSettings)


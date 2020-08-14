import React, {useContext, useEffect, useRef, useState} from 'react';
import { makeStyles, useTheme  } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ColorPicker from '../../../ColorPicker/ColorPicker'
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import ViewportSceneContext from "../../../../../context/ViewportSceneContext";
import Grid from '@material-ui/core/Grid';

import { useStyles } from "./RenderSettings.style";
import {useRouter} from "next/router";

function RenderSettings({ envMaps }) {
    const classes = useStyles();
    const router = useRouter();
    const [state, dispatch] = useContext(ViewportSceneContext);
    const [exposureValue, setExposureValue] = useState(1.5);
    const [toneMappingValue, setToneMappingValue] = useState('4');
    const [background, setBackground] = useState(false);
    const [envMap, setEnvMap] = useState("https://res.cloudinary.com/frenders/raw/upload/v1595923417/shanghai_bund_2k_8d026479c4");

    const handleChange = (event) => {
        setToneMappingValue(event.target.value);
    };

    const handleEnvMapChange = (event) => {
        setEnvMap(event.target.value);
        // router.push(router.asPath)
    }

    const handleBackgroundChange = () => {
        setBackground(!background)
    }

    const handleSliderExposureChange = (event, newValue) => {
        setExposureValue(newValue);
    };

    useEffect(() => {
        dispatch({
            type: 'getRenderer',
            payload: {
                toneMappingValue: parseInt(toneMappingValue),
                exposureValue: exposureValue,
                envMap: envMap,
                background: background,
            }
        });
    }, [toneMappingValue, exposureValue, envMap, background])

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
                    aria-label='Environment'
                >
                    <MenuItem value="#000000">Нет</MenuItem>
                    {
                        envMaps.environments.map((item) => (
                            <MenuItem key={item.name} value={item.file.url}>
                                {item.name}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <FormControl className={ classes.formControl } component="fieldset">
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <FormControlLabel control={
                            <Switch checked={background} color="primary" name="background" onChange={handleBackgroundChange} />
                        } label="Фон" />
                    </Grid>
                    <Grid item xs>
                        <ColorPicker />
                    </Grid>
                </Grid>
            </FormControl>
        </div>
    )
}

export default React.memo(RenderSettings)


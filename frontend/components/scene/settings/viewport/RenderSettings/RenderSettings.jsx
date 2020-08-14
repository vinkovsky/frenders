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
    const [background, setBackground] = useState(true);
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
    }, [toneMappingValue, exposureValue, envMap])

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


















// const names = [
//     {
//         name: 'None',
//         obj: THREE.NoToneMapping
//     },
//     {
//         name: 'Linear',
//         obj: THREE.LinearToneMapping
//     },
//     {
//         name: 'Reinhard',
//         obj: THREE.ReinhardToneMapping
//     },
//     {
//         name: 'Cineon',
//         obj: THREE.CineonToneMapping
//     },
//     {
//         name: 'ACESFilmic',
//         obj: THREE.ACESFilmicToneMapping
//     }
//
// ];

// const hdr = [
//     {
//         name: 'Leadenhall',
//         file: {
//             url: "https://res.cloudinary.com/frenders/raw/upload/v1595923417/shanghai_bund_2k_8d026479c4"
//         }
//     },
//     {
//         name: 'Leadenhall',
//         file: {
//             url: "https://res.cloudinary.com/frenders/raw/upload/v1595923417/shanghai_bund_2k_8d026479c4"
//         }
//     }
// ]

// export default function RenderSettings({ envMaps }) {
//     const classes = useStyles();
//     const theme = useTheme();
//     const [state, dispatch] = useContext(ViewportSceneContext);
//     const [exposureValue, setExposureValue] = React.useState(1.5);
//     const [toneMapping, setToneMapping] = React.useState(names[0]);
//     const [envMap, setEnvMap] = useState("https://res.cloudinary.com/frenders/raw/upload/v1595923417/shanghai_bund_2k_8d026479c4");
//
//     const handleToneMappingChange = (event) => {
//         let index = event.target.value;
//         if(index === 4 || index === 5) index--;
//         setToneMapping(names[index]);
//     };
//
//     const handleSliderEnvChange = (event, newValue) => {
//         setEnvMap(newValue.props.value);
//     };
//
//     const handleSliderExposureChange = (event, newValue) => {
//         setExposureValue(newValue);
//     };
//
//     const handleInputExposureChange = (event) => {
//         setExposureValue(event.target.value === '' ? '' : Number(event.target.value));
//     };
//
//     const handleExposureBlur = () => {
//         if (exposureValue < 0) {
//             setExposureValue(0);
//         } else if (exposureValue > 20) {
//             setExposureValue(20);
//         }
//     };
//
//     useEffect(() => {
//         dispatch({
//             type: 'getRenderer',
//             payload: {
//                 toneMappingExposure: exposureValue,
//                 toneMapping: toneMapping.obj,
//                 // envMap: envMap
//             }
//         });
//     }, [exposureValue, toneMapping])
//
//     return (
//         <div className={classes.root}>
//             <FormControl className={classes.formControl} component="fieldset">
//                 <InputLabel
//                     id="exposureLabel"
//                     className={classes.label}
//                     htmlFor="exposure"
//                 >
//                     Экспозиция
//                 </InputLabel>
//                 <Grid container spacing={2} alignItems="center">
//                     <Grid item xs>
//                         <Slider
//                             id="toneMappingExposure"
//                             defaultValue={1.5}
//                             aria-labelledby="discrete-slider"
//                             valueLabelDisplay="auto"
//                             step={0.1}
//                             marks
//                             min={0}
//                             max={20}
//                             value={typeof exposureValue === 'number' ? exposureValue : 0}
//                             onChange={handleSliderExposureChange}
//                         />
//                     </Grid>
//                     <Grid item>
//                         <Input
//                             className={classes.input}
//                             id="exposure"
//                             value={exposureValue}
//                             margin="dense"
//                             disableUnderline={true}
//                             onChange={handleInputExposureChange}
//                             onBlur={handleExposureBlur}
//                             inputProps={{
//                                 step: 0.1,
//                                 min: 0,
//                                 max: 20,
//                                 type: 'number',
//                                 'aria-labelledby': 'input-slider',
//                             }}
//                         />
//                     </Grid>
//                 </Grid>
//             </FormControl>
//             <FormControl className={classes.formControl} component="fieldset">
//                 <Typography component="h5">
//                     Тональное отображение
//                 </Typography>
//                 <Select
//                     className={classes.select}
//                     value={toneMapping}
//                     onChange={handleToneMappingChange}
//                     inputProps={{
//                         id: 'toneMapping',
//                     }}
//                 >
//                     {names.map((item) => (
//                         <MenuItem key={item.obj} value={item.obj}>
//                             {item.name}
//                         </MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>
//             <FormControl className={classes.formControl} component="fieldset">
//                 <Typography component="h5">
//                     Окружение
//                 </Typography>
//                 <Select
//                     className={classes.select}
//                     value=""
//                     onChange={handleSliderEnvChange}
//                     inputProps={{
//                         id: 'environments',
//                     }}
//                 >
//                     {
//                         envMaps.environments.map((item) => (
//                             <MenuItem key={item.name} value={item.file.url}>
//                                 {item.name}
//                             </MenuItem>
//                         ))
//                     }
//                 </Select>
//             </FormControl>
//             <FormControl className={classes.formControl} component="fieldset">
//                 <Grid container spacing={2} alignItems="center">
//                     <Grid item xs>
//                         <FormControlLabel control={
//                             <Switch color="primary" name="background" />
//                         } label="Фон" />
//                     </Grid>
//                     <Grid item xs>
//                         <ColorPicker />
//                     </Grid>
//                 </Grid>
//             </FormControl>
//         </div>
//     );
// }
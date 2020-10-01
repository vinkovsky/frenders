import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import ViewportSceneContext from "../../../../../context/ViewportSceneContext";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 176,
    },
    tabs: {
        width: '100%',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    none: {
        display: "none"
    },
    block: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    box: {
        marginLeft: '15px',
        marginRight: '15px'
    },
    textField: {
        marginTop: '8px',
        padding: '5px',
        width: '140px'
    },
    label: {
        marginLeft: 0
    },
    text: {
        textAlign: 'center'
    }
}));

export default function ChooseMap() {
    const classes = useStyles();
    const [state, dispatch] = useContext(ViewportSceneContext);
    const [value, setValue] = useState(1);

    const [dataMap, setDataMap] = useState({
        // 'map': {
        //     on: true,
        //     intensity: 100
        // },
        'roughness': {
            on: true,
            intensity: 100
        },
        'metalness': {
            on: true,
            intensity: 0
        },
        // 'normalMap': {
        //     on: true,
        //     intensity: 100
        // }
    })

    const handleChangeTabs = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeVisible = (event) => {
        setDataMap({
            ...dataMap, [event.target.name]: {
                on: event.target.checked,
                intensity: dataMap[event.target.name].intensity
            }
        });
    };

    const handleIntensityChange = (event) => {
        setDataMap({
            ...dataMap, [event.target.name]: {
                on: dataMap[event.target.name].on,
                intensity: +event.target.value
            }
        })
        if(state.getCurrentObject.object !== null) {
            state.getCurrentObject.object.material[event.target.name] = (+event.target.value) * 0.01;
        }
    }

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChangeTabs}
                className={classes.tabs}
            >
                <Tab label="diffuse" />
                <Tab label="roughness" />
                <Tab label="metalness" />
                <Tab label="normal" />
            </Tabs>
            <div className={ value === 0 ? classes.block : classes.none }>
                <Box className={classes.box}>
                    {/*<Typography id="map" className={classes.text}>*/}
                    {/*    Интенсивность*/}
                    {/*</Typography>*/}
                    {/*<TextField*/}
                    {/*    type="number"*/}
                    {/*    id="outlined-size-normal"*/}
                    {/*    defaultValue="100"*/}
                    {/*    inputProps={{ min: "0", max: "100", step: "1" }}*/}
                    {/*    className={ classes.textField }*/}
                    {/*    margin="normal"*/}
                    {/*    variant="outlined"*/}
                    {/*    size="small"*/}
                    {/*    name="map"*/}
                    {/*    onChange={handleIntensityChange}*/}
                    {/*/>*/}
                    {/*<FormControlLabel className={classes.label} control={<Switch defaultChecked onChange={handleChangeVisible} name="map" color="primary" />} label="Включено" />*/}
                </Box>
            </div>
            <div className={ value === 1 ? classes.block : classes.none }>
                <Box className={classes.box}>
                    <Typography id="roughness" className={classes.text}>
                        Интенсивность
                    </Typography>
                    <TextField
                        type="number"
                        id="outlined-size-normal"
                        defaultValue="100"
                        inputProps={{ min: 0, max: 100, step: 1 }}
                        className={ classes.textField }
                        margin="normal"
                        variant="outlined"
                        size="small"
                        name="roughness"
                        onChange={handleIntensityChange}
                    />
                    {/*<FormControlLabel className={classes.label} control={<Switch defaultChecked onChange={handleChangeVisible} name="roughness" color="primary" />} label="Включено" />*/}
                </Box>
            </div>
            <div className={ value === 2 ? classes.block : classes.none }>
                <Box className={classes.box}>
                    <Typography id="metalness" className={classes.text}>
                        Интенсивность
                    </Typography>
                    <TextField
                        type="number"
                        id="outlined-size-normal"
                        defaultValue="0"
                        inputProps={{ min: "0", max: "100", step: "1" }}
                        className={ classes.textField }
                        margin="normal"
                        variant="outlined"
                        size="small"
                        name="metalness"
                        onChange={handleIntensityChange}
                    />
                    {/*<FormControlLabel className={classes.label} control={<Switch defaultChecked onChange={handleChangeVisible} name="metalness" color="primary" />} label="Включено" />*/}
                </Box>
            </div>
            <div className={ value === 3 ? classes.block : classes.none }>
                <Box className={classes.box}>
                    {/*<Typography id="normalMap" className={classes.text}>*/}
                    {/*    Интенсивность*/}
                    {/*</Typography>*/}
                    {/*<TextField*/}
                    {/*    type="number"*/}
                    {/*    id="outlined-size-normal"*/}
                    {/*    defaultValue="100"*/}
                    {/*    inputProps={{ min: "0", max: "100", step: "1" }}*/}
                    {/*    className={ classes.textField }*/}
                    {/*    margin="normal"*/}
                    {/*    variant="outlined"*/}
                    {/*    size="small"*/}
                    {/*    name="normalMap"*/}
                    {/*    onChange={handleIntensityChange}*/}
                    {/*/>*/}
                    {/*<FormControlLabel className={classes.label} control={<Switch defaultChecked onChange={handleChangeVisible} name="normalMap" color="primary" />} label="Включено" />*/}
                </Box>
            </div>
        </div>
    );
}

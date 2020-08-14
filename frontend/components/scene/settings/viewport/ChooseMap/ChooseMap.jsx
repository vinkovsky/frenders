import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

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
    }
}));

export default function ChooseMap() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [state, setState] = React.useState({
        checkedA: true,
        checkedB: true,
        checkedC: true,
        checkedD: true
    });

    const [dataMap, setDataMap] = useState({
            'diffuse': {
                on: true,
                intensity: 100
            },
            'roughness': {
                on: true,
                intensity: 100
            },
            'metalness': {
                on: true,
                intensity: 100
            },
            'normal': {
                on: true,
                intensity: 100
            }
        }
    )

    const handleChangeTabs = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeVisible = (event) => {
        setDataMap({
            ...dataMap, [event.target.name]: {
                on: event.target.checked,
                intensity: dataMap[event.target.name].intensity
            }
        })
        console.log(dataMap)
    };

    const handleIntensityChange = (event, newValue) => {
        setDataMap({
            ...dataMap, [event.target.ariaLabel]: {
                on: dataMap[event.target.ariaLabel].on,
                intensity: newValue
            }
        })
        console.log(dataMap)
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
            <div className={ value === 0 ? classes.block : classes.none  }>
                <Box>
                    <Typography id="diffuse" gutterBottom>
                        Интенсивность
                    </Typography>
                    <Slider
                        defaultValue={100}
                        aria-label="diffuse"
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={0}
                        max={100}
                        onChange={ handleIntensityChange }
                    />
                    <FormControlLabel control={<Switch defaultChecked onChange={handleChangeVisible} name="diffuse" color="primary" />} label="Включено" />
                </Box>
            </div>
            <div className={ value === 1 ? classes.block : classes.none }>
                <Box>
                    <Typography id="roughness" gutterBottom>
                        Интенсивность
                    </Typography>
                    <Slider
                        defaultValue={100}
                        aria-label="roughness"
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={0}
                        max={100}
                        onChange={ handleIntensityChange }
                    />
                    <FormControlLabel control={<Switch defaultChecked onChange={handleChangeVisible} name="roughness" color="primary" />} label="Включено" />
                </Box>
            </div>
            <div className={ value === 2 ? classes.block : classes.none }>
                <Box>
                    <Typography id="metalness" gutterBottom>
                        Интенсивность
                    </Typography>
                    <Slider
                        defaultValue={100}
                        aria-label="metalness"
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={0}
                        max={100}
                        onChange={ handleIntensityChange }
                    />
                    <FormControlLabel control={<Switch defaultChecked onChange={handleChangeVisible} name="metalness" color="primary" />} label="Включено" />
                </Box>
            </div>
            <div className={ value === 3 ? classes.block : classes.none }>
                <Box>
                    <Typography id="normal" gutterBottom>
                        Интенсивность
                    </Typography>
                    <Slider
                        defaultValue={100}
                        aria-label="normal"
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={0}
                        max={100}
                        onChange={ handleIntensityChange }
                    />
                    <FormControlLabel control={<Switch defaultChecked onChange={handleChangeVisible} name="normal" color="primary" />} label="Включено" />
                </Box>
            </div>
        </div>
    );
}
import React, {useContext, useEffect, useState} from 'react'
import { AppBar, Card, CardContent, Tab, Tabs, TextField } from '@material-ui/core';

import ViewportSceneContext from "../../../../context/ViewportSceneContext";

import { useStyles } from "./FooterViewport.style";

function FooterViewport() {
    const classes = useStyles();
    const [value, setValue] = useState(null);
    const [state, dispatch] = useContext(ViewportSceneContext);

    let arr = [];
    if (state.getObjects.objects !== undefined) {
        arr = Object.entries(state.getObjects.objects);
    }

    useEffect(() => {
        if (!state.getCurrentObject) return;
        if (state.getCurrentObject.name === null) {
            setValue(null);
        }
        else {
            arr.map((item) => {
                if (item[1] === state.getCurrentObject.name) {
                    setValue(+item[0]);
                }
            })
        }
    }, [state.getCurrentObject])

    const handleChange = (event, newValue) => {
        setValue(newValue);
        arr.map((item) => {
            if (+item[0] === newValue) {
                dispatch({
                    type: 'getCurrentObject',
                    payload: {
                        name: item[1],
                        object: state.getCurrentObject.object
                    }
                })
            }
        })

    };

    return (
        <footer className={ classes.footer }>
            <div className={ classes.materials }>
                <div className={ classes.root }>
                    <AppBar position="static">
                        <Tabs
                            value={ value }
                            onChange={ handleChange }
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs"
                         >
                            {
                                arr.map((item) => {
                                     return <Tab label={ item[1] } key={ item[0] }/>
                                })
                            }
                        </Tabs>
                    </AppBar>
                    {
                        arr.map((item, index) => {
                            return (
                                <div key={ item[0] } className={ value === index ? classes.block : classes.none }>
                                    dfgdfg
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className={ classes.coords }>
                <Card className={ classes.root }>
                    <div className={ classes.header }>
                        Координаты
                    </div>
                    <CardContent className={ classes.content }>
                        <TextField
                            label="X"
                            type="number"
                            id="outlined-size-normal"
                            defaultValue="0"
                            className={ classes.textField }
                            margin="normal"
                            variant="outlined"
                            size="small"
                        />
                        <TextField
                            label="Y"
                            type="number"
                            id="outlined-size-normal"
                            defaultValue="0"
                            className={ classes.textField }
                            margin="normal"
                            variant="outlined"
                            size="small"
                        />
                        <TextField
                            label="Z"
                            type="number"
                            id="outlined-size-normal"
                            defaultValue="0"
                            className={ classes.textField }
                            margin="normal"
                            variant="outlined"
                            size="small"
                        />
                    </CardContent>
                </Card>
            </div>
        </footer>
    );
}

export default FooterViewport

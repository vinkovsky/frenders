import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BrushIcon from '@material-ui/icons/Brush';
import CreateIcon from '@material-ui/icons/Create';
import PaletteIcon from '@material-ui/icons/Palette';
import ToggleButton from '@material-ui/lab/ToggleButton';
import NearMeIcon from '@material-ui/icons/NearMe';
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import { useStyles } from "./ToolBoxUvw.style";

export default function ToolBoxUvw({active}) {
    const classes = useStyles();
    const [view, setView] = React.useState('arrow');

    const handleChange = (event, nextView) => {
        setView(nextView);
    };

    return (
        <aside className={ active === 1 ? classes.block : classes.none }>
            <ToggleButtonGroup orientation="vertical" value={view} exclusive onChange={handleChange} className={ classes.group }>
                <ToggleButton value="arrow" aria-label="arrow" className={ classes.button }>
                    <NearMeIcon />
                </ToggleButton>
                <ToggleButton value="pencil" aria-label="pencil" className={ classes.button }>
                    <CreateIcon />
                </ToggleButton>
                <ToggleButton value="brush" aria-label="brush" className={ classes.button }>
                    <BrushIcon />
                </ToggleButton>
                <ToggleButton value="palette" aria-label="palette" className={ classes.button }>
                    <PaletteIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </aside>
    );
}

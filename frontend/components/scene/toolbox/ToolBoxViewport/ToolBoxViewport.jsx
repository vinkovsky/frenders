import React, {useContext, useState} from "react";
import NearMeIcon from '@material-ui/icons/NearMe';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import ZoomInIcon from '@material-ui/icons/ZoomIn';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { useStyles } from "./ToolBoxViewport.style";
import ViewportSceneContext from "../../../../context/ViewportSceneContext";

const ToolBoxViewport = ({active}) => {
    const classes = useStyles();
    const [view, setView] = useState('arrow');
    const [state, dispatch] = useContext(ViewportSceneContext);

    const handleChange = (event, nextView) => {
        setView(nextView);
    };

    const handleMoveClick = () => {
        state.getData.transformControls.attach(state.getData.model)
        state.getData.transformControls.setMode( "translate" );

        console.log(state.getData.transformControls);
    }

    const handleRotateClick = () => {
        state.getData.transformControls.setMode( "rotate" );
        console.log(state.getData.transformControls);
    }

    const handleScaleClick = () => {
        state.getData.transformControls.setMode( "scale" );
        console.log(state.getData.transformControls);
    }

    return (
        <aside className={ active === 0 ? classes.block : classes.none }>
            <ToggleButtonGroup orientation="vertical" value={ view } exclusive onChange={ handleChange }>
                <ToggleButton value="arrow" aria-label="arrow" className={ classes.button }>
                    <NearMeIcon />
                </ToggleButton>
                <ToggleButton value="move" aria-label="move" className={ classes.button } onClick={handleMoveClick}>
                    <OpenWithIcon />
                </ToggleButton>
                <ToggleButton value="rotate" aria-label="rotate" className={ classes.button } onClick={handleRotateClick}>
                    <RotateRightIcon />
                </ToggleButton>
                <ToggleButton value="scale" aria-label="scale" className={ classes.button } onClick={handleScaleClick}>
                    <ZoomInIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </aside>
    );
}

export default ToolBoxViewport;
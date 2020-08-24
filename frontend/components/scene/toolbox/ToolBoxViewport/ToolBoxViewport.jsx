import React, {useContext, useEffect, useState} from "react";
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

    // useEffect(() => {
    //     state.getData.transformControls.visible = true;
    // }, [state.getCurrentObject])

    const handleChange = (event, nextView) => {
        setView(nextView);
        if (nextView == 'arrow') {
            dispatch({
                type: 'getToolbox',
                payload: {
                    active: false
                }
            });
        } else {
            dispatch({
                type: 'getToolbox',
                payload: {
                    active: true
                }
            });
        }
    };

    const handleSelectClick = () => {
        state.getData.transformControls.visible = false;
    }

    const handleMoveClick = () => {
        state.getData.transformControls.visible = true;
        state.getData.transformControls.setMode( "translate" );

        console.log(state.getData.transformControls);
    }

    const handleRotateClick = () => {
        state.getData.transformControls.visible = true;
        state.getData.transformControls.setMode( "rotate" );
        console.log(state.getData.transformControls);
    }

    const handleScaleClick = () => {
        state.getData.transformControls.visible = true;
        state.getData.transformControls.setMode( "scale" );
        console.log(state.getData.transformControls);
    }

    return (
        <aside className={ active === 0 ? classes.block : classes.none }>
            <ToggleButtonGroup orientation="vertical" value={ view } exclusive onChange={ handleChange } className={ classes.group }>
                <ToggleButton value="arrow" aria-label="arrow" className={ classes.button } onClick={handleSelectClick}>
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
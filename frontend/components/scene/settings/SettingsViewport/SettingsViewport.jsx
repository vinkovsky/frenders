import React from 'react';
import Drawer from '@material-ui/core/Drawer';

import ViewportRightPanel from '../viewport/ViewportRightPanel/ViewportRightPanel'
import UvwRightPanel from '../uvw/UvwRightPanel'

import { useStyles } from "./SettingsViewport.style";

function SettingsViewport({ active, envMaps }) {
    const classes = useStyles();

    return (
        <Drawer
            className={ classes.drawer }
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="right"
        >
            <ViewportRightPanel envMaps={ envMaps } active={ active } />
            <UvwRightPanel active={ active } />
        </Drawer>
    );
}

export default React.memo(SettingsViewport);
import React from 'react';
import Drawer from '@material-ui/core/Drawer';

import ToolBoxViewport from '../ToolBoxViewport/ToolBoxViewport';
import ToolBoxUvw from '../ToolBoxUvw/ToolBoxUvw';

import { useStyles } from "./ToolBox.style";

export default function ToolBox({ active }) {
    const classes = useStyles();

    return (
        <Drawer
            className={ classes.drawer }
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left"
        >
            <ToolBoxViewport active={active} />
            <ToolBoxUvw active={active} />
        </Drawer>
    );
}
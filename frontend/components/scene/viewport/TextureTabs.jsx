import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const TextureTabs = ({handleChange, value}) => {
    const classes = useStyles();


    return (
        <Paper className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                <Tab label="Diffuse" />
                <Tab label="Roughness"/>
                <Tab label="Metalness"/>
                <Tab label="Normal"/>
            </Tabs>
        </Paper>
    );
}

export default TextureTabs;
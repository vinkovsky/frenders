import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChooseMap from "../viewport/ChooseMap/ChooseMap";
import ChooseLayer from "./ChooseLayer/ChooseLayer";
import Filters from "./Filters/Filters";
import ToolSettings from './ToolSettings/ToolSettings';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 'calc(100vh - 50px)',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        maxHeight: '100%',
      //  overflowY: 'scroll',
        paddingBottom: 0
    },
    listSection: {
        backgroundColor: 'inherit',
        width: '100%',
        marginRight: '0',
    },
    ul: {
        backgroundColor: 'inherit',
    },
    listHeader: {
        width: '100%',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.secondary.main,
        textTransform: 'uppercase',
        borderBottom: `1px solid #ffffff`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        minHeight: '48px !important',
        height: '48px !important',
    },
    accordion: {
        margin: `0 !important`
    },
    icon: {
        color: "white"
    },
    none: {
        display: "none"
    },
    block: {
        display: "block"
    }
}));

export default function UvwRightPanel({ active }) {
    const classes = useStyles();
    const list = [
        {
            name: `Слои`,
            component: <ChooseLayer />
        },
        {
            name: `Фильтры`,
            component: <Filters />
        },
        {
            name: `Настройка инструментов`,
            component: <ToolSettings />
        }
    ]

    return (
        <aside className={ active === 1 ? classes.block: classes.none } >
            <List className={classes.root} subheader={<li />}>
                <li key={`section-1`} className={classes.listSection}>
                    <ul className={classes.ul}>
                        {
                            list.map((item, i) => {
                                return (
                                    <li key={`component-${i}`}>
                                        <Accordion className={classes.accordion} defaultExpanded >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon className={classes.icon}/>}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                                className={classes.listHeader}
                                            >
                                                {item.name}
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {item.component}
                                            </AccordionDetails>
                                        </Accordion>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </li>
            </List>
        </aside>
    );
}

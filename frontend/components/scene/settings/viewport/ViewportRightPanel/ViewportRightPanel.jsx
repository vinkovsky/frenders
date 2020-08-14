import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, List  } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ChooseObject from '../ChooseObject/ChooseObject'
import ChooseMap from "../ChooseMap/ChooseMap";
import MaterialOptions from "../MaterialOptions/MaterialOptions";
import RenderSettings from "../RenderSettings/RenderSettings";

import { useStyles } from "./ViewportRightPanel.style";

export default function ViewportRightPanel({ envMaps, active }) {
    const classes = useStyles();
    const list = [
        {
            name: `Выбор объекта сцены`,
            component: <ChooseObject />
        },
        {
            name: `Выбор карты и настройка интенсивности`,
            component: <ChooseMap />
        },
        {
            name: `Доп. опции материала`,
            component: <MaterialOptions />
        },
        {
            name: `Настройки рендера`,
            component: <RenderSettings envMaps={ envMaps }/>
        }
    ]

    return (
        <aside className={ active === 0 ? classes.block: classes.none }>
            <List className={ classes.root } subheader={ <li /> }>
                <li className={ classes.listSection }>
                    <ul className={ classes.ul }>
                        {
                            list.map((item, index) => {
                                return (
                                    <li key={ `component-${index}` }>
                                        <Accordion className={ classes.accordion } defaultExpanded >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon className={ classes.icon }/>}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                                className={ classes.listHeader }
                                            >
                                                { item.name }
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                { item.component }
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
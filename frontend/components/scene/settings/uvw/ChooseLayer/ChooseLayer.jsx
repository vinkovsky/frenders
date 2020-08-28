import React, { useContext, useState, useEffect, useRef } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from "@material-ui/lab/TreeItem";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import LabelLockIcon from '@material-ui/icons/LockOpen';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import ViewportSceneContext from "../../../../../context/ViewportSceneContext";

import { useStyles } from "./ChooseLayer.style";
import {useRouter} from "next/router";
import Typography from "@material-ui/core/Typography";
import {useQuery} from "@apollo/react-hooks";
import ModelNameQuery from "../../../../../graphql/queries/dashboard/modelName";

export default function ChooseLayer() {
    const classes = useStyles();
    const router = useRouter();
    const [state, dispatch] = useContext(ViewportSceneContext);
    const [selected, setSelected] = useState(false);
    const [visible, setVisible] = useState(true);
    const models = useRef([]);

    const { data, loading, error, refetch } = useQuery(ModelNameQuery, {
        variables: {
            id: router.query.id
        }
    });

    let treeViewItems = [];
    if (state.getObjects.objects !== undefined) {
        const obj = state.getObjects.objects;
        for (let key in obj) {
            if(obj.hasOwnProperty(key)) {
                treeViewItems.push({id: (+key + 2).toString(), title: obj[key]});
            }
        }
    }

    useEffect(() => {
        if (!state.getCurrentObject) return;
        treeViewItems.map((item) => {
            if (item.title === state.getCurrentObject.name) {
                setSelected(item.id);
            }
        })
    }, [state.getCurrentObject])

    if (loading) {
        return <p>Загрузка</p>;
    }
    else {
        if(data === undefined) {
            refetch()
        }
    }

    const dataTreeView = [{
        id: '1',
        title: data.model.name,
        children: treeViewItems
    }];

    const renderLabel = item => {
        return (
            <div className={classes.labelRoot}
                 onClick={event => {
                     event.preventDefault();
                     if (item.title === data.model.name) {
                         setSelected('1');
                         dispatch({
                             type: 'getCurrentObject',
                             payload: {
                                 name: null,
                                 object: null
                             }
                         })
                     } else {
                         dispatch({
                             type: 'getCurrentObject',
                             payload: {
                                 name: item.title,
                                 object: state.getCurrentObject.object
                             }
                         })
                     }
                 }}
            >

                <div className={classes.icon}>
                    {
                        visible ?
                            <VisibilityIcon color="inherit" className={classes.labelEyeIcon} /> :
                            <VisibilityOffIcon color="inherit" className={classes.labelEyeIcon} />
                    }
                </div>
                <Typography variant="body2" className={classes.labelText}>
                    {item.title}
                </Typography>
                <LabelLockIcon color="inherit" className={classes.labelEyeIcon}/>
            </div>
        )
    };

    const renderItem = (item) => (
        <TreeItem
            nodeId={ item.id }
            label={ renderLabel(item) }
            key={ item.id }
            classes={{
                root: classes.root,
                content: classes.content,
                expanded: classes.expanded,
                group: classes.group,
                label: classes.label
            }}
        >
            {
                item.children && item.children.length > 0
                    ? item.children.map(renderItem)
                    : null
            }
        </TreeItem>
    );

    return (
        <TreeView
            className={ classes.root2 }
            defaultExpanded={['1']}
            selected={ selected }
            defaultCollapseIcon={ <ArrowDropDownIcon /> }
            defaultExpandIcon={ <ArrowRightIcon /> }
            defaultEndIcon={ <div style={{ width: 24 }} /> }
        >
            {
                dataTreeView.map(renderItem)
            }
        </TreeView>
    );
}


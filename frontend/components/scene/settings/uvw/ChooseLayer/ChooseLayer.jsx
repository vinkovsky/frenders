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
    const [selected, setSelected] = useState("1");
    const [visible, setVisible] = useState(true);
    const [activeObj, setActiveObj] = useState(null)
    const { data, loading, error, refetch } = useQuery(ModelNameQuery, {
        variables: {
            id: router.query.id
        }
    });
    let treeViewItems = [];

    if (state.getCanvas !== undefined) {
        if (!state.getCanvas) return;
        state.getCanvas.canvas._objects.map((obj, index) => {
            treeViewItems.push({
                id: (index + 2).toString(),
                title: obj.type + obj.id
            });
        })
    }

    useEffect(() => {
        state.getCanvas?.canvas.on('mouse:down', (e) => {
            setActiveObj(state.getCanvas?.canvas.getActiveObjects())
        })
        state.getCanvas?.canvas.on('mouse:up', (e) => {
            setActiveObj(state.getCanvas?.canvas.getActiveObjects())
        })

    }, [state.getCanvas])

    useEffect(() => {
        if (!(state.getCanvas && activeObj)) return;
        if(activeObj.length !== 0) {
            treeViewItems.map((item) => {
                activeObj.map(obj => {
                    if (item.title === (obj.type + obj.id)) {
                        setSelected(item.id);
                    }
                })
            })
        }
        else setSelected("1")
    }, [activeObj])

    const getObjectHandler = (e, id, title) => {
        state.getCanvas?.canvas.getObjects().forEach(function(o) {
            if((o.type + o.id) === title) {
                state.getCanvas?.canvas.setActiveObject(o);
                state.getCanvas?.canvas.renderAll()
                setSelected(id)
            }
        })
    }

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
        title: 'Холст',
        children: treeViewItems
    }];

    const renderLabel = item => {
        return (
            state.getCanvas && <div className={classes.labelRoot}
                 onClick={event => {
                     event.preventDefault();
                     getObjectHandler(event, item.id, item.title);
                     state.getCanvas.canvas.isDrawingMode = false;
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


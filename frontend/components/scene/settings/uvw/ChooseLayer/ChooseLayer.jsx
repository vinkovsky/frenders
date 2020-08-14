import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import labelLockIcon from '@material-ui/icons/LockOpen';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ViewportSceneContext from "../../../../../context/ViewportSceneContext";

const useTreeItemStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        color: theme.palette.text.secondary,
        '&:hover > $content': {
            backgroundColor: theme.palette.action.hover,
        }
    },
    content: {
        width: '100%',
        color: theme.palette.text.secondary,
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '$expanded > &': {
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    group: {
        marginLeft: 0,
        '& $label': {
            paddingLeft: theme.spacing(4),
        },
    },
    expanded: {},
    selected: {},
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
    },
    labelEyeIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
}));

function StyledTreeItem(props) {
    const classes = useTreeItemStyles();
    const { labelText, labelEyeIcon: LabelIcon, labelLockIcon: LockIcon, color, bgColor, ...other } = props;

    return (
        <TreeItem
            label={
                <div className={classes.labelRoot}>
                    <LabelIcon color="inherit" className={classes.labelEyeIcon} />
                    <Typography variant="body2" className={classes.labelText}>
                        {labelText}
                    </Typography>
                    <LockIcon color="inherit" className={classes.labelLockIcon} />
                </div>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            classes={{
                // root: classes.root,
                content: classes.content,
                expanded: classes.expanded,
                selected: classes.selected,
                group: classes.group,
                label: classes.label,
            }}
            {...other}
        />
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelEyeIcon: PropTypes.elementType.isRequired,
    labelLockIcon: PropTypes.elementType.isRequired,
    labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
    root: {
        height: 150,
        flexGrow: 1,
        maxWidth: 400,
    },
});

export default function ChooseLayer() {
    const classes = useStyles();
    const [state, dispatch] = useContext(ViewportSceneContext);

    let treeViewItems = [];

    if (state.getObjects.objects !== undefined) {
        const obj = state.getObjects.objects;
        for (let key in obj) {
            if(obj.hasOwnProperty(key)) {
                treeViewItems.push({id: (+key + 2).toString(), name: obj[key]});
            }
        }
    }

    const data = {
        id: '1',
        name: 'Стакан',
        children: treeViewItems
    };

    const renderTree = (nodes) => (
        <StyledTreeItem
            nodeId={nodes.id}
            labelText={nodes.name}
            labelEyeIcon={VisibilityIcon}
            labelLockIcon={labelLockIcon}
            color="#e3742f"
            bgColor="#fcefe3"
            key={nodes.id} >
            {
                Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null
            }
        </StyledTreeItem>
    );

    return (
        <TreeView
            className={classes.root}
            defaultExpanded={['1']}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
        >
            {
                renderTree(data)
            }
        </TreeView>
    );
}
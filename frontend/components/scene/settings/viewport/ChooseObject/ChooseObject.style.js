import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    root: {
        // width: '100%',
        color: theme.palette.text.secondary,
        // "&:hover > $content": {
        //     backgroundColor: theme.palette.action.hover
        // },
        // "&:focus > $content, &$selected > $content": {
        //     backgroundColor: "none",
        // },
        // "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label": {
        //     backgroundColor: "transparent"
        // }
    },
    root2: {
        height: '150px',
        flexGrow: 1
    },
    content: {
        // width: '100%',
        color: theme.palette.text.secondary,
        paddingRight: theme.spacing(1),
        // fontWeight: theme.typography.fontWeightMedium,
        "$expanded > &": {
            // fontWeight: theme.typography.fontWeightRegular,
        }
    },
    group: {
        marginLeft: 0,
        "& $content": {
            paddingLeft: theme.spacing(2)
        }
    },
    expanded: {},
    selected: {},
    label: {
        fontWeight: "inherit",
        color: "inherit"
    },
    labelRoot: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0.5, 0)
    },
    labelEyeIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
    icon: {
        display: 'flex'
    }
}));
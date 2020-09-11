import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.text.secondary,
    },
    root2: {
        height: '150px',
        flexGrow: 1,
        overflow: 'auto'
    },
    content: {
        color: theme.palette.text.secondary,
        paddingRight: theme.spacing(1),
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

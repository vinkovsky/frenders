import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 'calc(100vh - 50px)',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        maxHeight: '100%',
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
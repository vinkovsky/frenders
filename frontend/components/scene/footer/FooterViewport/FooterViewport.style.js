import { makeStyles } from "@material-ui/core/styles";

import theme from "../../../../public/js/theme";

export const useStyles = makeStyles({
    footer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '120px',
        background: theme.palette.primary.main,
        color: theme.palette.secondary.main,
        fontSize: '1rem',
    },
    root: {
        width: '100%',
        height: '100%',
        borderRadius: '0',
        background: theme.palette.secondary.main,
        opacity: 1
    },
    materials: {
        width: 'calc(100% - 280px)',
        height: '100%',
    },
    coords: {
        width: '280px',
        height: '100%',
        background: '#ffffff',
        borderLeft: '1px solid #ffffff'
    },
    header: {
        fontSize: '0.875rem',
        padding: '15px',
        background: theme.palette.primary.main,
        color: theme.palette.secondary.main,
        textTransform: 'uppercase',

    },
    content: {
        padding: 0,
        overflow: 'hidden',
        textAlign: 'center'
    },
    textField: {
        marginLeft: '3px',
        marginRight: '3px',
        width: '80px',
    },
    none: {
        display: "none"
    },
    block: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '70px',
        color: theme.palette.primary.main,
    }
});
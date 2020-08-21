import { makeStyles } from "@material-ui/core/styles";

import theme from "../../../public/js/theme";

export const useStyles = makeStyles({
    root: {
        width: '500px',
        margin: '-20px'
    },
    input: {
        width: '100%'
    },
    card: {
        padding: '25px'
    },
    title: {
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: '500'
    },
    error: {
        color: theme.palette.error.main,
        textAlign: 'center',
        marginTop: '0'
    },
    button: {
        padding: '10px',
        width: '100%'
    },
    paper: {
        padding: '20px',
        fontSize: '0.9rem',
        textAlign: 'center'
    },
    progress: {
        top: `calc(50% - 25px)`,
        left: `calc(50% - 25px)`,
        position: 'absolute'
    }
});

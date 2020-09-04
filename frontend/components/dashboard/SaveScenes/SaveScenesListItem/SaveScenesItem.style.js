import { makeStyles } from "@material-ui/core/styles";

import theme from '../../../../public/js/theme';

export const useStyles = makeStyles({
    root: {
        maxWidth: 230,
        height: 290,
        margin: '20px',
        textAlign: 'center'
    },
    action: {
        justifyContent: 'center',
    },
    actionArea: {
        padding: '10px'
    },
    button: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.secondary.main,
        padding: '7px 15px',
        textDecoration: 'none',
        borderRadius: '4px',
        marginTop: '1px',
        textTransform: 'uppercase',
        fontWeight: 500
    }
});

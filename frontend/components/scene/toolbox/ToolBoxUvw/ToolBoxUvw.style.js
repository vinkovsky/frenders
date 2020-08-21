import { makeStyles } from '@material-ui/core/styles';

import theme from '../../../../public/js/theme'

export const useStyles = makeStyles({
    group: {
        width: '100%'
    },
    button: {
        marginBottom: '5px',
        borderRadius: 0,
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.primary.main,
        border: `none !important`,
        '&:hover': {
            color: 'black'
        }
    },
    none: {
        display: "none"
    },
    block: {
        display: "block"
    }
});

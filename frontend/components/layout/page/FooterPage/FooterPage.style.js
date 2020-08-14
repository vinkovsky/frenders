import { makeStyles } from "@material-ui/core/styles";

import theme from "../../../../public/js/theme";

export const useStyles = makeStyles({
    footer: {
        borderTop: '1px solid #eaeaea',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100px',
        background: theme.palette.primary.main,
        color: theme.palette.secondary.main,
        fontSize: '1rem'
    }
});

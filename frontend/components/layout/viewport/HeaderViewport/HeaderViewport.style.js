import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    appbar: {
        position: 'initial',
        width: '100%',
        height: '50px',
        borderBottom: '1px solid #eaeaea'
    },
    toolbar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        fontSize: '1.8rem',
        textTransform: 'uppercase',
        fontWeight: '500'
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.secondary.main
    }
}));

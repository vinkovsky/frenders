import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: 'calc(100% - 16px)'
    },
    formGroup: {
        marginTop: theme.spacing(3),
    },
    input: {
        width: 55
    },
    label: {
        position: "initial",
        fontSize: "1.3rem",
        color: '#000000'
    },
    select: {
        marginTop: '4px !important',
    }
}));
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
    },
    color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: 'rgba(0,0,0,1)',
    },
    swatch: {
        padding: '12px',
        margin: '0 10px',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
        width: '38px',
        height: '38px'
    },
    popover: {
        position: 'absolute',
        bottom: '40px',
        left: '-20px',
        zIndex: '101',
    },
    cover: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
}));
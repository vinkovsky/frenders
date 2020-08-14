import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

export const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        minHeight: '100vh'
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${ drawerWidth }px)`,
            marginLeft: drawerWidth,
            height: '64px'
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: {
        ...theme.mixins.toolbar,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        minHeight: '100vh'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.up('md')]: {
            justifyContent: 'flex-end'
        }
    },
    section: {
        display: 'flex',
        height: 'calc(100vh - 64px)',
        overflow: 'auto'
    },
    title: {
        fontSize: '1.8rem',
        textTransform: 'uppercase',
        fontWeight: '500'
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.primary.main
    }
}));

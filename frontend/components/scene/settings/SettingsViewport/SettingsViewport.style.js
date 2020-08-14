import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 400;

export const useStyles = makeStyles({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        overflow: 'hidden'
    },
    drawerPaper: {
        width: drawerWidth,
        height: 'calc(100vh - 50px)',
        position: "absolute",
        top: "initial",
        overflowY: "scroll",
        overflowX: 'hidden'
    },
    none: {
        display: 'none',

    },
    block: {
        display: 'block',
    }
});

import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 58;

export const useStyles = makeStyles({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        height: 'calc(100vh - 50px)',
        position: "absolute",
        top: "initial",
        padding: '5px',
    },
});

import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
        primary: {
            // main: '#556cd6',
            main: '#190559',
        },
        secondary: {
            main: '#ffffff',
        },
        error: {
            main: '#ff0000',
        }
    },
});

export default theme
import { createTheme } from '@material-ui/core/styles'
import { teal, purple } from '@material-ui/core/colors'

const theme = createTheme( {
    palette: {
        type: 'dark',
        primary: teal,
        secondary: purple
    }
} )
export default theme
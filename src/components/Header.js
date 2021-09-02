import React from 'react'
import { AppBar, makeStyles, Typography } from '@material-ui/core'
import { Toolbar } from '@material-ui/core'
import { HeadsetMicOutlined } from '@material-ui/icons'


const useStyles = makeStyles( theme => ( {
    title: {
        marginLeft: 20
    }
} ) )

function Header () {
    const { title } = useStyles()
    return (
        <div>
            <AppBar position='fixed'>
                <Toolbar >
                    <HeadsetMicOutlined />
                    <Typography variant='h6' component='h1' className={title}>
                        Apollo Music Share
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Header
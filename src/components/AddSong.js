import { useMutation } from '@apollo/client'
import { TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent, DialogActions, makeStyles } from '@material-ui/core'
import { AddBox, Link } from '@material-ui/icons'
import React from 'react'
import ReactPlayer from 'react-player'
import SoundCloudPlayer from 'react-player/soundcloud'
import YouTubePlayer from 'react-player/youtube'
import { ADD_SONG } from './graphql/mutations'



const useStyles = makeStyles( theme => ( {
    container: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 20
    },
    urlInput: {
        margin: theme.spacing( 1 )
    },
    addSongBtn: {
        margin: theme.spacing( 1 )
    },
    dialogContent: {
        textAlign: 'center',
    },
    thumbnail: {
        width: '90%',
        borderRadius: '2%'
    }

} ) )

const DEFAULT_SONG = {

    duration: 0,
    title: '',
    artist: '',
    thumbnail: ''
}



function AddSong () {
    const [ addSong ] = useMutation( ADD_SONG )
    const [ dialog, setDialog ] = React.useState( false )
    const [ url, setUrl ] = React.useState( '' )
    const [ playable, setPlayable ] = React.useState( false )

    const [ song, setSong ] = React.useState( DEFAULT_SONG )

    React.useEffect( () => {
        const isPlayable = SoundCloudPlayer.canPlay( url ) || YouTubePlayer.canPlay( url )
        setPlayable( isPlayable )
    }, [ url ] )

    function handleChangeSong ( event ) {
        const { name, value } = event.target
        setSong( prevSong => ( {
            ...prevSong,
            [ name ]: value
        } ) )
    }

    async function handleSongEdit ( { player } ) {
        const nestedPlayer = player.player.player
        let songData
        if ( nestedPlayer.getVideoData )
        {
            songData = getYouTubeInfo( nestedPlayer )
        } else if ( nestedPlayer.getCurrentSound )
        {
            songData = await getSoundCloudInfo( nestedPlayer )
        }
        setSong( { ...songData, url } )
    }

    async function handleAddSong () {
        try
        {
            const { title, artist, thumbnail, duration } = song
            addSong( {
                variables: {
                    url: url.length > 0 ? url : null,
                    artist: artist.length > 0 ? artist : null,
                    title: title.length > 0 ? title : null,
                    duration: duration > 0 ? duration : null,
                    thumbnail: thumbnail.length > 0 ? thumbnail : null,
                }
            } )
            setSong( DEFAULT_SONG )
            setDialog( false )
            setUrl( '' )
        } catch ( err )
        {
            console.error( 'Error adding song', err )
        }

    }

    function getYouTubeInfo ( player ) {
        const duration = player.getDuration()
        const { title, author, video_id } = player.getVideoData()
        const thumbnail = `https://img.youtube.com/vi/${video_id}/0.jpg`
        return { title, duration, thumbnail, artist: author }
    }
    function getSoundCloudInfo ( player ) {
        return new Promise( resolve => {
            player.getCurrentSound( songData => {
                if ( songData )
                {
                    resolve( {
                        duration: Number( songData.duration / 1000 ),
                        title: songData.title,
                        artist: songData.user.username,
                        thumbnail: songData.artwork_url.replace( '-large', '-t500x500' )
                    } )
                }
            } )
        } )


    }

    const { container, addSongBtn, urlInput, dialogContent, thumbnailStyle } = useStyles()

    const { thumbnail, title, artist } = song
    return (
        <div className={container}>
            <Dialog
                className={dialogContent}
                open={dialog}
                // onClose={() => setDialog( false ).isRequired}
                onClose={false}
            >
                <DialogTitle>
                    Add song
                </DialogTitle>
                <DialogContent>
                    <img className={thumbnailStyle} src={thumbnail} alt='Video thumbnail' />
                    <TextField
                        onChange={handleChangeSong}
                        value={title}
                        type='text'
                        fullWidth={true}
                        margin='dense'
                        label='Title'
                        name='title'
                        required
                    />
                    <TextField
                        onChange={handleChangeSong}
                        value={artist}
                        type='text'
                        fullWidth={true}
                        margin='dense'
                        name='artist'
                        label='Artist'
                        required
                    />
                    <TextField
                        onChange={handleChangeSong}
                        value={thumbnail}
                        type='text'
                        fullWidth={true}
                        margin='dense'
                        name='thumbnail'
                        label='Song thumbnail'
                        required
                    />
                    <TextField
                        onChange={handleChangeSong}
                        value={url}
                        // type='text'
                        fullWidth={true}
                        margin='dense'
                        name='url'
                        label='URL'
                        required
                    />

                </DialogContent>
                <DialogActions >
                    <Button color='secondary' onClick={() => setDialog( false )}>Cancel</Button>
                    <Button onClick={handleAddSong} color='primary' variant='outlined' >Add song</Button>
                </DialogActions>
            </Dialog>
            <TextField
                onChange={( e ) => setUrl( e.target.value )}
                value={url}
                className={urlInput}
                type='url'
                fullWidth
                margin='normal'
                placeholder='Add Soundcloud or Youtube URL'
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <Link />
                        </InputAdornment>
                    )
                }}
            />
            <Button
                disabled={!playable}
                onClick={e => { setDialog( true ) }}
                className={addSongBtn}
                variant='contained' color='primary' endIcon={<AddBox />} >
                Add
            </Button>
            <ReactPlayer url={url} hidden onReady={handleSongEdit} />
        </div> )
}

export default AddSong
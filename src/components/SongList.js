import { useMutation, useSubscription } from '@apollo/client';
import {
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Typography,
  CardActions,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import { Pause, PlayArrow, Save } from '@material-ui/icons';
import React from 'react';
import { GET_SONGS } from './graphql/subscriptions';
import { SongContext } from '../App';
import { ADD_OR_REMOVE_FROM_QUEUE } from './graphql/mutations';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(3),
  },
  songInfoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  songContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  thumbnail: {
    objectFit: 'cover',
    width: 150,
    height: 150,
  },
  songInfo: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    minWidth: 100,
    maxHeight: 50,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

function SongList() {
  const { data, loading, error } = useSubscription(GET_SONGS);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          marginTop: 50,
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          marginTop: 50,
        }}
      >
        Error loading song lists.... Try again later
        {console.log(error)}
      </div>
    );
  }

  return (
    <div>
      {data.songs.map((song) => (
        <Song key={song.id} song={song} />
      ))}
    </div>
  );
}

function Song({ song }) {
  const classes = useStyles();
  const higherThanSm = useMediaQuery((theme) => theme.breakpoints.up('xs'));
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) =>
      localStorage.setItem('queue', JSON.stringify(data.addOrRemoveFromQueue)),
  });

  const { state, dispatch } = React.useContext(SongContext);
  const [currentSongPlaying, setCurrentSongPlaying] = React.useState(false);
  React.useEffect(() => {
    const isSongPlaying = state.isPlaying && song.id === state.song.id;
    setCurrentSongPlaying(isSongPlaying);
  }, [song.id, state.isPlaying, state.song.id]);

  function handleTogglePlay() {
    dispatch({ type: 'SET_SONG', payload: { song } });
    dispatch(state.isPlaying ? { type: 'PAUSE_SONG' } : { type: 'PLAY_SONG' });
  }

  function handleAddOrRemoveFromQueue() {
    addOrRemoveFromQueue({
      variables: { input: { ...song, __typename: 'Song' } },
    });
  }
  return (
    <Card className={classes.container}>
      <div className={classes.songInfoContainer}>
        <CardMedia image={song.thumbnail} className={classes.thumbnail} />
        <div className={classes.songInfo}>
          <CardContent>
            <Typography
              className={classes.title}
              style={{ display: higherThanSm ? '' : 'none' }}
              gutterBottom
              variant="h5"
              component="h2"
            >
              {song.title}
            </Typography>

            <Typography variant="body1" component="p" color="textSecondary">
              {song.artist}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton onClick={handleTogglePlay} size="small" color="primary">
              {currentSongPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton
              onClick={handleAddOrRemoveFromQueue}
              size="small"
              color="secondary"
            >
              <Save />
            </IconButton>
          </CardActions>
        </div>
      </div>
    </Card>
  );
}

export default SongList;

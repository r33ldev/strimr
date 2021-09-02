import { useQuery } from '@apollo/client';
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  makeStyles,
  Slider,
  Typography,
} from '@material-ui/core';
import {
  PauseSharp,
  PlayArrow,
  SkipNext,
  SkipPrevious,
} from '@material-ui/icons';
import React from 'react';
import ReactPlayer from 'react-player';
import { SongContext } from '../App';
import { GET_QUEUED_SONGS } from './graphql/queries';
import QueuedSongList from './QueuedSongList';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 15px',
  },
  content: {
    flex: '1 0 auto',
  },
  thumbnail: {
    width: 150,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

function SongPlayer() {
  const { state, dispatch } = React.useContext(SongContext);
  const [positionInQueue, setPositionInQueue] = React.useState(0);
  const { data } = useQuery(GET_QUEUED_SONGS);

  React.useEffect(() => {
    const songIndex = data.queue.findIndex((song) => song.id === state.song.id);
    setPositionInQueue(songIndex);
  }, [data.queue, state.song.id]);

  const [played, setPlayed] = React.useState(0);
  React.useEffect(() => {
    const nextSong = data.queue[positionInQueue + 1];
    if (played >= 0.99 && nextSong) {
      setPlayed(0);
      dispatch({ type: 'SET_SONG', payload: { song: nextSong } });
    }
  }, [data.queue, dispatch, played, positionInQueue]);

  const [seeking, setSeeking] = React.useState(false);

  const [playedSeconds, setPlayedSeconds] = React.useState(0);

  const reactPlayerRef = React.useRef();

  function handleTogglePlay() {
    dispatch(state.isPlaying ? { type: 'PAUSE_SONG' } : { type: 'PLAY_SONG' });
  }

  function handleProgressChange(event, newValue) {
    setPlayed(newValue);
  }

  function handleSeekingMouseDown() {
    setSeeking(true);
  }

  function handleSeekingMouseUp() {
    setSeeking(false);
    reactPlayerRef.current.seekTo(played);
  }

  function formatDuration(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }

  function handlePlayPrev() {
    const prevSong = data.queue[positionInQueue - 1];
    if (prevSong) {
      dispatch({ type: 'SET_SONG', payload: { song: prevSong } });
    }
  }

  function handlePlayNext() {
    const songNext = data.queue[positionInQueue + 1];
    if (songNext) {
      dispatch({ type: 'SET_SONG', payload: { song: songNext } });
    }
  }

  const classes = useStyles();
  return (
    <>
      <Card variant="outlined" className={classes.container}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography variant="h5" component="h3">
              {state.song.title}
            </Typography>

            <Typography variant="subtitle1" component="p" color="textSecondary">
              {state.song.artist}
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <IconButton>
              <SkipPrevious onClick={handlePlayPrev} />
            </IconButton>
            <IconButton onClick={handleTogglePlay}>
              {state.isPlaying ? (
                <PauseSharp className={classes.playIcon} />
              ) : (
                <PlayArrow className={classes.playIcon} />
              )}
            </IconButton>
            <IconButton>
              <SkipNext onClick={handlePlayNext} />
            </IconButton>
            <Typography variant="subtitle1" component="p" color="textSecondary">
              {formatDuration(playedSeconds)}{' '}
            </Typography>
          </div>
          <Slider
            onChange={handleProgressChange}
            onMouseDown={handleSeekingMouseDown}
            onMouseUp={handleSeekingMouseUp}
            value={played}
            type="range"
            min={0}
            max={1}
            step={0.01}
          />
        </div>
        <ReactPlayer
          ref={reactPlayerRef}
          onProgress={({ played, playedSeconds }) => {
            if (!seeking) {
              setPlayed(played);
              setPlayedSeconds(playedSeconds);
            }
          }}
          playing={state.isPlaying}
          url={state.song.url}
          hidden
        />
        <CardMedia
          className={classes.thumbnail}
          loading="lazy"
          image={state.song.thumbnail}
        />
      </Card>
      <QueuedSongList queue={data.queue} />
    </>
  );
}

export default SongPlayer;

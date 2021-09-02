import { useMutation } from '@apollo/client';
import { IconButton, makeStyles, useMediaQuery } from '@material-ui/core';
import { Avatar, Typography } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import React from 'react';
import { ADD_OR_REMOVE_FROM_QUEUE } from './graphql/mutations';

// const songList = {
//   title: 'On my way',
//   artist: 'Alan Walker',
//   thumbnail:
//     'https://images.hdqwalls.com/download/alan-walker-on-my-way-2x-1440x900.jpg',
//   url: 'https://www.youtube.com/watch?v=dhYOPzcsbGM',
// };
function QueuedSongList({ queue }) {
  // console.log(queue);
  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up('md'));
  return (
    greaterThanMd && (
      <div style={{ margin: '10px 0' }}>
        <Typography variant="button" color="textSecondary">
          Playlist ({queue.length})
        </Typography>
        <div
          style={{
            '::Webkitscrollbar?': {
              display: 'none',
            },
            maxHeight: 550,
            overflow: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {queue.map((song, id) => (
            <QueuedSong key={id} song={song} />
          ))}
        </div>
      </div>
    )
  );
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 64,
    height: 64,
  },
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  container: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridTemplateColumns: '50px auto 50px',
    gridGap: 40,
    alignItems: 'center',
    marginTop: 30,
  },
  songInfoContainer: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

function QueuedSong({ song }) {
  const classes = useStyles();

  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem('queue', JSON.stringify(data.addOrRemoveFromQueue));
    },
  });
  function handleQueuedSongDel() {
    const confirmDel = window.confirm(
      'Are you sure you want to remove song from playlist?'
    );
    confirmDel &&
      addOrRemoveFromQueue({
        variables: { input: { ...song, __typename: 'Song' } },
      });
  }

  return (
    <div className={classes.container}>
      <Avatar
        src={song.thumbnail}
        alt="Song thumbnail"
        className={classes.avatar}
      />
      <div className={classes.songInfoContainer}>
        <Typography variant="subtitle2" className={classes.text}>
          {song.title}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          className={classes.text}
        >
          {song.artist}
        </Typography>
      </div>
      <IconButton onClick={handleQueuedSongDel}>
        <Delete color="error" />
      </IconButton>
    </div>
  );
}

export default QueuedSongList;

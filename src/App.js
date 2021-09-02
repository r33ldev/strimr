import React from 'react';
import { Grid, Hidden, useMediaQuery } from '@material-ui/core';

import AddSong from './components/AddSong';
import Header from './components/Header';
import SongList from './components/SongList';
import SongPlayer from './components/SongPlayer';
import { useReducer } from 'react';
import songReducer from './components/reducer';

export const SongContext = React.createContext({
  song: {
    id: 'd6feea7f-29c5-41cb-a13f-ef38663e63b4',
    artist: 'Sia',
    title: 'The Greatest',
    duration: 352,
    url: 'https://www.youtube.com/watch?v=GKSRyLdjsPA',
    thumbnail: 'https://img.youtube.com/vi/GKSRyLdjsPA/0.jpg',
  },
  isPlaying: false,
});

function App() {
  const initialSong = React.useContext(SongContext);
  const [state, dispatch] = useReducer(songReducer, initialSong);

  const greaterThanSm = useMediaQuery((theme) => theme.breakpoints.up('sm'));
  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up('md'));

  return (
    <SongContext.Provider value={{ state, dispatch }}>
      <Hidden only="xs">
        <Header />
      </Hidden>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          md={7}
          style={{ paddingTop: greaterThanSm ? 80 : 10 }}
        >
          <AddSong />

          <SongList />
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          style={
            greaterThanMd
              ? {
                  position: 'fixed',
                  top: 70,
                  right: 0,
                  width: '100%',
                }
              : {
                  position: 'fixed',
                  left: 0,
                  bottom: 0,
                  width: '100%',
                }
          }
        >
          <SongPlayer />
        </Grid>
      </Grid>
    </SongContext.Provider>
  );
}

export default App;

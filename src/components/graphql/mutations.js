import { gql } from '@apollo/client';
export const ADD_OR_REMOVE_FROM_QUEUE = gql`
    mutation addOrRemoveFromQueue($input: SongInput!) {
    addOrRemoveFromQueue(input: $input) @client
  }
`;

export const ADD_SONG = gql`
  mutation addSong(
    $title: String
    $duration: Float
    $artist: String
    $thumbnail: String
    $url: String
  ) {
    insert_songs(
      objects: {
        artist: $artist
        duration: $duration
        thumbnail: $thumbnail
        url: $url
        title: $title
      }
    ) {
      affected_rows
    }
  }
`;

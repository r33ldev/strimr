import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { gql } from '@apollo/client';
import { GET_QUEUED_SONGS } from './queries';

const client = new ApolloClient({
  link: new WebSocketLink({
    uri: 'wss://apollo-music-share-1.hasura.app/v1/graphql',
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          contentType: 'application/json',
          'x-hasura-admin-secret': process.env.REACT_APP_HASURA_CLIENT_SECRET,
        },
      },
    },
  }),
  cache: new InMemoryCache(),
  typeDefs: gql`
    type Song {
      id: uuid
      title: String
      artist: String
      duration: Float
      thumbnail: String
      url: String
    }
    input SongInput {
      id: uuid
      title: String
      artist: String
      duration: Float
      thumbnail: String
      url: String
    }
    type Query {
      queue: [Song]!
    }
    type Mutation {
      addOrRemoveFromQueue(input: SongInput!): [Song]!
    }
  `,
  resolvers: {
    Mutation: {
      addOrRemoveFromQueue: (_, { input }, { cache }) => {
        const queryResult = cache.readQuery({
          query: GET_QUEUED_SONGS,
        });
        if (queryResult) {
          const { queue } = queryResult;
          const isInQueue = queue.some((song) => song.id === input.id);
          const newQueue = isInQueue
            ? queue.filter((song) => song.id !== input.id)
            : [...queue, input];
          cache.writeQuery({
            query: GET_QUEUED_SONGS,
            data: { queue: newQueue },
          });
          return newQueue;
        }
        return [];
      },
    },
  },
});

const hasQueue = Boolean(localStorage.getItem('queue'));

const data = {
  queue: hasQueue ? JSON.parse(localStorage.getItem('queue')) : [],
};

client.writeData({ data });

export default client;

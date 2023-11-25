import {ApolloClient, InMemoryCache} from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://192.168.0.105:3001/graphql',
  cache: new InMemoryCache(),
});

export default client;

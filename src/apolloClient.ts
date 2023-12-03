import {ApolloClient, InMemoryCache} from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://5.39.222.149:3001/graphql',
  cache: new InMemoryCache(),
});

export default client;

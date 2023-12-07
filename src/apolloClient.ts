import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://learn.dreamstack.com/graphql',
  cache: new InMemoryCache(),
});

export default client;

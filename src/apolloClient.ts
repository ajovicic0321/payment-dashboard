import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { API_CONFIG } from './constants';

const httpLink = new HttpLink({
  uri: API_CONFIG.ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: API_CONFIG.API_KEY,
    }
  }
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
  },
});

export default client;

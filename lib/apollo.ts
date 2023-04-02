import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { log } from 'next-axiom'
import * as Sentry from "@sentry/nextjs";

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (networkError) {
		log.error(`[Network error]: ${networkError}`);
		Sentry.captureException(networkError);
	}
	if (graphQLErrors)
		graphQLErrors.forEach(({ message, locations, path }) => {
			log.error(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
			)
			Sentry.captureException(graphQLErrors);
		}
		);
});

const httpLink = new HttpLink({ uri: '/api/graphql' })


const apolloClient = new ApolloClient({
	link: from([errorLink, httpLink]),
	cache: new InMemoryCache(),
});

export default apolloClient;

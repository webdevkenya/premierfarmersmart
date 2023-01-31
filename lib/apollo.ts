import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { log } from 'next-axiom'
// import * as Sentry from "@sentry/nextjs";

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.forEach(({ message, locations, path }) => {

			log.error(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
			)
			throw new Error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);

			// Sentry.captureException(graphQLErrors);
		}
		);
	if (networkError) {
		log.error(`[Network error]: ${networkError}`);
		// Sentry.captureException(networkError);
		throw new Error(`[Network error]: ${networkError}`);


	}
});

const httpLink = new HttpLink({ uri: 'http://localhost:3000/api/graphql' })


const apolloClient = new ApolloClient({
	link: from([errorLink, httpLink]),
	cache: new InMemoryCache(),
});

export default apolloClient;

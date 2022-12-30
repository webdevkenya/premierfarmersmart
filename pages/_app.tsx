import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ApolloProvider } from '@apollo/client';
import { ShoppingCartProvider } from '../contexts/ShoppingCartContext';
import apolloClient from '../lib/apollo';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<ShoppingCartProvider>
				<Layout>
					<ApolloProvider client={apolloClient}>
						<Component {...pageProps} />
					</ApolloProvider>
				</Layout>
			</ShoppingCartProvider>
		</UserProvider>
	);
}

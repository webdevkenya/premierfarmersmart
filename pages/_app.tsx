import '../styles/globals.css';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ApolloProvider } from '@apollo/client';
import { ShoppingCartProvider } from '../contexts/ShoppingCartContext';
import { ModalProvider } from '../contexts/ModalContext';
import apolloClient from '../lib/apollo';
import Layout from '../components/Layout';
import { AddressProvider } from '../contexts/AddressContext';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout =
		Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

	return (
		<UserProvider>
			<ShoppingCartProvider>
				<AddressProvider>
					<ModalProvider>
						<ApolloProvider client={apolloClient}>
							{getLayout(
								<Component {...pageProps} />
							)}
						</ApolloProvider>
					</ModalProvider>
				</AddressProvider>
			</ShoppingCartProvider>
		</UserProvider>
	);
}

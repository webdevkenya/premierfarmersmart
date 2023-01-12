import { Tab } from '@headlessui/react';

import { gql, useQuery } from '@apollo/client';
import { Toaster } from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

const AllProductsQuery = gql`
	query allProductsQuery($first: Int, $after: String) {
		products(first: $first, after: $after) {
			pageInfo {
				endCursor
				hasNextPage
			}
			edges {
				cursor
				node {
					id
					name
					price
					price_type
					category
					image
				}
			}
		}
	}
`;

const navigation = {
	categories: [
		{
			name: 'Fruits',
		},
		{
			name: 'Veggies',
		},
		{
			name: 'Cereals',
		},
	],
};

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

export default function Products() {
	const { data, loading, error, fetchMore } = useQuery(AllProductsQuery, {
		variables: { first: 12 },
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Oops something went wrong ... {error.message}</p>;
	const { endCursor, hasNextPage } = data.products.pageInfo;

	return (
		<>
			<Toaster />
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="border-b border-gray-200">
					<div className="flex h-16 items-center">
						<div className="hidden lg:ml-8 lg:block lg:self-stretch">
							<Tab.Group>
								<Tab.List className="flex h-full space-x-8">
									{navigation.categories.map((category) => (
										<Tab
											key={category.name}
											className={({ selected }) =>
												classNames(
													selected
														? 'border-gray-800 text-gray-800'
														: 'border-transparent text-gray-300 hover:text-gray-800',
													'relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out'
												)
											}
										>
											{category.name}
										</Tab>
									))}
								</Tab.List>
								<Tab.Panels className="mt-2">
									{navigation.categories.map(
										(category, idx) => (
											<Tab.Panel
												key={idx}
												className={classNames(
													'rounded-xl bg-white p-3'
												)}
											>
												<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
													{data?.products.edges.map(
														({ node }) => (
															<ProductCard
																key={node.id}
																product={node}
															/>
														)
													)}
												</ul>
												<div>
													{hasNextPage ? (
														<button
															className="px-4 py-2 bg-gray-800 text-gray-400 rounded-md my-10 hover:text-white"
															onClick={() => {
																fetchMore({
																	variables: {
																		after: endCursor,
																	},
																	updateQuery:
																		(
																			prevResult,
																			{
																				fetchMoreResult,
																			}
																		) => {
																			fetchMoreResult.products.edges =
																				[
																					...prevResult
																						.products
																						.edges,
																					...fetchMoreResult
																						.products
																						.edges,
																				];
																			return fetchMoreResult;
																		},
																});
															}}
														>
															more
														</button>
													) : (
														<p className="my-10 text-center font-medium">
															You have reached the
															end!
														</p>
													)}
												</div>
											</Tab.Panel>
										)
									)}
								</Tab.Panels>
							</Tab.Group>
						</div>
					</div>
				</div>
			</div>
			{/* </header> */}
		</>
	);
}

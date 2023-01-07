import { gql, useQuery } from '@apollo/client';
import ProductCard from '../components/ProductCard';
import { Toaster } from 'react-hot-toast';

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

export default function Products() {
	const { data, loading, error, fetchMore } = useQuery(AllProductsQuery, {
		variables: { first: 12 },
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Oops something went wrong ... {error.message}</p>;
	const { endCursor, hasNextPage } = data.products.pageInfo;

	return (
		<div>
			<Toaster />
			<div className="container mx-auto max-w-5xl my-20">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{data?.products.edges.map(({ node }) => (
						<ProductCard key={node.id} product={node} />
					))}
				</div>
				<div>
					{hasNextPage ? (
						<button
							className="px-4 py-2 bg-blue-500 text-white rounded my-10"
							onClick={() => {
								fetchMore({
									variables: { after: endCursor },
									updateQuery: (
										prevResult,
										{ fetchMoreResult }
									) => {
										fetchMoreResult.products.edges = [
											...prevResult.products.edges,
											...fetchMoreResult.products.edges,
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
							You have reached the end!
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

import { ReactElement } from 'react'
import { gql, useQuery } from '@apollo/client';
import ProductCard from '../../components/ProductCard';
import { useRouter } from 'next/router'
import Layout from '../../components/Layout';
import ProductTabs from '../../components/Layout/ProductTabs';

const GetProductsByCategoryQuery = gql`
	query GetProductsByCategoryQuery($category: String, $first: Int, $after: String) {
		getProductsByCategory(category: $category, first: $first, after: $after) {
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

function Products() {
    const router = useRouter()
    const { category } = router.query

    const { data, loading, error, fetchMore } = useQuery(GetProductsByCategoryQuery, {
        variables: { category, first: 12 },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Oops something went wrong ... {error.message}</p>;
    const { endCursor, hasNextPage } = data?.getProductsByCategory.pageInfo;

    return (
        <>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {data?.getProductsByCategory.edges.map(
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
                                        fetchMoreResult.getProductsByCategory.edges =
                                            [
                                                ...prevResult
                                                    .getProductsByCategory
                                                    .edges,
                                                ...fetchMoreResult
                                                    .getProductsByCategory
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

        </ >
    );
}

Products.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <ProductTabs>{page}</ProductTabs>
        </Layout>
    );
};

export default Products
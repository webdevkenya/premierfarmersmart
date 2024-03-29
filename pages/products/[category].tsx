import { ReactElement } from 'react'
import { gql, useQuery } from '@apollo/client';
import ProductCard from '../../components/ProductCard';
import { useRouter } from 'next/router'
import Layout from '../../components/Layout';
import ProductTabs from '../../components/Layout/ProductTabs';
import ProductSkeleton from '../../components/Layout/ProductSkeleton';

const GetProductsByCategoryQuery = gql`
	query GetProductsByCategoryQuery($category: String, $first: Int, $after: String) {
		products(category: $category, first: $first, after: $after) {
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

    if (loading) return <ProductSkeleton />
    if (error) return <div className='min-h-[80vh] flex justify-center items-center'><p>Oops something went wrong ... {error.message}</p></div>;
    const { endCursor, hasNextPage } = data?.products.pageInfo;

    return (
        <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
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
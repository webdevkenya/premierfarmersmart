import React, { ReactElement } from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import Layout from '../../components/Layout';
import AdminSideBar from '../../components/Layout/AdminSideBar';
import { gql, useQuery, useMutation } from '@apollo/client';
import prisma from '../../lib/prisma'
import ModalWrapper from '../../components/ModalWrapper'
import ProductForm from '../../components/ProductForm';
import { toast, Toaster } from 'react-hot-toast';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { CartCountQuery } from '../../components/Layout/Header';
import { log } from 'next-axiom';

export const GetAllProductsQuery = gql`
	query getAllProductsQuery($first: Int, $after: String,$orderBy: [ProductOrderByInput!]) {
		products(first: $first, after: $after,orderBy: $orderBy) {
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
				}
			}
		}
	}
`;

const DeleteProductMutation = gql`
	mutation DeleteProduct($id: String!) {
		deleteProduct(id: $id) {
			id
		}
	}
`;
const ManageProducts = () => {

    const { data, loading, error, fetchMore } = useQuery(GetAllProductsQuery, {
        variables: {
            first: 12,
            orderBy: [{
                name: "asc"
            }
            ]
        },
    });

    const [deleteProduct, { error: deleteProductError }] = useMutation(
        DeleteProductMutation
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <div className='min-h-[80vh] flex justify-center items-center'><p>Oops something went wrong ... {error.message}</p></div>;
    const { endCursor, hasNextPage } = data.products.pageInfo;

    const handleDeleteProduct = (id) => {
        try {
            const variables = { id };
            toast.promise(
                deleteProduct({
                    variables,
                    refetchQueries: [{ query: GetAllProductsQuery }, 'GetAllProducts', { query: CartCountQuery }, 'CartCount'],
                }),
                {
                    loading: 'Deleting product..',
                    success: 'Product successfully deleted!🎉',
                    error: `Something went wrong 😥 Please try again -  ${deleteProductError}`,
                }
            );
        } catch (error) {
            log.error(error);
        }
    };


    return (
        <>
            <Toaster />
            <h1 className="font-bold text-2xl">Manage Products</h1>
            <div className="mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className='flex items-center justify-between p-4'>
                    <div className="bg-white dark:bg-gray-900">
                        <label htmlFor="table-search" className="sr-only">Search</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <MagnifyingGlassIcon className='w-4 h-4' />
                            </div>
                            <input type="text" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for products" />
                        </div>
                    </div>

                    <ModalWrapper id="create-product" title="Create Product">
                        <ProductForm />
                    </ModalWrapper>
                </div>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4 hidden">
                                <div className="flex items-center">
                                    <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Product name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price Type
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.products.edges.map(({ node: { id, name, price, price_type, category } }) => (
                                <tr key={id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="w-4 p-4 hidden">
                                        <div className="flex items-center">
                                            <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                        </div>
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {name}
                                    </th>

                                    <td className="px-6 py-4">
                                        {category}
                                    </td>
                                    <td className="px-6 py-4">
                                        {`KES ${price}`}
                                    </td>
                                    <td className="px-6 py-4">
                                        {price_type}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleDeleteProduct(id)} className="font-medium text-red-600 dark:text-blue-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
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

        </>
    );
};

ManageProducts.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <AdminSideBar>{page}</AdminSideBar>
        </Layout>
    );
};

export default ManageProducts;

export const getServerSideProps = async ({ req, res }) => {
    const session = await getSession(req, res);

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/api/auth/login',
            },
            props: {},
        };
    }

    const user = await prisma.user.findUnique({
        select: {
            email: true,
            role: true,
        },
        where: {
            email: session.user.email,
        },
    });

    if (user?.role !== 'ADMIN') {
        return {
            redirect: {
                permanent: false,
                destination: '/404',
            },
            props: {},
        };
    }

    return {
        props: {},
    };
};

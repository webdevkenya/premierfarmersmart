import React, { ReactElement, Fragment } from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../lib/prisma';
import Layout from '../../components/Layout';
import AdminSideBar from '../../components/Layout/AdminSideBar';
import { gql, useQuery, useMutation } from '@apollo/client';
import { toast, Toaster } from 'react-hot-toast';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Disclosure } from '@headlessui/react'
import OrderDetails from '../../components/OrderDetails'
import { log } from 'next-axiom';

const GetAllOrdersQuery = gql`
	query GetAllOrders($first: Int, $after: String) {
		orders(first: $first, after: $after) {
			pageInfo {
				endCursor
				hasNextPage
			}
			edges {
				cursor
				node {
					id
                    createdAt
                    deliveryStart
                    deliveryStop
                    deliveryStatus
                    shippingAddress{
                    first_name
                    last_name
                    specific_address
                        location{
                            county
                            town
                            name
                        }
                    }
                    amountPayable
                    amountPaid
					items{
                        id
                        name
                        price
                        priceType
                        quantity
                        image
                    }
				}
			}
		}
	}
`;

const DispatchOrderMutation = gql`
	mutation DispatchOrder($id: String!) {
		dispatch(id: $id) {
			id
            deliveryStatus
		}
	}
`;

const MarkAsDeliveredMutation = gql`
	mutation MarkAsDelivered($id: String!) {
		markDelivered(id: $id) {
			id
            deliveryStatus
		}
	}
`;

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const ManageOrders = () => {
    const { data, loading, error, fetchMore } = useQuery(GetAllOrdersQuery, {
        variables: { first: 12 },
    });

    const [dispatch, { error: dispatchError }] = useMutation(
        DispatchOrderMutation
    );
    const [markDelivered, { error: markDeliveredError }] = useMutation(
        MarkAsDeliveredMutation
    );


    if (loading) return <p>Loading...</p>;
    if (error) return <div className="min-h-[80vh] flex justify-center items-center"><p>Oops something went wrong ... {error.message}</p></div>;
    const { endCursor, hasNextPage } = data.orders.pageInfo;

    const handleDispatchOrder = (id) => {
        try {
            const variables = { id };
            toast.promise(
                dispatch({
                    variables,
                    refetchQueries: [{ query: GetAllOrdersQuery }, 'GetAllOrders'],
                }),
                {
                    loading: 'Dispatching Order..',
                    success: 'Order successfully dispatched!🎉',
                    error: `Something went wrong 😥 Please try again -  ${dispatchError}`,
                }
            );
        } catch (error) {
            log.error(error);
        }
    };

    const handleMarkAsDelivered = (id) => {
        try {
            const variables = { id };
            toast.promise(
                markDelivered({
                    variables,
                    refetchQueries: [{ query: GetAllOrdersQuery }, 'GetAllOrders'],
                }),
                {
                    loading: 'Marking order as delivered..',
                    success: 'Order successfully marked as delivered!🎉',
                    error: `Something went wrong 😥 Please try again -  ${markDeliveredError}`,
                }
            );
        } catch (error) {
            log.error(error);
        }
    };

    return (
        <>
            <Toaster />
            <h1 className="font-bold text-2xl">Manage Orders</h1>
            <div className="mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className='flex items-center justify-between p-4'>
                    <div className="bg-white dark:bg-gray-900">
                        <label htmlFor="table-search" className="sr-only">Search</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <MagnifyingGlassIcon className='w-4 h-4' />
                            </div>
                            <input type="text" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for orders" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="status-filter" className="block text-gray-700">
                            Filter by delivery status:
                        </label>
                        <select
                            id="status-filter"
                            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg"
                        // value={statusFilter}
                        // onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="dispatched">Pending</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
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

                            </th>
                            <th scope="col" className="px-6 py-3">
                                Order ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Customer
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Order Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Delivery Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.orders.edges.map(({ node: { id, items, shippingAddress: { first_name, last_name, specific_address, location }, createdAt, deliveryStatus, amountPaid, amountPayable, deliveryStart, deliveryStop } }) => (

                                <Disclosure as={Fragment} key={id} >
                                    {({ open }) => (
                                        <>
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <Disclosure.Button as={Fragment} >
                                                    <td className="w-4 p-4 cursor-pointer">
                                                        <ChevronDownIcon className={classNames(open ? 'rotate-180' : 'rotate-0', 'w-5 h-5 transition duration-150 ease-in-out')} />
                                                    </td>
                                                </Disclosure.Button>
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {id}
                                                </th>

                                                <td className="px-6 py-4">
                                                    {`${first_name} ${last_name}`}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {format(+createdAt, 'MMM d, y | kk:m')}
                                                </td>
                                                <td className={
                                                    classNames(
                                                        deliveryStatus === "PENDING" ? 'text-red-600' : deliveryStatus === 'DISPATCHED' ? 'text-sky-700' : 'text-green-800', 'px-6 py-4 font-extrabold'
                                                    )
                                                }>
                                                    {deliveryStatus}
                                                </td>
                                                <td className="px-6 py-4 flex justify-between">
                                                    <button
                                                        className={classNames(
                                                            deliveryStatus === "PENDING"
                                                                ? 'cursor-pointer text-sky-700 hover:underline'
                                                                : 'cursor-not-allowed text-gray-400',
                                                            'font-medium'
                                                        )}
                                                        onClick={() => handleDispatchOrder(id)}
                                                        disabled={deliveryStatus === "DISPATCHED"}
                                                    >
                                                        Dispatch
                                                    </button>
                                                    <button
                                                        className={classNames(
                                                            deliveryStatus !== "DELIVERED"
                                                                ? 'cursor-pointer text-green-800 hover:underline'
                                                                : 'cursor-not-allowed text-gray-400',
                                                            'font-medium'
                                                        )} onClick={() => handleMarkAsDelivered(id)}
                                                        disabled={deliveryStatus === "DELIVERED"}
                                                    >
                                                        Mark as delivered
                                                    </button>
                                                </td>
                                            </tr>

                                            <Disclosure.Panel as="tr" className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                <td></td>
                                                <td className='px-6 py-4' colSpan={5}>
                                                    <OrderDetails order={{
                                                        id,
                                                        createdAt,
                                                        items,
                                                        specific_address,
                                                        location,
                                                        deliveryStart,
                                                        deliveryStop,
                                                        deliveryStatus,
                                                        amountPayable,
                                                        amountPaid
                                                    }} />
                                                </td>
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>

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
                                    fetchMoreResult.orders.edges = [
                                        ...prevResult.orders.edges,
                                        ...fetchMoreResult.orders.edges,
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

ManageOrders.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <AdminSideBar>{page}</AdminSideBar>
        </Layout>
    );
};


export default ManageOrders;

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

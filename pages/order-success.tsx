import Link from 'next/link';
import { getSession } from '@auth0/nextjs-auth0';
import OrderReceipt from '../components/OrderReceipt';
import prisma from '../lib/prisma';
import { log } from 'next-axiom';

const OrderSuccess = ({ order }) => {
	log.info('order from order success page', order)

	return (
		<div className="max-w-4xl block mx-auto text-center">
			<h1 className="text-3xl font-bold mt-16">Thank you for your order!</h1>
			<OrderReceipt order={order} />
			<Link
				className="px-4 py-2 bg-gray-800 text-center text-white rounded-md hover:bg-gray-900"
				href="/"
			>
				Continue Shopping ?
			</Link>
		</div>
	);
};

export default OrderSuccess;

export const getServerSideProps = async ({ req, res, query }) => {
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

	const { stkResponseId } = query;

	if (!stkResponseId) {
		return {
			redirect: {
				permanent: false,
				destination: '/404',
			},
			props: {},
		};
	}

	const order = await prisma.order.findUnique({
		where: {
			stkResponseId,
		},
		select: {
			id: true,
			createdAt: true,
			shippingAddress: {
				select: {
					specific_address: true,
					Location: {
						select: {
							name: true,
							county: true,
							town: true,
							shipping: true
						}
					}
				}
			},
			items: {
				select: {
					id: true,
					name: true,
					quantity: true,
					price: true,
					priceType: true
				}
			}
		},
	})

	if (!order) {
		return {
			redirect: {
				permanent: false,
				destination: '/404',
			},
			props: {},
		};
	}

	return {
		props: { order },
	};
};

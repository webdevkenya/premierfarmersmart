import React, { ReactElement } from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../lib/prisma';
import { CldImage } from 'next-cloudinary';
import Layout from '../../components/Layout';
import ProfileSideBar from '../../components/Layout/ProfileSideBar';
import { format } from 'date-fns';
import { log } from 'next-axiom'

const Orders = ({ orders }) => {
	log.info('orders from orders page', orders)

	return (
		<>
			<h1 className="font-bold text-2xl">Order History</h1>
			{orders.map(
				({ id, items, updatedAt, amountPayable }) => (
					<div
						key={id}
						className="mt-4 bg-white border border-gray-100 rounded-lg shadow p-6 mb-4  ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-200 hover:outline-none hover:ring-2
					 -space-x-2 overflow-hidden"
					>
						<div className="text-gray-700 font-bold text-sm md:text-base">{`Order- ${id}`}</div>
						<div className="px-2 text-gray-300 font-bold text-xs md:text-sm">
							{format(updatedAt, 'MMM d, y | kk:m')}
						</div>
						{items.map(({ id, image }) => (
							<CldImage
								key={id}
								className="inline-block rounded-full ring-2 ring-white"
								src={image}
								alt="product"
								width={52}
								height={52}
							/>
						))}
						<div className="flex justify-between px-2">
							{/* <div>
								<div className="text-gray-300 text-xs md:text-sm">
									Status
								</div>
								<div className="text-gray-700 font-bold text-sm md:text-base ">
									{status}
								</div>
							</div> */}
							<div>
								<div className="text-gray-300 text-xs md:text-sm">
									Products
								</div>
								<div className="text-gray-700 font-bold text-sm md:text-base">
									{`${items.length} product(s)`}
								</div>
							</div>
							<div>
								<div className="text-gray-300 text-xs md:text-sm">
									Order Total
								</div>
								<div className="text-gray-700 font-bold text-sm md:text-base">
									{`KES ${amountPayable}`}
								</div>
							</div>
						</div>
					</div>
				)
			)}
		</>
	);
};

Orders.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<ProfileSideBar>{page}</ProfileSideBar>
		</Layout>
	);
};

export default Orders;

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
			orders: {
				select: {
					id: true,
					updatedAt: true,
					amountPayable: true,
					items: {
						select: {
							id: true,
							image: true,
						},
					},
				},
			},
		},
		where: {
			email: session.user.email,
		},
	});

	return {
		props: { orders: user.orders },
	};
};

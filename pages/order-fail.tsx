import Link from 'next/link';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../lib/prisma';
import Image from 'next/image';

interface Props {
	stkResponse: {
		ResultCode: number;
		ResultDesc: string;
	}
}

const OrderFail = ({ stkResponse }: Props) => {

	console.log('order-fail', stkResponse);

	const { ResultCode, ResultDesc } = stkResponse
	console.log('order-fail', ResultCode, ResultDesc);

	return (
		<div className="h-screen px-4 mt-16">
			<Image
				className="h-auto w-1/4 mx-auto"
				src="/warning.svg"
				alt="className"
				width={525}
				height={418}
			/>
			<h1 className="text-3xl font-bold text-center my-4">Oops! Payment Failed </h1>
			<h3 className="text-gray-600 text-2xl text-center mb-4">
				We have some bad news. Your payment transaction failed
			</h3>
			<p className="text-gray-600 text-lg font-bold text-center mb-4">
				{ResultDesc}
			</p>

			<Link
				className="block mx-auto w-1/6 px-4 py-2 bg-gray-800 text-center text-white rounded-full hover:bg-gray-900"
				href="/checkout">
				Try again?
			</Link>

			<p className="text-gray-600  text-center my-2">
				Need help? contact us on &nbsp;
				<Link className='text-sky-600 font-bold' href="mailto:support@premierfarmersmart.co.ke">
					support@premierfarmersmart.co.ke
				</Link>
			</p>
		</div>
	);
};

export default OrderFail;

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

	const stkResponse = await prisma.stkResponse.findUnique({
		where: {
			id: stkResponseId,
		}, select: {
			ResultCode: true,
			ResultDesc: true,
		}
	})

	if (!stkResponse) {
		return {
			redirect: {
				permanent: false,
				destination: '/404',
			},
			props: {},
		};
	}

	return {
		props: { stkResponse },
	};
};

import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSession } from '@auth0/nextjs-auth0';

const Success = () => {
	const router = useRouter();
	const { orderNumber } = router.query;
	return (
		<div className="min-h-screen flex flex-col  px-4 mt-16 items-center">
			{/* <div className="bg-white rounded-lg shadow-lg p-8"> */}
			<h1 className="text-3xl font-bold text-center mb-4">
				Order Success
			</h1>
			<p className="text-gray-600 text-center mb-4">
				{`Your order has been successfully placed! Your order number is
				${orderNumber}`}
			</p>
			<Link
				className=" w-2/3 px-4 py-2 bg-gray-800 text-center text-white rounded-full hover:bg-gray-900"
				href="/"
			>
				Continue Shopping ?
			</Link>
			{/* </div> */}
		</div>
	);
};

export default Success;

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

	const { orderNumber } = query;

	if (!orderNumber) {
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

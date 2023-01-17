import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AddressBook from '../components/AddressBook';
import OrderSummary from '../components/OrderSummary';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useRouter } from 'next/router';
import { toast, Toaster } from 'react-hot-toast';

const CreateOrderMutation = gql`
	mutation (
		$products: [String]!
		$amountPayable: Int!
		$shippingCost: Int!
		$cartTotal: Int!
		$mpesaNumber: String!
		$checkoutrequestid: String!
	) {
		createOrder(
			products: $products
			amountPayable: $amountPayable
			shippingCost: $shippingCost
			mpesaNumber: $mpesaNumber
			cartTotal: $cartTotal
			checkoutrequestid: $checkoutrequestid
		) {
			id
			amount_payable
			mpesa_number
			checkoutrequestid
		}
	}
`;

const orderQuery = gql`
	query GetPaymentStatus($id: String!) {
		order(id: $id) {
			status
			id
			payment {
				resultdesc
			}
		}
	}
`;

interface IFormInputs {
	mpesaNumber: string;
}

const phoneNumberRegex = /^(01|07)\d{8}$/;

const schema = yup
	.object({
		mpesaNumber: yup
			.string()
			.required('please input the mpesa number')
			.matches(phoneNumberRegex, 'Please use a valid phone number'),
	})
	.required();

const Checkout = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<IFormInputs>({
		resolver: yupResolver(schema),
	});

	const [createOrder] = useMutation(CreateOrderMutation, {
		onCompleted: () => reset(),
	});

	const [getPaymentStatus, { data: statusQuery, stopPolling }] =
		useLazyQuery(orderQuery);

	const { items, amountPayable, getTotal, shipping } = useShoppingCart();

	const onSubmit = async (data: IFormInputs) => {
		try {
			const { mpesaNumber } = data;
			const amount = amountPayable();
			const cartTotal = getTotal();

			const res = await fetch('/api/stk', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					amount: 1,
					phoneNumber: mpesaNumber,
				}),
			});
			if (res.status !== 200) {
				throw new Error('Payment failed');
			}
			const result = await res.json();
			console.log('result', result);
			toast.success(
				'Payment initiated - you will receive a prompt on your phone'
			);

			const variables = {
				products: items.map(({ id }) => id),
				amountPayable: amount,
				shippingCost: shipping,
				cartTotal,
				mpesaNumber,
				checkoutrequestid: result.CheckoutRequestID,
			};
			const order = await createOrder({ variables });
			console.log('order', order);
			if (!order) {
				throw new Error('could not create order');
			}

			const { startPolling } = await getPaymentStatus({
				variables: { id: order.data.createOrder.id },
			});

			startPolling(1000);
		} catch (error) {
			console.error(error);
		}
	};

	if (statusQuery?.order?.status === 'PAID') {
		stopPolling();
		router.push({
			pathname: '/success',
			query: {
				orderNumber: statusQuery.order.id,
			},
		});
	}

	if (statusQuery?.order?.status === 'FAILED') {
		stopPolling();
		console.log('result', statusQuery.order.payment.resultdesc);
		router.push('/cancelled');
	}

	return (
		<div className="max-w-[95%] mx-auto">
			<Toaster />
			<h1 className="text-3xl font-bold text-gray-900 mb-4 p-4">Checkout</h1>
			<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<AddressBook />
				<OrderSummary />
				<div className="w-full mt-6 px-4">
					<h1 className="text-2xl font-bold text-gray-800 mb-6">
						Payment
					</h1>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="mb-4">
							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="phone"
							>
								Mpesa Number
							</label>
							<input
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								type="tel"
								placeholder="0712345678"
								{...register('mpesaNumber')}
							/>
							<p className="text-sm text-red-600">
								{errors.mpesaNumber?.message}
							</p>
						</div>

						<button
							type="submit"
							className="mt-6 w-full text-center px-4 py-2 font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
						>
							Pay with Mpesa
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
export default Checkout;

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

	return {
		props: {},
	};
};

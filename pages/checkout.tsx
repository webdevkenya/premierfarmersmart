import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AddressBook from '../components/AddressBook';
import OrderSummary from '../components/OrderSummary';
//import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useRouter } from 'next/router';
import { toast, Toaster } from 'react-hot-toast';
import { useShippingAddress } from '../contexts/AddressContext'

const CreateStkRequestMutation = gql`
	mutation CreateStkRequest(
		$MerchantRequestID: String!
				$CheckoutRequestID: String!
				$ResponseCode: Int!
				$ResponseDescription: String!
				$CustomerMessage: String!
				$amount: Int!
				$phone: String!
				$shippingAddressId: String!
	) {
		createStkRequest(
			MerchantRequestID: $MerchantRequestID
				CheckoutRequestID: $CheckoutRequestID
				ResponseCode: $ResponseCode
				ResponseDescription: $ResponseDescription
				CustomerMessage: $CustomerMessage
				amount: $amount
				phone: $phone
				shippingAddressId: $shippingAddressId
		) {
			id
		}
	}
`;

const GetStkRequestByIDQuery = gql`
	query GetStkRequestByID($id: String!) {
		getStkRequestById(id: $id) {
			id
			status
			StkResponse{
				id
			}
		}
	}
`;

export const GetCartTotalQuery = gql`
	query GetCartTotal  {
		cartTotal
	}
`;

export const GetShippingQuery = gql`
	query GetShipping($id:String!){
		getShipping(id: $id) 
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
	const { address } = useShippingAddress()
	const { data: cartTotalData } = useQuery(GetCartTotalQuery)
	const { data: shippingData } = useQuery(GetShippingQuery, {
		variables: {
			id: address
		}
	})

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<IFormInputs>({
		resolver: yupResolver(schema),
	});

	const [createStkRequest] = useMutation(CreateStkRequestMutation, {
		onCompleted: () => reset(),
	});

	const [getPaymentStatus, { data: statusQuery, stopPolling }] =
		useLazyQuery(GetStkRequestByIDQuery);

	// const { items, amountPayable, getTotal, shipping } = useShoppingCart();

	const onSubmit = async (data: IFormInputs) => {
		try {
			if (!address) {
				toast.error('Please select your delivery address');
				return;
			}

			const { mpesaNumber } = data;
			//			const amount = amountPayable();
			const cartTotal = cartTotalData?.cartTotal
			const shipping = shippingData?.getShipping
			const amountPayable = cartTotal + shipping

			console.log(` amount payablle = ${cartTotal} + ${shipping} = ${amountPayable}`);

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
				MerchantRequestID: result.MerchantRequestID,
				CheckoutRequestID: result.CheckoutRequestID,
				ResponseCode: parseInt(result.ResponseCode),
				ResponseDescription: result.ResponseDescription,
				CustomerMessage: result.CustomerMessage,
				amount: amountPayable,
				phone: mpesaNumber,
				shippingAddressId: address
			};
			const { data: createStkRequestData, errors } = await createStkRequest({ variables });
			console.log('createStkRequestData', createStkRequestData);
			if (errors) {
				console.log('errors', errors);
				throw new Error('could not create payment request');
			}

			const { startPolling } = await getPaymentStatus({
				variables: { id: createStkRequestData.createStkRequest.id },
			});

			startPolling(1000);
		} catch (error) {
			console.error(error);
		}
	};

	if (statusQuery?.getStkRequestById?.status === 'SUCCESS') {
		stopPolling();
		router.push({
			pathname: '/success',
			query: {
				orderNumber: statusQuery.getStkRequestById.StkResponse.id,
			},
		});
	}

	if (statusQuery?.getStkRequestById?.status === 'FAILED') {
		stopPolling();
		console.log('result', statusQuery.getStkRequestById);
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
							className="mt-6 w-full text-center px-4 py-2 font-medium text-white bg-gray-800 rounded-full hover:bg-gray-900"
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

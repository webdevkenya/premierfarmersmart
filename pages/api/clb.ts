import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import prisma from '../../lib/prisma';

const validationSchema = yup.object().shape({
	Body: yup.object().shape({
		stkCallback: yup.object().shape({
			MerchantRequestID: yup.string().required(),
			CheckoutRequestID: yup.string().required(),
			ResultCode: yup.number().required(),
			ResultDesc: yup.string().required(),
			CallbackMetadata: yup.object().shape({
				Item: yup.array().of(
					yup.object().shape({
						Name: yup.string().required(),
						Value: yup.mixed(),
					})
				),
			}),
		}),
	}),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		console.log(
			'............................. CallBackURL .............................'
		);

		if (req.method !== 'POST') {
			console.log('invalid method', req.method);
			res.status(405).end();
			return;
		}
		console.log('req.body', req.body);

		const isValid = await validationSchema.isValid(req.body);
		if (!isValid) {
			console.log('invalid request');
			res.status(400).end();
		}

		const { ResultCode, ResultDesc, CheckoutRequestID, MerchantRequestID } =
			req.body.Body.stkCallback;

		console.log('ResultDesc', ResultDesc);

		const stkreq = await prisma.stkRequest.findUnique({
			where: { CheckoutRequestID },
		});
		if (!stkreq) {
			console.log('stk request not found');
			return res.status(404).json({ error: 'Stk request not found' });
		}

		if (+ResultCode !== 0) {
			console.log('payment fail : result code not zero!');

			const stkResponse = await prisma.stkResponse.create({
				data: {
					MerchantRequestID,
					CheckoutRequestID,
					ResultCode: +ResultCode,
					ResultDesc,
					StkRequestId: stkreq.id
				}
			});

			if (!stkResponse) {
				console.log('error creating new stk response entry');
				throw new Error('an error occurred in the payment process');
			}
			await prisma.stkRequest.update({
				where: { CheckoutRequestID },
				data: {
					status: 'FAILED'
				}
			})
			return res.status(200).end();
		}

		const {
			CallbackMetadata: { Item },
		} = req.body.Body.stkCallback;
		console.log('Item', Item);

		const amount = Item.find(({ Name }) => Name === 'Amount');
		console.log('amount', amount);


		//get amount payable
		const cart = await prisma.cart.findUnique({
			where: { sessionId: stkreq.sessionId },
			select: {
				items: {
					select: {
						quantity: true,
						product: {
							select: {
								price: true,
								image: true,
								price_type: true,
								name: true,
								category: true
							}
						}
					}
				}
			}
		})
		if (!cart) {
			console.log('cart not found');
			throw new Error('an error occurred in the payment process');
		}
		const cartTotal = cart.items.reduce((acc, item) => acc + (item.quantity * item.product.price), 0)

		const address = await prisma.address.findUnique({
			where: { id: stkreq.shippingAddressId }, select: {
				Location: {
					select: {
						shipping: true
					}
				}
			}
		})

		if (!address) {
			console.log('shipping address not found');
			throw new Error('an error occurred in the payment process');
		}

		const shipping = address.Location.shipping
		const amountPayable = cartTotal + shipping
		console.log(`amountPayable = ${cartTotal} + ${shipping} = ${amountPayable}`);

		// if (amountPayable !== parseInt(amount.Value)) {
		// 	console.log('payment amount is incorrect');
		// 	return res
		// 		.status(500)
		// 		.json({ error: 'Payment amount is incorrect' });
		// }


		const stkResponse = await prisma.stkResponse.create({
			data: {
				CheckoutRequestID,
				MerchantRequestID,
				ResultCode: +ResultCode,
				ResultDesc,
				StkRequestId: stkreq.id,
				CallbackMetadata: {
					create: Item.map((item) => ({
						name: item.Name,
						value: String(item?.Value ?? ''),
					})
					)
				}
			},
		});

		if (!stkResponse) {
			console.log('error creating new stk response entry');
			throw new Error('an error occurred in the payment process');
		}


		const order = await prisma.order.create({
			data: {
				userId: stkreq.userId,
				amountPaid: parseInt(amount.Value),
				amountPayable,
				shippingAddressId: stkreq.shippingAddressId,
				mpesaNumber: stkreq.phone,
				stkResponseId: stkResponse.id,
				items: {
					create: cart.items.map(({ quantity, product: { name, price, price_type, category, image } }) => ({
						quantity,
						name,
						price,
						priceType: price_type,
						category,
						image,
					}))
				},
			},
		});

		if (!order) {
			console.log('error creating order');
			throw new Error('an error occurred in the payment process');
		}
		await prisma.stkRequest.update({
			where: { CheckoutRequestID },
			data: {
				status: 'SUCCESS'
			}
		})

		res.status(200).end();
	} catch (error) {
		console.log('error', error.message);
		res.status(500).json({ error: error.message });
	}
};

export default handler;

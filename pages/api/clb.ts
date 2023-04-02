import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import prisma from '../../lib/prisma';
import { log } from 'next-axiom'

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
		log.info(
			'............................. CallBackURL .............................'
		);

		if (req.method !== 'POST') {
			log.error('stk callback invalid method', { method: req.method });
			res.status(405).end();
			return;
		}

		const isValid = await validationSchema.isValid(req.body);
		if (!isValid) {
			log.error('stk callback invalid body schema', req.body);
			res.status(400).end();
		}

		log.info(' stk callback req body', req.body,);
		const { ResultCode, ResultDesc, CheckoutRequestID, MerchantRequestID } =
			req.body.Body.stkCallback;

		log.info('stk callback result description', ResultDesc);

		const stkreq = await prisma.stkRequest.findUnique({
			where: { CheckoutRequestID },
		});
		if (!stkreq) {
			log.error(` stk request with ${CheckoutRequestID} not found`);
			return res.status(404).json({ error: 'Stk request not found' });
		}

		if (+ResultCode !== 0) {
			log.error('payment fail : result code not zero!', ResultCode);

			const data = {
				MerchantRequestID,
				CheckoutRequestID,
				ResultCode: +ResultCode,
				ResultDesc,
				StkRequestId: stkreq.id
			}
			const stkResponse = await prisma.stkResponse.create({
				data
			});

			if (!stkResponse) {
				log.error('error creating new stk response entry', data);
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
		log.info('callback metadata item', Item);

		const amount = Item.find(({ Name }) => Name === 'Amount');
		if (!amount) {
			log.error('amount not found in callback metadata Item');
			throw new Error('an error occurred in the payment process');
		}

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
			log.info(`cart with session id: ${stkreq.sessionId} not found`);
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
			log.error(`shipping address with id:${stkreq.shippingAddressId} not found`);
			throw new Error('an error occurred in the payment process');
		}

		const shipping = address.Location.shipping
		const amountPayable = cartTotal + shipping

		log.info(`amountPayable = ${cartTotal} + ${shipping} = ${amountPayable}`);
		log.info(`amout from stk req = ${amount}`);

		if (amountPayable !== parseInt(amount.Value)) {
			log.error(`payment amount in request(${amount.Value}) is not aamount payable(${amountPayable})`);
			return res
				.status(500)
				.json({ error: 'Payment amount is incorrect' });
		}


		const newstkresponse = {
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
		}
		const stkResponse = await prisma.stkResponse.create({
			data: newstkresponse
		});

		if (!stkResponse) {
			log.error('error creating new stk response entry', newstkresponse);
			throw new Error('an error occurred in the payment process');
		}

		const newOrder = {
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
		}
		const order = await prisma.order.create({
			data: newOrder
		});

		if (!order) {
			log.info('error creating order');
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
		log.error('stk callback error', error);
		res.status(500).json({ error: error.message });
	}
};

export default handler;

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

		const order = await prisma.order.findUnique({
			where: { checkoutrequestid: CheckoutRequestID },
		});
		if (!order) {
			console.log('order not found');
			return res.status(404).json({ error: 'Order not found' });
		}

		if (+ResultCode !== 0) {
			console.log('payment fail : result code not zero!');
			const newStk = {
				merchantrequestid: MerchantRequestID,
				checkoutrequestid: CheckoutRequestID,
				resultcode: +ResultCode,
				resultdesc: ResultDesc,
				orderId: order.id,
			};

			const stk = await prisma.stk.create({
				data: newStk,
			});

			if (!stk) {
				console.log('error creating new stk entry');
				throw new Error('an error occurred in the payment process');
			}
			const update = {
				status: 'FAILED',
			};
			const updatedOrder = await prisma.order.update({
				where: { checkoutrequestid: CheckoutRequestID },
				data: update,
			});
			if (!updatedOrder) {
				console.log('error updating order');
				throw new Error('an error occurred in the payment process');
			}
			return res.status(200).end();
		}

		const {
			CallbackMetadata: { Item },
		} = req.body.Body.stkCallback;
		console.log('Item', Item);

		const amount = Item.find(({ Name }) => Name === 'Amount');
		console.log('amount', amount);

		// if (order.amount_payable !== parseInt(amount.Value)) {
		// 	console.log('payment amount is incorrect');
		// 	return res
		// 		.status(500)
		// 		.json({ error: 'Payment amount is incorrect' });
		// }

		const newStk = {
			merchantrequestid: MerchantRequestID,
			checkoutrequestid: CheckoutRequestID,
			resultcode: +ResultCode,
			resultdesc: ResultDesc,
			callbackmetadata: {
				create: Item.map((item) => ({
					name: item.Name,
					value: String(item?.Value ?? ''),
				})),
			},
			orderId: order.id,
		};

		const stk = await prisma.stk.create({
			data: newStk,
		});

		if (!stk) {
			console.log('error creating new stk entry');
			throw new Error('an error occurred in the payment process');
		}
		const update = {
			status: 'PAID',
		};
		const updatedOrder = await prisma.order.update({
			where: { checkoutrequestid: CheckoutRequestID },
			data: update,
		});

		if (!updatedOrder) {
			console.log('error updating order');
			throw new Error('an error occurred in the payment process');
		}

		res.status(200).end();
	} catch (error) {
		console.log('error', error.message);
		res.status(500).json({ error: error.message });
	}
};

export default handler;

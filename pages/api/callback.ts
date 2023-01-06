import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import prisma from '../../lib/prisma';

const validationSchema = yup.object().shape({
	Body: yup.object().shape({
		stkCallback: yup.object().shape({
			MerchantRequestID: yup.string().required(),
			CheckoutRequestID: yup.string().required(),
			ResultCode: yup.string().required(),
			ResultDesc: yup.string().required(),
			CallbackMetadata: yup.object().shape({
				Item: yup.array().of(
					yup.object().shape({
						Name: yup.string().required(),
						Value: yup.string().required(),
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
			res.status(405).end();
			return;
		}

		const isValid = await validationSchema.isValid(req.body);
		if (!isValid) {
			res.status(400).end();
			return;
		}

		const {
			MerchantRequestID,
			CheckoutRequestID,
			ResultCode,
			ResultDesc,
			CallbackMetadata: { Item },
		} = req.body.Body.stkCallback;

		console.log('ResultDesc', ResultDesc);

		if (ResultCode !== '0') {
			throw new Error('payment failed : ' + ResultDesc);
		}

		const amount = Item.find(({ Name }) => Name === 'amount');

		const order = await prisma.order.findUnique({
			where: { checkoutrequestid: CheckoutRequestID },
		});
		if (!order) {
			return res.status(400).json({ error: 'Order not found' });
		}
		if (order.amount_payable !== parseInt(amount.Value)) {
			return res
				.status(400)
				.json({ error: 'Payment amount is incorrect' });
		}

		const newStk = {
			merchantrequestid: MerchantRequestID,
			checkoutrequestid: CheckoutRequestID,
			resultcode: ResultCode,
			resultdesc: ResultDesc,
			callbackmetadata: {
				create: Item.map((item) => ({
					name: item.Name,
					value: item.Value,
				})),
			},
			orderId: order.id,
		};

		const stk = await prisma.stk.create({
			data: newStk,
		});

		if (!stk) {
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
			throw new Error('an error occurred in the payment process');
		}

		res.status(200).end();
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ error: error.message });
	}
};

export default handler;

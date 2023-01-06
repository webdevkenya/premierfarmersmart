import type { NextApiRequest, NextApiResponse } from 'next';

const getTimestamp = () => {
	const date = new Date();

	const appendZero = (n) => (n < 10 ? '0' + n : n);

	let YYYY = date.getFullYear();
	let MM = appendZero(date.getMonth() + 1);
	let DD = appendZero(date.getDate());
	let HH = appendZero(date.getHours());
	let mm = appendZero(date.getMinutes());
	let ss = appendZero(date.getSeconds());
	return `${YYYY}${MM}${DD}${HH}${mm}${ss}`;
};

function addCountryCode(phone) {
	return '254' + String(phone).slice(1);
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, body } = req;

	if (method !== 'POST') {
		res.status(405).end();
		return;
	}

	try {
		const str = `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`;
		const auth = Buffer.from(str, 'utf-8').toString('base64');

		const ares = await fetch(
			'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
			{
				method: 'GET',
				headers: {
					Authorization: `Basic ${auth}`,
					'Content-Type': 'application/json',
				},
			}
		);

		const result = await ares.json();
		const { access_token } = result;

		const { amount, phoneNumber } = body;
		const timestamp = getTimestamp();
		const passkey = process.env.PASSKEY;
		const shortCode = process.env.BUSINESS_SHORTCODE;
		const Password = Buffer.from(
			shortCode + passkey + timestamp,
			'utf-8'
		).toString('base64');
		const CallBackURL = process.env.CALLBACK_URL;
		const data = {
			BusinessShortCode: shortCode,
			Password,
			Timestamp: timestamp,
			TransactionType: 'CustomerPayBillOnline',
			Amount: amount,
			PartyA: addCountryCode(phoneNumber),
			PartyB: shortCode,
			PhoneNumber: addCountryCode(phoneNumber),
			CallBackURL,
			AccountReference: 'Premier Farmers Mart',
			TransactionDesc: 'payment of for order',
		};
		console.log('data', JSON.stringify(data));

		const response = await fetch(
			'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}`,
				},
				body: JSON.stringify(data),
			}
		);

		const pres = await response.json();
		console.log('response', pres);

		if (response.status !== 200) {
			throw new Error(
				`an error occurred in the payment process - ${pres.errorCode} : ${pres.errorMessage}`
			);
		}
		if (pres.ResponseCode !== '0') {
			throw new Error(
				`an error occurred in the payment process - ${pres.CustomerMessage}`
			);
		}
		res.status(200).json(pres);
	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}
};

export default handler;

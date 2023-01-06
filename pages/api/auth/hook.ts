import prisma from '../../../lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { email, secret } = req.body;
	console.log('create DB webhook', email, secret);
	// Validates the request is a POST request
	if (req.method !== 'POST') {
		return res.status(403).json({ message: 'Method not allowed' });
	}
	// Validates the AUTH0_HOOK_SECRET from the request body is correct
	if (secret !== process.env.AUTH0_HOOK_SECRET) {
		return res
			.status(403)
			.json({ message: `You must provide the secret 🤫` });
	}
	// Validates that an email was provided in the request body
	if (email) {
		// Creates a new user record
		await prisma.user.create({
			data: { email },
		});
		return res.status(200).json({
			message: `User with email: ${email} has been created successfully!`,
		});
	}
};

export default handler;

//Once a user signs up to your application, the user's information will be synced to your database

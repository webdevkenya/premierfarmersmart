// /graphql/context.ts
import { PrismaClient } from '@prisma/client';
import prisma from '../lib/prisma';
import { Claims, getSession } from '@auth0/nextjs-auth0';

export type Context = {
	user?: Claims;
	accessToken?: string;
	prisma: PrismaClient;
	sessionId?: string;
};

export async function createContext({ req, res }): Promise<Context> {

	const session = await getSession(req, res);
	console.log('cookies', req.cookies);

	const sessionId = req.cookies?.sessionId
	console.log('sessionId', sessionId);

	// if the user is not logged in, omit returning the user and accessToken
	if (!session) {

		if (!sessionId) {
			throw new Error('no session id')
		}
		const hasSession = await prisma.session.findUnique({
			where: { sessionId }
		});

		if (!hasSession) {
			const res = await prisma.session.create({
				data: { sessionId }
			})
			console.log('res', res);

			if (!res) {
				throw new Error('unable to save session')
			}
			return { prisma, sessionId };

		}

		return { prisma, sessionId };

	}
	const { user, accessToken } = session;

	return {
		user,
		accessToken,
		prisma,
	};
}

import { objectType, enumType, list, extendType, nonNull, stringArg, intArg } from 'nexus';
import { Address } from './Address';
import { Cart } from './Cart';
import { Order } from './Order';
import { User } from './User';

export const StkRequest = objectType({
	name: 'StkRequest',
	definition(t) {
		t.string('id');
		t.string('SessionId');
		t.string('MerchantRequestID');
		t.string('CheckoutRequestID');
		t.int('ResponseCode');
		t.string('ResponseDescription');
		t.string('CustomerMessage');
		t.int('amount')
		t.string('phone')
		t.field('status', { type: Status })
		t.field('StkResponse', {
			type: StkResponse,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.stkRequest
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.StkResponse()
			}

		})
		t.field('user', {
			type: User,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.stkRequest
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.user()
			},
		});
		t.field('shippingAddress', {
			type: Address,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.stkRequest
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.shippingAddress()
			},
		});
	},
});

export const StkResponse = objectType({
	name: 'StkResponse',
	definition(t) {
		t.string('id');
		t.string('MerchantRequestID');
		t.string('CheckoutRequestID');
		t.int('ResultCode');
		t.string('ResultDesc');
		t.field('StkRequest', {
			type: StkRequest,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.stkResponse
					.findUnique({
						where: {
							id: parent.id,
						},
					}).StkRequest()

			}

		})
		t.field('CallbackMetadata', {
			type: list(CallbackMetadata),
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.stkResponse
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.CallbackMetadata()
			}

		})
		t.field('order', {
			type: Order,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.stkResponse
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.Order();
			},
		});
	},
});

const CallbackMetadata = objectType({
	name: 'CallbackMetadata',
	definition(t) {
		t.string('name')
		t.string('value')
		t.string('stkResponseId')
	}

})

const Status = enumType({
	name: 'OrderStatus',
	members: ['PENDING', 'SUCCESS', 'FAILED'],
});

export const StkQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.field('stkRequest', {
			type: StkRequest,
			async resolve(_parent, _args, ctx) {
				if (!ctx.user) {
					throw new Error(
						`You need to be logged in to perform an action`
					);
				}
				const user = await ctx.prisma.user.findUnique({
					where: {
						email: ctx.user.email,
					},
				});

				if (user.role !== 'ADMIN') {
					throw new Error(
						`You do not have permission to perform action`
					);
				}
				return ctx.prisma.stkRequest.findMany();
			},
		});
		t.nonNull.list.field('stkResponse', {
			type: StkResponse,
			async resolve(_parent, _args, ctx) {
				if (!ctx.user) {
					throw new Error(
						`You need to be logged in to perform an action`
					);
				}
				const user = await ctx.prisma.user.findUnique({
					where: {
						email: ctx.user.email,
					},
				});

				if (user.role !== 'ADMIN') {
					throw new Error(
						`You do not have permission to perform action`
					);
				}
				return ctx.prisma.stkResponse.findMany();
			},
		});
		t.field('getStkRequestById', {
			type: StkRequest,
			args: {
				id: nonNull(stringArg()),
			},
			async resolve(_parent, args, ctx) {
				return await ctx.prisma.stkRequest.findUnique({
					where: {
						id: args.id,
					}, include: {
						StkResponse: true
					}
				})
			},
		});
	},
});


export const StkMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('createStkRequest', {
			type: StkRequest,
			args: {
				MerchantRequestID: nonNull(stringArg()),
				CheckoutRequestID: nonNull(stringArg()),
				ResponseCode: nonNull(intArg()),
				ResponseDescription: nonNull(stringArg()),
				CustomerMessage: nonNull(stringArg()),
				amount: nonNull(intArg()),
				phone: nonNull(stringArg()),
				shippingAddressId: nonNull(stringArg())
			},
			async resolve(_parent, args, ctx) {
				if (!ctx.user) {
					throw new Error(
						`You need to be logged in to perform an action`
					);
				}
				const user = await ctx.prisma.user.findUnique({
					where: {
						email: ctx.user.email,
					},
				});
				const newStkRequest = {
					MerchantRequestID: args.MerchantRequestID,
					CheckoutRequestID: args.CheckoutRequestID,
					ResponseCode: args.ResponseCode,
					ResponseDescription: args.ResponseDescription,
					CustomerMessage: args.CustomerMessage,
					sessionId: ctx.sessionId,
					userId: user.id,
					amount: args.amount,
					phone: args.phone,
					shippingAddressId: args.shippingAddressId,
				}

				console.log('newStkRequest', newStkRequest);

				return await ctx.prisma.stkRequest.create({
					data: newStkRequest
				});
			},
		});

	},
});

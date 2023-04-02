import {
	objectType,
	extendType,
	intArg,
	stringArg,
	enumType,
	nonNull,
} from 'nexus';
import { User } from './User';
import { StkResponse } from './Stk';
import { Address } from './Address';

export const OrderItem = objectType({
	name: 'OrderItem',
	definition(t) {
		t.string('id');
		t.string('cartId')
		t.string('orderId')
		t.int('quantity');
		t.string('name')
		t.int('price')
		t.string('priceType')
		t.string('category')
		t.string('image')
	}
})

export const Order = objectType({
	name: 'Order',
	definition(t) {
		t.string('id');
		t.string('createdAt')
		t.string('deliveryStart')
		t.string('deliveryStop')
		t.field('deliveryStatus', { type: DeliveryStatus })
		t.string('checkoutrequestid');
		t.int('amountPayable');
		t.int('amountPaid');
		t.string('mpesaNumber');
		t.field('shippingAddress', {
			type: Address,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.order
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.shippingAddress()
			},
		});
		t.field('user', {
			type: User,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.order
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.user()
			},
		});
		t.list.field('items', {
			type: OrderItem,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.order
					.findUnique({
						where: {
							id: parent.id,
						},
					}).items()

			},
		});
		t.field('StkResponse', {
			type: StkResponse,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.order
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.StkResponse();
			},
		});
	},
});

const DeliveryStatus = enumType({
	name: 'DeliveryStatus',
	members: ['PENDING', 'DISPATCHED', 'DELIVERED'],
});

export const OrderEdge = objectType({
	name: 'OrderEdge',
	definition(t) {
		t.string('cursor');
		t.field('node', {
			type: Order,
		});
	},
});

export const OrderPageInfo = objectType({
	name: 'OrderPageInfo',
	definition(t) {
		t.string('endCursor');
		t.boolean('hasNextPage');
	},
});

export const OrderResponse = objectType({
	name: 'Response',
	definition(t) {
		t.field('pageInfo', { type: OrderPageInfo });
		t.list.field('edges', {
			type: OrderEdge,
		});
	},
});


export const OrdersQuery = extendType({
	type: 'Query',
	definition(t) {
		t.field('orders', {
			type: OrderResponse,
			args: {
				first: intArg(),
				after: stringArg(),
			},
			async resolve(_parent, args, ctx) {
				let queryResults = null;

				if (args.after) {
					// check if there is a cursor as the argument
					queryResults = await ctx.prisma.order.findMany({
						take: args.first, // the number of items to return from the database
						skip: 1, // skip the cursor
						cursor: {
							id: args.after, // the cursor
						}, orderBy: {
							index: 'desc'
						}
					});
				} else {
					// if no cursor, this means that this is the first request
					//  and we will return the first items in the database
					queryResults = await ctx.prisma.order.findMany({
						take: args.first, orderBy: {
							index: 'desc'
						}
					});
				}
				// if the initial request returns orders
				if (queryResults.length > 0) {
					// get last element in previous result set
					const lastOrderInResults =
						queryResults[queryResults.length - 1];
					// cursor we'll return in subsequent requests
					const myCursor = lastOrderInResults.id;

					// query after the cursor to check if we have nextPage
					const secondQueryResults =
						await ctx.prisma.order.findMany({
							take: args.first,
							cursor: {
								id: myCursor,
							},
							orderBy: {
								index: 'desc'
							},
						});

					// return response
					const result = {
						pageInfo: {
							endCursor: myCursor,
							hasNextPage:
								secondQueryResults.length >= args.first, //if the number of items requested is greater than the response of the second query, we have another page
						},
						edges: queryResults.map((order) => ({
							cursor: order.id,
							node: order,
						})),
					};

					return result;
				}

				return {
					pageInfo: {
						endCursor: null,
						hasNextPage: false,
					},
					edges: [],
				};
			},
		});

	},
});



export const OrderMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('dispatch', {
			type: Order,
			args: {
				id: nonNull(stringArg()),
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

				if (user?.role !== 'ADMIN') {
					throw new Error(
						`You do not have permission to perform action`
					);
				}

				return await ctx.prisma.order.update({
					where: {
						id: args.id,
					},
					data: {
						deliveryStart: new Date(),
						deliveryStatus: 'DISPATCHED',
					},
				});
			},
		});
		t.nonNull.field('markDelivered', {
			type: Order,
			args: {
				id: nonNull(stringArg()),
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

				if (user?.role !== 'ADMIN') {
					throw new Error(
						`You do not have permission to perform action`
					);
				}

				return await ctx.prisma.order.update({
					where: {
						id: args.id,
					},
					data: {
						deliveryStop: new Date(),
						deliveryStatus: 'DELIVERED',
					},
				});
			},
		});
	},
});


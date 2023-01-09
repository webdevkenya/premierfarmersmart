import {
	objectType,
	extendType,
	list,
	nonNull,
	intArg,
	stringArg,
	enumType,
} from 'nexus';
import { Product } from './Product';
import { User } from './User';
import { Stk } from './Stk';

export const Order = objectType({
	name: 'Order',
	definition(t) {
		t.string('id');
		t.field('status', { type: PaymentStatus });
		t.int('cart_total');
		t.boolean('is_shipped');
		t.string('mpesa_number');
		t.string('checkoutrequestid');
		t.int('amount_payable');
		t.int('shipping_cost');
		t.field('user', {
			type: User,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.order
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.User();
			},
		});
		t.field('payment', {
			type: Stk,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.order
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.payment();
			},
		});
		t.list.field('products', {
			type: Product,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.order
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.products();
			},
		});
	},
});

const PaymentStatus = enumType({
	name: 'OrderStatus',
	members: ['PENDING', 'PAID', 'FAILED'],
});

export const OrdersQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('order', {
			type: Order,
			args: {
				id: nonNull(stringArg()),
			},
			resolve(_parent, args, ctx) {
				return ctx.prisma.order.findUnique({
					where: {
						id: args.id,
					},
				});
			},
		});
	},
});

export const CreateOrderMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('createOrder', {
			type: Order,
			args: {
				products: nonNull(list(stringArg())),
				amountPayable: nonNull(intArg()),
				cartTotal: nonNull(intArg()),
				shippingCost: nonNull(intArg()),
				mpesaNumber: nonNull(stringArg()),
				checkoutrequestid: nonNull(stringArg()),
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

				const newOrder = {
					products: {
						connect: args.products.map((id) => ({ id })),
					},
					cart_total: args.cartTotal,
					amount_payable: args.amountPayable,
					shipping_cost: args.shippingCost,
					mpesa_number: args.mpesaNumber,
					checkoutrequestid: args.checkoutrequestid,
					userId: user.id,
				};

				return await ctx.prisma.order.create({
					data: newOrder,
				});
			},
		});
	},
});

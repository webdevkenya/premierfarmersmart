import {
	objectType,
	extendType,
	nonNull,
	stringArg,

} from 'nexus';
import { Product } from './Product';
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
		t.field('product', {
			type: Product,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.cartItem
					.findUnique({
						where: {
							id: parent.id,
						},
					}).product()
			},
		});
	}
})

export const Order = objectType({
	name: 'Order',
	definition(t) {
		t.string('id');
		t.boolean('isShipped');
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
			type: Order,
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




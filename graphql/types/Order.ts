import { objectType } from 'nexus';
import { Product } from './Product';
import { User } from './User';
import { Stk } from './Stk';

export const Order = objectType({
	name: 'Order',
	definition(t) {
		t.string('id');
		t.boolean('is_shipped');
		t.string('amount_payable');
		t.string('shipping_cost');
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
		t.field('payment', { type: Stk });
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

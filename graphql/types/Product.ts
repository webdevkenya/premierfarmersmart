import { objectType, extendType } from 'nexus';
import { User } from './User';

export const Product = objectType({
	name: 'Product',
	definition(t) {
		t.string('id');
		t.string('name');
		t.string('price');
		t.string('price_type');
		t.string('category');
		t.int('stock');
		t.string('image');
		t.string('category');
		t.list.field('users', {
			type: User,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.product
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.users();
			},
		});
	},
});

export const ProductsQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.field('products', {
			type: 'Product',
			resolve(_parent, _args, ctx) {
				return ctx.prisma.product.findMany();
			},
		});
	},
});

import { enumType, objectType, extendType } from 'nexus';
import { Product } from './Product';
import { Address } from './Address';
import { Order } from './Order';

export const User = objectType({
	name: 'User',
	definition(t) {
		t.string('id');
		t.string('name');
		t.string('email');
		t.string('image');
		t.field('role', { type: Role });
		t.list.field('favorites', {
			type: Product,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.user
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.favorites();
			},
		});
		t.list.field('addresses', {
			type: Address,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.user
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.addresses();
			},
		});
		t.list.field('orders', {
			type: Order,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.user
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.orders();
			},
		});
	},
});

const Role = enumType({
	name: 'Role',
	members: ['USER', 'ADMIN'],
});

export const UsersQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.field('users', {
			type: 'User',
			resolve(_parent, _args, ctx) {
				return ctx.prisma.user.findMany();
			},
		});
	},
});

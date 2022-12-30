import { enumType, objectType, extendType, nonNull, stringArg } from 'nexus';
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

//query all users
export const GetAllUsersQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.field('getAllUsers', {
			type: 'User',
			resolve(_parent, _args, ctx) {
				return ctx.prisma.user.findMany();
			},
		});
	},
});

export const AddFavoriteMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('addFavorite', {
			type: Product,
			args: {
				id: nonNull(stringArg()),
			},
			async resolve(_parent, args, ctx) {
				if (!ctx.user) {
					throw new Error(
						`You need to be logged in to perform an action`
					);
				}
				const product = await ctx.prisma.product.findUnique({
					where: { id: args.id },
				});

				if (!product) {
					throw new Error(`Product with id ${args.id} not found`);
				}

				return await ctx.prisma.user.update({
					where: {
						email: ctx.user.email,
					},
					data: { favorites: { connect: { id: args.id } } },
				});
			},
		});
		t.nonNull.field('deleteFavorite', {
			type: Product,
			args: {
				id: stringArg(),
			},
			async resolve(_parent, args, ctx) {
				if (!ctx.user) {
					throw new Error(
						`You need to be logged in to perform an action`
					);
				}

				const product = await ctx.prisma.product.findUnique({
					where: { id: args.id },
				});

				if (!product) {
					throw new Error(`Product with id ${args.id} not found`);
				}

				return ctx.prisma.user.update({
					where: {
						email: ctx.user.email,
					},
					data: {
						favorites: {
							disconnect: { id: args.id },
						},
					},
				});
			},
		});
	},
});

import {
	objectType,
	extendType,
	nonNull,
	stringArg,
} from 'nexus';
import { Product } from './Product';
import { User } from './User';

export const CartItem = objectType({
	name: 'CartItem',
	definition(t) {
		t.string('id');
		t.string('sessionId');
		t.string('cartId')
		t.int('quantity');
		t.field('productTotal', {
			type: 'Int',
			async resolve(parent, _args, ctx) {
				const product = await ctx.prisma.cartItem
					.findUnique({
						where: {
							id: parent.id,
						},
					}).product()
				return product.price * parent.quantity
			}
		});
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


export const Cart = objectType({
	name: 'Cart',
	definition(t) {
		t.string('id');
		t.string('sessionId');
		t.field('user', {
			type: User,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.cart
					.findUnique({
						where: {
							id: parent.id,
						},
					}).user()

			},
		});
		t.list.field('items', {
			type: CartItem,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.cart
					.findUnique({
						where: {
							id: parent.id,
						},
					}).items()

			},
		});
	},
});

export const CartQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('cart', {
			type: Cart,
			async resolve(_parent, _args, ctx) {
				return await ctx.prisma.cart.findUnique({ where: { sessionId: ctx.sessionId } });
			},
		});
		t.nonNull.field('cartTotal', {
			type: 'Int',
			async resolve(_parent, _args, ctx) {
				const cart = await ctx.prisma.cart
					.findUnique({
						where: {
							sessionId: ctx.sessionId,
						},
						select: {
							items: {
								select: {
									quantity: true,
									product: {
										select: {
											price: true
										}
									}
								}
							}
						}
					})
				return cart.items.reduce((acc, item) => acc + (item.quantity * item.product.price), 0)
			},
		});
		t.nonNull.field('cartCount', {
			type: 'Int',
			async resolve(_parent, _args, ctx) {
				const cart = await ctx.prisma.cart
					.findUnique({
						where: {
							sessionId: ctx.sessionId,
						},
						include: {
							_count: {
								select: {
									items: true
								}
							}
						}
					})
				return cart._count.items
			},
		});
	},
});

export const CartMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('addToCart', {
			type: Cart,
			args: {
				id: nonNull(stringArg()),
			},
			async resolve(_parent, args, ctx) {
				const cart = await ctx.prisma.cart.findUnique({ where: { sessionId: ctx.sessionId } });
				if (!cart) {
					return await ctx.prisma.cart.create({
						data: {
							sessionId: ctx.sessionId,
							items: {
								create: {
									product: { connect: { id: args.id } }
								},
							},
						}
					})
				}
				return await ctx.prisma.cart.update({
					where: { id: cart.id },
					data: { items: { create: { product: { connect: { id: args.id } } } } }
				});

			},
		});
		t.nonNull.field('increaseQuantity', {
			type: CartItem,
			args: {
				id: nonNull(stringArg()),
			},
			async resolve(_parent, args, ctx) {
				const item = await ctx.prisma.cartItem.findUnique({ where: { id: args.id } });
				return await ctx.prisma.cartItem.update({
					where: { id: item.id },
					data: { quantity: item.quantity + 1 }
				})
			}
		});

		t.field('decreaseQuantity', {
			type: CartItem,
			args: {
				id: nonNull(stringArg()),
			},
			async resolve(_parent, args, ctx) {
				const item = await ctx.prisma.cartItem.findUnique({ where: { id: args.id } });
				if (item.quantity > 1) {
					return await ctx.prisma.cartItem.update({
						where: { id: item.id },
						data: { quantity: item.quantity - 1 }
					})
				}
			}
		});
		t.field('removeFromCart', {
			type: CartItem,
			args: {
				id: nonNull(stringArg()),
			},
			async resolve(_parent, args, ctx) {
				return await ctx.prisma.cartItem.delete({ where: { id: args.id } })
			}
		});
	}
});

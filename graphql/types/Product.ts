import { objectType, extendType, intArg, stringArg, nonNull, list } from 'nexus';
import { User } from './User';

export const Product = objectType({
	name: 'Product',
	definition(t) {
		t.string('id');
		t.string('name');
		t.int('price');
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

export const ProductEdge = objectType({
	name: 'ProductEdge',
	definition(t) {
		t.string('cursor');
		t.field('node', {
			type: Product,
		});
	},
});

export const ProductPageInfo = objectType({
	name: 'ProductPageInfo',
	definition(t) {
		t.string('endCursor');
		t.boolean('hasNextPage');
	},
});

export const ProductResponse = objectType({
	name: 'ProductResponse',
	definition(t) {
		t.field('pageInfo', { type: ProductPageInfo });
		t.list.field('edges', {
			type: ProductEdge,
		});
	},
});

export const Category = objectType({
	name: 'Category',
	definition(t) {
		t.string('id')
		t.string('category')
	},
});


// get All Products
export const ProductsQuery = extendType({
	type: 'Query',
	definition(t) {
		t.field('products', {
			type: ProductResponse,
			args: {
				first: intArg(),
				after: stringArg(),
			},
			async resolve(_parent, args, ctx) {
				let queryResults = null;

				if (args.after) {
					// check if there is a cursor as the argument
					queryResults = await ctx.prisma.product.findMany({
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
					queryResults = await ctx.prisma.product.findMany({
						take: args.first, orderBy: {
							index: 'desc'
						}
					});
				}
				// if the initial request returns products
				if (queryResults.length > 0) {
					// get last element in previous result set
					const lastProductInResults =
						queryResults[queryResults.length - 1];
					// cursor we'll return in subsequent requests
					const myCursor = lastProductInResults.id;

					// query after the cursor to check if we have nextPage
					const secondQueryResults =
						await ctx.prisma.product.findMany({
							take: args.first,
							cursor: {
								id: myCursor,
							},
							orderBy: {
								index: 'desc'
							}
						});

					// return response
					const result = {
						pageInfo: {
							endCursor: myCursor,
							hasNextPage:
								secondQueryResults.length >= args.first, //if the number of items requested is greater than the response of the second query, we have another page
						},
						edges: queryResults.map((product) => ({
							cursor: product.id,
							node: product,
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
		t.field('getProductsByCategory', {
			type: ProductResponse,
			args: {
				category: stringArg(),
				first: intArg(),
				after: stringArg(),
			},
			async resolve(_parent, args, ctx) {
				let queryResults = null;

				if (args.after) {
					// check if there is a cursor as the argument
					queryResults = await ctx.prisma.product.findMany({
						where: {
							category: args.category
						},
						take: args.first, // the number of items to return from the database
						skip: 1, // skip the cursor
						cursor: {
							id: args.after, // the cursor
						},
						orderBy: {
							index: 'desc'
						}
					});
				} else {
					// if no cursor, this means that this is the first request
					//  and we will return the first items in the database
					queryResults = await ctx.prisma.product.findMany({
						where: {
							category: args.category
						},
						take: args.first, orderBy: {
							index: 'desc'
						}
					});
				}
				// if the initial request returns products
				if (queryResults.length > 0) {
					// get last element in previous result set
					const lastProductInResults =
						queryResults[queryResults.length - 1];
					// cursor we'll return in subsequent requests
					const myCursor = lastProductInResults.id;

					// query after the cursor to check if we have nextPage
					const secondQueryResults =
						await ctx.prisma.product.findMany({
							where: {
								category: args.category
							},
							take: args.first,
							cursor: {
								id: myCursor,
							},
							orderBy: {
								index: 'desc',
							},
						});

					// return response
					const result = {
						pageInfo: {
							endCursor: myCursor,
							hasNextPage:
								secondQueryResults.length >= args.first, //if the number of items requested is greater than the response of the second query, we have another page
						},
						edges: queryResults.map((product) => ({
							cursor: product.id,
							node: product,
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
		t.nonNull.list.field('categories', {
			type: Category,
			async resolve(_parent, _args, ctx) {
				return await ctx.prisma.product.findMany({
					select: { category: true, id: true },
					distinct: 'category',
				});
			},
		});
	},
});

export const ProductMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('createProduct', {
			type: Product,
			args: {
				name: nonNull(stringArg()),
				price: nonNull(intArg()),
				price_type: nonNull(stringArg()),
				image: nonNull(stringArg()),
				category: nonNull(stringArg()),
				stock: nonNull(intArg()),
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
				const newProduct = {
					name: args.name,
					price: args.price,
					price_type: args.price_type,
					image: args.image,
					category: args.category,
					stock: args.stock,
				};

				return await ctx.prisma.product.create({
					data: newProduct,
				});
			},
		});
		t.nonNull.field('deleteProduct', {
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
				const product = await ctx.prisma.product.findUnique({
					where: { id: args.id },
				});

				if (!product) {
					throw new Error(`Product with id ${args.id} not found`);
				}

				return ctx.prisma.product.delete({
					where: {
						id: args.id,
					},
				});
			},
		});
	},
});

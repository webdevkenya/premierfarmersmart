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

export const Edge = objectType({
	name: 'Edge',
	definition(t) {
		t.string('cursor');
		t.field('node', {
			type: Product,
		});
	},
});

export const PageInfo = objectType({
	name: 'PageInfo',
	definition(t) {
		t.string('endCursor');
		t.boolean('hasNextPage');
	},
});

export const Response = objectType({
	name: 'Response',
	definition(t) {
		t.field('pageInfo', { type: PageInfo });
		t.list.field('edges', {
			type: Edge,
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
			type: Response,
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
						},
					});
				} else {
					// if no cursor, this means that this is the first request
					//  and we will return the first items in the database
					queryResults = await ctx.prisma.product.findMany({
						take: args.first,
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
								index: 'asc',
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
		t.field('getProductsByCategory', {
			type: Response,
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
						where:{
							category:args.category
						},
						take: args.first, // the number of items to return from the database
						skip: 1, // skip the cursor
						cursor: {
							id: args.after, // the cursor
						},
					});
				} else {
					// if no cursor, this means that this is the first request
					//  and we will return the first items in the database
					queryResults = await ctx.prisma.product.findMany({
						where:{
							category: args.category
						},
						take: args.first,
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
							where:{
category: args.category
							},
							take: args.first,
							cursor: {
								id: myCursor,
							},
							orderBy: {
								index: 'asc',
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
					select: { category: true,id:true },
					distinct: 'category',
				});	
			},
		});
	},
});

export const CreateProductMutation = extendType({
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

				if (user.role !== 'ADMIN') {
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
	},
});

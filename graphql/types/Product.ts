import { objectType, arg, nonNull, list, stringArg, intArg, inputObjectType, enumType, extendType } from 'nexus';
import { Prisma } from "@prisma/client"

export const Product = objectType({
	name: "Product",
	definition(t) {
		t.nonNull.string("id")
		t.nonNull.dateTime("createdAt")
		t.nonNull.dateTime("updatedAt")
		t.nonNull.string("image")
		t.nonNull.string("name")
		t.nonNull.positiveInt("price")
		t.nonNull.string("price_type")
		t.nonNull.string("category")
		t.nonNull.positiveInt("stock")
	}
})
const ProductEdge = objectType({
	name: "ProductEdge",
	definition(t) {
		t.nonNull.string("cursor")
		t.nonNull.field("node", { type: Product })
	}
})
const ProductPageInfo = objectType({
	name: "ProductPageInfo",
	definition(t) {
		t.nonNull.string("endCursor")
		t.nonNull.boolean("hasNextPage")
	}
})
const ProductResponse = objectType({
	name: "ProductResponse",
	definition(t) {
		t.nonNull.list.nonNull.field("edges", { type: ProductEdge })
		t.nonNull.field("pageInfo", { type: ProductPageInfo })
	}
})

const ProductInput = inputObjectType({
	name: "ProductInput",
	definition(t) {
		t.nonNull.string("category")
		t.nonNull.string("image")
		t.nonNull.string("name")
		t.nonNull.positiveInt("price")
		t.nonNull.string("price_type")
		t.nonNull.positiveInt("stock")
	}
});
const ProductOrderByInput = inputObjectType({
	name: "ProductOrderByInput",
	definition(t) {
		t.field("createdAt", { type: Sort })
		t.field("updatedAt", { type: Sort })
		t.field("name", { type: Sort })
		t.field("price", { type: Sort })
		t.field("category", { type: Sort })
	}
});

const Sort = enumType({
	name: "Sort",
	members: ['asc', 'desc'],
});

export const Category = objectType({
	name: 'Category',
	definition(t) {
		t.string('id')
		t.string('category')
	},
});

export const Query = extendType({
	type: "Query",
	definition(t) {
		t.nonNull.list.field('categories', {
			type: Category,
			async resolve(_parent, _args, ctx) {
				return await ctx.prisma.product.findMany({
					select: { category: true, id: true },
					distinct: 'category',
				});
			},
		});
		t.field("products", {
			type: ProductResponse,
			args: {
				filter: stringArg(),
				after: stringArg(),
				first: intArg(),
				orderBy: arg({ type: list(nonNull(ProductOrderByInput)) }),
				category: stringArg()
			}, async resolve(_parent, args, ctx, _info) {
				//handle filter
				//fix me- how to use filter and category together
				let where = args.filter
					? {
						OR: [
							{ name: { contains: args.filter } },
							{ category: { contains: args.filter } },
						],
					}
					: args?.category ? {
						category: { equals: args.category }
					} : {}


				//handle pagination
				let queryResults = null;

				if (args.after) {
					// check if there is a cursor as the argument
					queryResults = await ctx.prisma.product.findMany({
						where,
						take: args.first, // the number of items to return from the database
						skip: 1, // skip the cursor
						cursor: {
							id: args.after, // the cursor
						}, orderBy: args?.orderBy as Prisma.Enumerable<Prisma.ProductOrderByWithRelationInput> | undefined,

					});
				} else {
					// if no cursor, this means that this is the first request
					//  and we will return the first items in the database
					queryResults = await ctx.prisma.product.findMany({
						where,
						take: args.first,
						orderBy: args?.orderBy as Prisma.Enumerable<Prisma.ProductOrderByWithRelationInput> | undefined,
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
							where,
							take: args.first,
							cursor: {
								id: myCursor,
							},
							orderBy: args?.orderBy as Prisma.Enumerable<Prisma.ProductOrderByWithRelationInput> | undefined,
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

			}
		})
	}
})



export const Mutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.int("createProduct", {
			args: {
				products: arg({ type: nonNull(list(nonNull(ProductInput))) }),
			},
			async resolve(_parent, args, ctx, _info) {
				const { products } = args;
				const createdProducts = await ctx.prisma.product.createMany({
					data: products,
					skipDuplicates: true,
				})
				return createdProducts.count
			}
		})
		t.nonNull.field("updateProduct", {
			type: Product,
			args: {
				id: nonNull(stringArg()),
				product: arg({ type: nonNull(ProductInput) }),
			},
			async resolve(_parent, args, ctx, _info) {
				const { id, product } = args;
				const updatedProduct = await ctx.prisma.product.update({
					where: {
						id,
					},
					data: product,
				});
				return updatedProduct;
			}
		})
		t.nonNull.field("deleteProduct", {
			type: Product,
			args: {
				id: nonNull(stringArg()),
			},
			async resolve(_parent, args, ctx, _info) {
				const { id } = args;
				const deletedProduct = await ctx.prisma.product.delete({
					where: {
						id,
					},
				});
				return deletedProduct;
			}
		})
	}
})
import { objectType, extendType, intArg, stringArg, nonNull } from 'nexus';
import { Address } from './Address';

export const Location = objectType({
	name: 'Location',
	definition(t) {
		t.string('id');
		t.string('name');
		t.int('shipping');
		t.string('county');
		t.string('town');
		t.list.field('addresses', {
			type: Address,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.location
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.addresses();
			},
		});
	},
});

export const County = objectType({
	name: 'County',
	definition(t) {
		t.string('county');
		t.list.field('towns', {
			type: Town,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.location.findMany({
					where: {
						county: parent.county,
					},
					select: {
						town: true,
						id: true,
					},
				});
			},
		});
	},
});

export const Town = objectType({
	name: 'Town',
	definition(t) {
		t.string('town');
		t.string('id');
	},
});

export const LocationEdge = objectType({
	name: 'LocationEdge',
	definition(t) {
		t.string('cursor');
		t.field('node', {
			type: Location,
		});
	},
});

export const LocationPageInfo = objectType({
	name: 'LocationPageInfo',
	definition(t) {
		t.string('endCursor');
		t.boolean('hasNextPage');
	},
});

export const LocationResponse = objectType({
	name: 'LocationResponse',
	definition(t) {
		t.field('pageInfo', { type: LocationPageInfo });
		t.list.field('edges', {
			type: LocationEdge,
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


export const LocationsQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.field('counties', {
			type: County,
			async resolve(_parent, args, ctx) {
				return await ctx.prisma.location.findMany({
					select: { county: true },
					distinct: 'county',
				});
			},
		});
		t.field('locations', {
			type: LocationResponse,
			args: {
				first: intArg(),
				after: stringArg(),
			},
			async resolve(_parent, args, ctx) {
				let queryResults = null;

				if (args.after) {
					// check if there is a cursor as the argument
					queryResults = await ctx.prisma.location.findMany({
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
					queryResults = await ctx.prisma.location.findMany({
						take: args.first,
						orderBy: {
							index: 'desc'
						}
					});
				}
				// if the initial request returns locations
				if (queryResults.length > 0) {
					// get last element in previous result set
					const lastLocationInResults =
						queryResults[queryResults.length - 1];
					// cursor we'll return in subsequent requests
					const myCursor = lastLocationInResults.id;

					// query after the cursor to check if we have nextPage
					const secondQueryResults =
						await ctx.prisma.location.findMany({
							take: args.first,
							cursor: {
								id: myCursor,
							},
							orderBy: {
								index: 'desc'
							},
						});

					// return response
					const result = {
						pageInfo: {
							endCursor: myCursor,
							hasNextPage:
								secondQueryResults.length >= args.first, //if the number of items requested is greater than the response of the second query, we have another page
						},
						edges: queryResults.map((location) => ({
							cursor: location.id,
							node: location,
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

	},
});



export const LocationMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('createLocation', {
			type: Location,
			args: {
				name: nonNull(stringArg()),
				town: nonNull(stringArg()),
				county: nonNull(stringArg()),
				shipping: nonNull(intArg()),
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

				const newLocation = {
					name: args.name,
					town: args.town,
					county: args.county,
					shipping: args.shipping,
				};

				return await ctx.prisma.location.create({
					data: newLocation,
				});
			},
		});
		t.nonNull.field('deleteLocation', {
			type: Location,
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
				const location = await ctx.prisma.location.findUnique({
					where: { id: args.id },
				});

				if (!location) {
					throw new Error(`Location with id ${args.id} not found`);
				}

				return ctx.prisma.location.delete({
					where: {
						id: args.id,
					},
				});
			},
		});
	},
});


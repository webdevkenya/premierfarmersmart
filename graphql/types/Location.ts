import { objectType, extendType } from 'nexus';
import { Address } from './Address';

export const Location = objectType({
	name: 'Location',
	definition(t) {
		t.string('id');
		t.string('name');
		t.string('shipping');
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

export const LocationsQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.field('locations', {
			type: 'Location',
			resolve(_parent, _args, ctx) {
				return ctx.prisma.location.findMany();
			},
		});
	},
});

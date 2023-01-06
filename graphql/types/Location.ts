import { objectType, extendType } from 'nexus';
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
	},
});

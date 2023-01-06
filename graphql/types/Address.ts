import { objectType, extendType, nonNull, stringArg } from 'nexus';
import { User } from './User';
import { Location } from './Location';

export const Address = objectType({
	name: 'Address',
	definition(t) {
		t.string('id');
		t.string('first_name');
		t.string('last_name');
		t.string('mobile_phone_number');
		t.string('specific_address');
		t.boolean('is_default');
		t.field('user', {
			type: User,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.address
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.User();
			},
		});
		t.field('location', {
			type: Location,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.address
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.Location();
			},
		});
	},
});

export const AddressessQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.field('addresses', {
			type: Address,
			resolve(_parent, _args, ctx) {
				return ctx.prisma.address.findMany();
			},
		});
	},
});

export const CreateAddressMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('createAddress', {
			type: Address,
			args: {
				firstName: nonNull(stringArg()),
				lastName: nonNull(stringArg()),
				phoneNumber: nonNull(stringArg()),
				location: nonNull(stringArg()),
				specificAddress: nonNull(stringArg()),
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

				const newAddress = {
					first_name: args.firstName,
					last_name: args.lastName,
					mobile_phone_number: args.phoneNumber,
					locationId: args.location,
					userId: user.id,
					specific_address: args.specificAddress,
				};

				return await ctx.prisma.address.create({
					data: newAddress,
				});
			},
		});
		t.nonNull.field('deleteAddress', {
			type: Address,
			args: {
				id: stringArg(),
			},
			async resolve(_parent, args, ctx) {
				if (!ctx.user) {
					throw new Error(
						`You need to be logged in to perform an action`
					);
				}

				const product = await ctx.prisma.address.findUnique({
					where: { id: args.id },
				});

				if (!product) {
					throw new Error(`Address with id ${args.id} not found`);
				}

				return ctx.prisma.address.delete({
					where: {
						id: args.id,
					},
				});
			},
		});
	},
});

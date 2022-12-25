import { objectType } from 'nexus';
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

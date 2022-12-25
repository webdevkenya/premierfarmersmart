import { objectType } from 'nexus';
import { Order } from './Order';

export const Stk = objectType({
	name: 'Stk',
	definition(t) {
		t.string('id');
		t.string('merchantrequestid');
		t.string('checkoutrequestid');
		t.string('resultcode');
		t.string('resultdesc');
		t.field('order', {
			type: Order,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.stk
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.Order();
			},
		});
	},
});

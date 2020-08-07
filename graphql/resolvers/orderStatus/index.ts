import OrderStatus from "../../../models/OrderStatus";

const queries = {
	orderStatuses: async () => {
		return OrderStatus.find();
	},
}

const mutations = {
	addOrderStatus: async(args: any) => {
		if (await OrderStatus.findOne({ name: args.name })) {
			throw Error("Nombre en uso");
		}
		return await OrderStatus.create({ name: args.name });
	}
}

export default {
	queries,
	mutations,
};





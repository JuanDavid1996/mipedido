import OrderStatus from "../../../models/OrderStatus";
import {getOrderStatuses} from "../../../DataSource";

const queries = {
	orderStatuses: () => getOrderStatuses(),
}

const mutations = {
	addOrderStatus: async(context: any, args: any) => {
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





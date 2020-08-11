import OrderStatus from "../../../models/OrderStatus";
import {getOrderStatuses} from "../../../DataSource";
import {verifyCurrentUser} from "../../../helpers/authHelpers";

const queries = {
	orderStatuses: () => getOrderStatuses(),
}

const mutations = {
	addOrderStatus: async(obj: any, args: any, context: any) => {
		verifyCurrentUser(context);
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





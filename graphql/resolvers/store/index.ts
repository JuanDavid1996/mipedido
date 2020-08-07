import StoreType from "../../../models/StoreType";
import Store from "../../../models/Store";
import {
	getCategoryById,
	getStoreTypeById,
	getUserById
} from "../../../DataSource";


interface StoreInput {
	_id?: string,
	code?: string,
	name: string,
	phone: string,
	address: string,
	owner: string,
	category: string,
	storeType: string
}

interface BaseStoreInput {
	store: StoreInput
}

const validateParams = (store: StoreInput) => new Promise(async(resolve, rejected) => {
	const type: any = await getStoreTypeById(store.storeType);
	if (type === "Formal") {
		const existCode = await Store.findOne({ code: store.code });
		if (existCode) rejected("Nit en uso");
	}

	const category: any = await getCategoryById(store.category);
	if (!category) rejected("Categoria no valida");

	resolve();
});

const queries = {
	stores: async () => {
		return Store.find();
	},
	store: async(args: any) => {
		return Store.findById(args._id);
	},
}

const resolvers = {

	storeType: (args: any) => {
		return StoreType.findById(args.storeType);
	},

	category: (args: any) => {
		return getCategoryById(args.category);
	},

	owner: (args: any) => getUserById(args.owner),
}

const mutations = {

	addStore: async({store}: BaseStoreInput) => {
		await validateParams(store);
		return await Store.create(store);
	},
	updateStore: async({store}: BaseStoreInput) => {
		await validateParams(store);
	 	const params: any = { ...store }
        delete params._id;
        await Store.updateOne({ _id: store._id }, { ...params });
        return Store.findById(store._id);
	}
}

export default {
	queries,
	resolvers,
	mutations
};


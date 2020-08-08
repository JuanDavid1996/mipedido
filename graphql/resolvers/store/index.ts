import Store, {IStore} from "../../../models/Store";
import {
	getCategoryById,
	getStoreById,
	getStores,
	getStoreTypeById,
	getUserById
} from "../../../DataSource";


interface StoreInput {
	_id?: IStore["_id"],
	code?: IStore["code"],
	name: IStore["name"],
	phone: IStore["phone"],
	address: IStore["address"],
	owner: IStore["owner"],
	category: IStore["category"],
	storeType: IStore["storeType"]
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
	stores: async () => getStores(),
	store: async(context: any, args: any) => getStoreById(args._id),
}

const resolvers = {

	storeType: (context: any, args: any) => getStoreTypeById(args.storeType),

	category: (context: any, args: any) => getCategoryById(args.category),

	owner: (context: any, args: any) => getUserById(args.owner),
}

const mutations = {

	addStore: async(context: any, {store}: any) => {
		await validateParams(store);
		return await Store.create(store);
	},
	updateStore: async(context: any, {store}: BaseStoreInput) => {
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


import Store, {IStore} from "../../../models/Store";
import {
	getCategoryById,
	getStoreById,
	getStores, getStoresByOwner,
	getStoreTypeById,
	getUserById
} from "../../../DataSource";
import {verifyCurrentUser} from "../../../helpers/authHelpers";
import {ICategory} from "../../../models/Category";


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
	store: async(obj: any, args: any, context: any) => {
		verifyCurrentUser(context);
		return getStoreById(args._id)
	},
	storesByOwner(obj: any, args: any, context: any) {
		verifyCurrentUser(context);
		return getStoresByOwner(args.owner);
	},
	async storesByCriteria(obj: any, args: any) {
		const conditions: any = {};
		if (args.criteria && args.criteria.trim() !== "") conditions.criteria = args.criteria;
		const category = await getCategoryById(args.category) as ICategory;
		if (category.name !== "Todo") conditions.category = args.category;
		return Store.find(conditions);
	}
}

const resolvers = {

	storeType: (args: any) => getStoreTypeById(args.storeType),

	category: (args: any) => getCategoryById(args.category),

	owner: (args: any) => getUserById(args.owner),
}

const mutations = {

	addStore: async(obj: any, {store}: any, context: any) => {
		verifyCurrentUser(context);
		await validateParams(store);
		return await Store.create(store);
	},

	updateStore: async(obj: any, {store}: BaseStoreInput, context: any) => {
		verifyCurrentUser(context);
		await validateParams(store);
	 	const params: any = { ...store }
        delete params._id;
        await Store.updateOne({ _id: store._id }, { ...params });
        return Store.findById(store._id);
	},

}

export default {
	queries,
	resolvers,
	mutations
};


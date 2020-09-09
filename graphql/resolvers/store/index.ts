import Store, {IStore} from "../../../models/Store";
import {
	getCategoryById,
	getStoreById,
	getStores, getStoresByOwner,
	getStoreTypeById,
	getUserById
} from "../../../DataSource";
import {
	verifyCurrentUser,
	checkPermission
} from "../../../helpers/authHelpers";
import {ICategory} from "../../../models/Category";
import { PERMISSIONS } from "../../../constants";


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
		console.log(args);
		return getStoresByOwner(args.owner);
	},
	async storesByCriteria(obj: any, args: any) {
		const conditions: any = {};
		if (args.criteria && args.criteria.trim() !== "") {
			conditions.name = { $regex: '.*'+ args.criteria + '.*', '$options' : 'i' }; 
		}
		const category = await getCategoryById(args.category) as ICategory;
		if (category.name !== "Todo") conditions.category = args.category;
		console.log(conditions)
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
        return getStoreById(store._id);
	},
	deleteStore: async(obj: any, {_id}: any, context: any) => {
		verifyCurrentUser(context);
		await checkPermission(PERMISSIONS.DELETE_STORE, context);
		const deleteStore = await Store.findByIdAndRemove(_id)
		if(!deleteStore) {
         	throw new Error('Error');
      	}
		return deleteStore
	}
}

export default {
	queries,
	resolvers,
	mutations
};


const Store = require("@models/Store").Stores;
const StoreType = require("@models/StoreType").StoreTypes;
const Category = require("@models/Category").Categories;

import { IResolvers } from "graphql-tools";

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
	const type = await StoreType.findById(store.storeType);
	if (type === "Formal") {
		const existCode = await Store.findOne({ code: store.code });
		if (existCode) rejected("Nit en uso");
	}

	const category = await Category.findById(store.category);
	if (!category) rejected("Categoria no valida");

	resolve();
});


const storesolvers: IResolvers = {
	stores: async () => {
		return await Store.find();
	},
	store: async(args) => {
		return await Store.findById(args._id).populate(["user", "storeType", "category", "owner"]).exec();
	},

	addStore: async({store}: BaseStoreInput) => {
		await validateParams(store);
		return await Store.create(store);
	},
	updateStore: async({store}: BaseStoreInput) => {
		await validateParams(store);
	 	const params: any = { ...store }
        delete params._id;
        await Store.updateOne({ _id: store._id }, { ...params });
        return await Store.findById(store._id);
	}
}

export default storesolvers;


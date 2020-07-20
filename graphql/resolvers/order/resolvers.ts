const Category = require("../../../models/Category").Categories;
import { IResolvers } from "graphql-tools";

const orderResolvers: IResolvers = {
    Query: {
        getCategories: (parent, args) => {
            return Category.find({});
        },
        getCategory: (parent, args) => {
            return Category.findById(args.id);
        }
    },
    Mutation: {
        addCategory(parent, args) {
            let category = new Category({name: args.name});
            return category.save();
        },
        updateCategory(parent, args) {
            if (!args.id) return;
            return Category.findOneAndUpdate(
                {
                    _id: args.id
                },{
                    $set: {
                        name: args.name
                    }
                }, {new: true}, (err: any, category: any) => {
                    if (err) {
                        throw new Error("Se produjo un error al actualizar la categoria")
                    }
                    return category;
                }
            )
        }
    }
}
export default orderResolvers;
const Category = require("../../../models/Category").Categories;
import { IResolvers } from "graphql-tools";

const categoryResolvers: IResolvers = {

    getCategories: (parent, args) => {
        return Category.find({});
    },
    getCategory: (parent, args) => {
        return Category.findById(args.id);
    },

    addCategory({name}) {
        let category = new Category({name: name});
        console.log(name);
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
    },
    deleteCategory({id}) {
        return Category.findOneAndDelete({_id: id})
    }

}
export default categoryResolvers;
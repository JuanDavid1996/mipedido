import Category from "../../../models/Category";
import {getCategories, getCategoryById} from "../../../DataSource";
import {verifyCurrentUser} from "../../../helpers/authHelpers";

const queries = {
    categories: () => getCategories(),
    category: (obj: any, args: any) => getCategoryById(args._id),
}

const mutations = {

    addCategory(obj: any, {name}: any, context: any) {
        verifyCurrentUser(context);
        let category = new Category({name: name});
        console.log(name);
        return category.save();
    },
    updateCategory(obj: any, args: any, context: any) {
        verifyCurrentUser(context);
        if (!args._id) return;
        return Category.findOneAndUpdate(
            {
                _id: args._id
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
    deleteCategory(obj: any, {id: _id}: any, context: any) {
        verifyCurrentUser(context);
        return Category.findOneAndDelete({_id})
    }

}
export default {
    queries,
    mutations
}
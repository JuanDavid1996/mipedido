import Category from "../../../models/Category";

const queries = {

    categories: () => {
        return Category.find({});
    },
    category: (args: any) => {
        return Category.findById(args.id);
    },
}

const mutations = {

    addCategory({name}: any) {
        let category = new Category({name: name});
        console.log(name);
        return category.save();
    },
    updateCategory(args: any) {
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
    deleteCategory({id: _id}: any) {
        return Category.findOneAndDelete({_id})
    }

}
export default {
    queries,
    mutations
}
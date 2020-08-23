import SuggestedStore from "../../models/SuggestedStore";
import {getCategoryById, getSuggestedStores} from "../../DataSource";

const queries = {
  suggestedStores() {
    return getSuggestedStores()
  }
}

const resolvers = {
  category: (args: any) => getCategoryById(args.category),
}

const mutations = {
  addSuggestedStore(obj: any, args: any, context: any) {
    return SuggestedStore.create(args.suggestedStore);
  }
}

export default  {
  queries,
  resolvers,
  mutations,
}
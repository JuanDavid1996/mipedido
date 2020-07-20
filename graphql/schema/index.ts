import {buildSchema} from "graphql";

const typeDefs =  buildSchema(`
    type Category {
        id: ID!
        name: String!
    }

    type Query {
        getCategories: [Category]
        getCategory(id: ID!): Category
    }

    type Mutation {
        addCategory(name: String!): Category
        updateCategory(id: ID!, name: String!): Category
        deleteCategory(id: ID!): Category
    }
`)
export default typeDefs;
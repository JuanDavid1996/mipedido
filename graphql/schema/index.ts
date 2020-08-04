import {buildSchema} from "graphql";

const typeDefs =  buildSchema(`
    scalar Date
    scalar MongoObjectId

    input StoreInput {
        _id: String
        code: String
        name: String!
        address: String!
        phone: String!
        category: String!
        storeType: String!
        owner: String!
    }
    
    input UserInput {
        code: String!
        firstName: String!
        lastName: String!
        phone: String!
        username: String!
        password: String!
        role: String
    }

    input UserUpdateInput {
        _id: MongoObjectId!
        code: String!
        firstName: String!
        lastName: String!
        phone: String!
        username: String!
        role: String
    }
    
    input PermissionInput {
        name: String!
        resource: String!
        role: String!
    }

    
    type Category {
        _id: MongoObjectId!
        name: String!
    }
    
    type User {
        _id: MongoObjectId!
        code: String!
        firstName: String!
        lastName: String!
        phone: String!
        role: Role!
        username: String!
    }
    
    type Store {
        _id: MongoObjectId!
        code: String!
        name: String!
        address: String!
        phone: String!
        category: Category!
        storeType: StoreType!
        owner: User!
    }

    type StoreType {
        _id: MongoObjectId!
        name: String!
    }

    
    type Order {
        _id: MongoObjectId!
        client: User!
        domiciliary: User!
        store: Store!
        description: String!
        origin: String!
        destination: String!
    }
    
    type Role {
        _id: MongoObjectId!
        name: String!
        permissions: [Permission]
    }
    
    type Permission {
        _id: MongoObjectId!
        name: String!
        resource: String!
        role: Role!
    }

    type Query {
        categories: [Category]
        category(_id: MongoObjectId!): Category
        
        orders: [Order]
        order(_id: MongoObjectId!): Order
        
        stores: [Store]
        store(_id: MongoObjectId!): Store
        
        roles: [Role]
        role(_id: MongoObjectId!): Role
        
        permissions: [Permission]
        permission(_id: MongoObjectId!): Permission
        
        users: [User]
        user(_id: MongoObjectId!): User
        shopkeepers: [User]

        storeTypes: [StoreType]
        storeType(_id: MongoObjectId!): StoreType
    }

    type Mutation {
        addCategory(name: String!): Category
        updateCategory(_id: MongoObjectId!, name: String!): Category
        deleteCategory(_id: MongoObjectId!): Category
        
        addStore(store: StoreInput!): Store
        updateStore(store: StoreInput!): Store
        deleteStore(_id: MongoObjectId!): Store
        
        addRole(name: String!): Role
        updateRole(_id: MongoObjectId!, name: String!): Role
        deleteRole(_id: MongoObjectId!): Role
        
        addPermission(permission: PermissionInput!): Permission
        updatePermission(_id: MongoObjectId!, permission: PermissionInput!): Permission
        deletePermission(_id: MongoObjectId!): Permission
        
        addUser(user: UserInput!): User!
        updateUser(user: UserUpdateInput!): User
        deleteUser(_id: MongoObjectId!): User

        addStoreType(name: String!): StoreType
        updateStoreType(_id: MongoObjectId!, name: String!): StoreType
        deleteStoreType(_id: MongoObjectId!): StoreType
    }
`)
export default typeDefs;
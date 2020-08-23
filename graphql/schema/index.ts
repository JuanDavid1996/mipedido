const typeDefs = `
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
        resource: String!
    }

    input OrderInput {
        _id: MongoObjectId
        description: String!
        client: String
        destination: String!
        domiciliary: String
        store: String
    }
    
    input ClientInput {
        _id: MongoObjectId
        code: String!
        firstName: String!
        lastName: String
        phone: String!
        store: String
        address: String!
    }
    
    input SuggestedStoreInput {
      name: String!
      address: String!
      phone: String!
      owner: String!
      category: String!
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
        client: Client!
        domiciliary: User
        store: Store!
        description: String!
        origin: String!
        destination: String!
        status: OrderStatus!
        createdAt: Date
        updatedAt: Date
    }

    type OrderStatus {
        _id: MongoObjectId!
        name: String!
    }
    
    type Role {
        _id: MongoObjectId!
        name: String!
        permissions: [Permission]
    }
    
    type Permission {
        _id: MongoObjectId!
        resource: String!
    }
    
    type UserDevice {
        _id: MongoObjectId!
        user: User!
        firebaseToken: String!
    }
    
    type Client {
        _id: MongoObjectId!
        code: String!
        firstName: String!
        lastName: String!
        phone: String!
        store: Store!
        user: User
        address: String
    }
    
    type SuggestedStore {
      name: String!
      address: String!
      phone: String!
      owner: String!
      category: Category
    }

    type Query {
        categories: [Category]
        category(_id: MongoObjectId!): Category
        
        orders: [Order]
        order(_id: MongoObjectId!): Order
        ordersAvailable: [Order]
        
        stores: [Store]
        store(_id: MongoObjectId!): Store
        storesByOwner(owner: MongoObjectId!): [Store]
        storesByCriteria(criteria: String!, category: MongoObjectId!): [Store]
        
        roles: [Role]
        role(_id: MongoObjectId!): Role
        
        permissions: [Permission]
        permission(_id: MongoObjectId!): Permission
        
        users: [User]
        user(_id: MongoObjectId!): User
        shopkeepers: [User]
        clients: [User]
        currentUser(token: String): User

        storeTypes: [StoreType]
        storeType(_id: MongoObjectId!): StoreType

        orderStatuses: [OrderStatus]
        
        storeClients(store: String, code: String, firstName: String, phone: String): [Client]
        storeClient(_id: MongoObjectId!): Client
        
        userDevices: [UserDevice]
        
        suggestedStores: [SuggestedStore]
    }

    type Mutation {
        login(username: String!, password: String!): String
    
    
        addCategory(name: String!): Category
        updateCategory(_id: MongoObjectId!, name: String!): Category
        deleteCategory(_id: MongoObjectId!): Category
        
        addStore(store: StoreInput!): Store
        updateStore(store: StoreInput!): Store
        deleteStore(_id: MongoObjectId!): Store
        
        addRole(name: String!): Role
        updateRole(_id: MongoObjectId!, name: String!): Role
        addPermissionToRole(_id: MongoObjectId, permission: MongoObjectId!): Role
        removePermissionToRole(_id: MongoObjectId, permission: MongoObjectId!): Role
        deleteRole(_id: MongoObjectId!): Role
        
        addPermission(resource: String!): Permission
        updatePermission(_id: MongoObjectId!, resource: String!): Permission
        deletePermission(_id: MongoObjectId!): Permission
        
        addUser(user: UserInput!): User!
        updateUser(user: UserUpdateInput!): User
        deleteUser(_id: MongoObjectId!): User

        addStoreType(name: String!): StoreType
        updateStoreType(_id: MongoObjectId!, name: String!): StoreType
        deleteStoreType(_id: MongoObjectId!): StoreType

        addOrder(order: OrderInput!): Order
        takeOrder(_id: MongoObjectId!, domiciliary: MongoObjectId!): Order
        updateOrder(order: OrderInput!): Order
        updateOrderStatus(_id: MongoObjectId!, status: String!): Order
        deleteOrder(_id: MongoObjectId!): Order

        addOrderStatus(name: String!): OrderStatus
        
        addStoreClient(client: ClientInput!): Client
        updateStoreClient(client: ClientInput!): Client
        
        updateUserDevice(firebaseToken: String!): UserDevice
        
        addSuggestedStore(suggestedStore: SuggestedStoreInput): SuggestedStore
    }
`
export default typeDefs;
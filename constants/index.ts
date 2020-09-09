export enum BASE_ROLES {
	ADMIN = "Admin",
	TENDERO = "Tendero",
	DOMICILIARIO = "Domiciliario",
	CLIENTE = "Cliente",
}

export enum ORDER_STATUS {
	PENDIENTE = "Pendiente",
	TOMADO = "Tomado",
	EN_CURSO = "En curso",
	COMPLETADA = "Completada",
	CANCELADA = "Cancelada"
}

export enum PERMISSIONS {
    TAKE_ORDER = "takeOrder",
    UPDATE_PERMISSIONS = "updatePermission",
    CURRENT_ORDER = "currentOrder",
    VERIFY_CURRENT_ORDER = "verifyCurrentOrder",
    DELETE_USER = "deleteUser",
    LIST_USER = "listUser",
    LIST_CUSTOMER = "listCustomer",
    LIST_SHOP_KEEPER = "listShopKepper",
    SHOW_USER = "showUser",
    DELETE_ORDER = "deleteOrder",
    UPDATE_ORDER = "updateOrder",
    ADD_ORDER = "addOrder",
    LIST_ORDERS_BY_DOMICILIARY = "listOrdersByDomiciliary",
    LIST_ORDERS_BY_STORE = "listOrdersByStore",
    LIST_ORDERS_BY_CLIENT = "listOrdersByClient",
    SHOW_ORDER = "showOrder",
    LIST_PERMISSION = "listPermission",
    SHOW_PERMISSION = "showPermission",
    ADD_PERMISSION = "addPermission",
    DELETE_PERMISSION = "deletePermission",
    LIST_ROLE = "listRole",
    SHOW_ROLE = "showRole",
    ADD_ROLE = "addRole",
    UPDATE_ROLE = "updateRole",
    DELETE_ROLE = "deleteRole",
    ADD_PERMISSION_TO_ROLE = "addPermissionToRole",
    REMOVE_PERMISSION_TO_ROLE = "removePermissionToRole",
    DELETE_STORE = "deleteStore"
}

export enum ORDER_FIELDS {
  OWNER = "owner"

}

export enum  ORDER_STATUS_FIELDS {
	STATUS = "status"
}
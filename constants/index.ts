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
}

export enum ORDER_FIELDS {
  OWNER = "owner"

}

export enum  ORDER_STATUS_FIELDS {
	STATUS = "status"
}
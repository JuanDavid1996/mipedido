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
}

export enum ORDER_FIELDS {
  OWNER = "owner"

}

export enum  ORDER_STATUS_FIELDS {
	STATUS = "status"
}
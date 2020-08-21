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
	ENTREGADO = "Entregado",
	CANCELADO = "Cancelado"
}

export enum PERMISSIONS {
	TAKE_ORDER = "takeOrder",
}

export enum ORDER_FIELDS {
  OWNER = "owner"

}

export enum  ORDER_STATUS_FIELDS {
	STATUS = "status"
}
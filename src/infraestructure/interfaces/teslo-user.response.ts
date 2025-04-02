// import { UserRole } from "../../infraestructure/interfaces/role.interface";

export interface TesloUser {
    id: string;
    nombre: string;
    apellido_p: string;
    apellido_m: string;
    username: string;
    no_empleado: string;
    img_user: string;
    correo: string;
    telefono: string;
    id_empresa: string;
    // role: UserRole;
    estatus: boolean;
}
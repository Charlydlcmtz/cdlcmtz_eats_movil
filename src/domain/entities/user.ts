import { UserRole } from "../../infraestructure/interfaces/role.interface";

export interface User {
    id: number;
    username: string;
    no_empleado: string;
    img_user: string;
    correo: string;
    telefono: string;
    id_empresa: string;
    role: UserRole;
}
import { UserRole } from "./role.interface";

export interface AuthResponse {
    id: number;
    username: string;
    no_empleado: string;
    img_user: string;
    correo: string;
    telefono: string;
    id_empresa: string;
    role: UserRole;
    token: string;
}
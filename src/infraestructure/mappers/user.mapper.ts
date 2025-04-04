import { User } from "../../domain/entities/user";
import { TesloUser } from "../interfaces/teslo-user.response";



export class UserMapper {

    static tesloUserToEntity( tesloUser: TesloUser ):User {

        return {
            id: tesloUser.id,
            nombre: tesloUser.nombre,
            username: tesloUser.username,
            apellido_p: tesloUser.apellido_p,
            apellido_m: tesloUser.apellido_m,
            no_empleado: tesloUser.no_empleado,
            img_user: `http://192.168.0.15/api_cdlcmtz_eats/public/img_users/${tesloUser.img_user}`,
            correo: tesloUser.correo,
            telefono: tesloUser.telefono,
            id_empresa: tesloUser.id_empresa,
            // role: tesloUser.role,
            estatus: tesloUser.estatus,
        };
    }
}
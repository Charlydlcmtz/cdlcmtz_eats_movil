import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { User } from "../../domain/entities/user";
import { TesloUser } from "../../infraestructure/interfaces/teslo-user.response";
import { UserMapper } from "../../infraestructure/mappers/user.mapper";



const emptyUser: User = {
    id: '',
    nombre: 'Nuevo Usuario',
    apellido_p: '',
    apellido_m: '',
    username: '',
    no_empleado: '',
    img_user: '',
    correo: '',
    telefono: '',
    id_empresa: '',
    estatus: true,
}



export const getUserById = async (id: string):Promise<User> => {

    if (id === 'new') return emptyUser;

    try {
        const { data } = await cdlcmtzEatsApi.get<TesloUser>(`/usuarios/get-usuario/${id}`);

        return UserMapper.tesloUserToEntity(data);

    } catch (error) {
        console.log(error);
        throw new Error("Error al actualizar el usuario");
    }
}
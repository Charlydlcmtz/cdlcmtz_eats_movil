import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { User } from "../../domain/entities/user";
import { TesloUser } from "../../infraestructure/interfaces/teslo-user.response";
import { UserMapper } from "../../infraestructure/mappers/user.mapper";


export const searchUserByPage = async (search: string): Promise<User[]> => {
    try {
        const { data } = await cdlcmtzEatsApi.get<TesloUser[]>(`/usuarios/search-usuario/${search}`);
        const users = data.map( UserMapper.tesloUserToEntity );
        return users;

    } catch (error) {
        console.log(error);
        throw new Error("Error al buscar usuario");
    }

}
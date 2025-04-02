import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { User } from "../../domain/entities/user";
import { TesloUser } from "../../infraestructure/interfaces/teslo-user.response";
import { UserMapper } from "../../infraestructure/mappers/user.mapper";


export const getUserByPage = async (page: number, limit: number = 20): Promise<User[]> => {
    try {
        const { data } = await cdlcmtzEatsApi.post<TesloUser[]>(`/usuarios/list-usuarios`);
        const users = data.map( UserMapper.tesloUserToEntity );
        return users;

    } catch (error) {
        console.log(error);
        throw new Error("Error getting foods");
    }

}
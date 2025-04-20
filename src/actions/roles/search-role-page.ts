
import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { Role } from "../../domain/entities/role";
import { TesloRole } from "../../infraestructure/interfaces/teslo-role.response";
import { RoleMapper } from "../../infraestructure/mappers/role.mapper";




export const searchRoleByPage = async (search: string): Promise<Role[]> => {
    try {
        const { data } = await cdlcmtzEatsApi.get<TesloRole[]>(`/roles/search-rol/${search}`);
        const roles = data.map( RoleMapper.tesloRoleToEntity );
        return roles;

    } catch (error) {
        console.log(error);
        throw new Error("Error al buscar el tipo de menu");
    }

}
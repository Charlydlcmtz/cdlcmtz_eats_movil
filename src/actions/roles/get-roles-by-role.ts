import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { Role } from "../../domain/entities/role";
import { TesloRole } from "../../infraestructure/interfaces/teslo-role.response";
import { RoleMapper } from "../../infraestructure/mappers/role.mapper";





export const getRoles = async ():Promise<Role[]> => {

    try {
        const { data } = await cdlcmtzEatsApi.post<TesloRole[]>(`/roles/list-roles`);

        if (!data || !Array.isArray(data)) {
            throw new Error("La respuesta del backend no es válida");
        }

        const roles = data.map(RoleMapper.tesloRoleToEntity);

        return roles;

    } catch (error) {
        console.log(error);
        throw new Error("Error al traer roles");
    }
}
import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { Role } from "../../domain/entities/role";
import { TesloRole } from "../../infraestructure/interfaces/teslo-role.response";
import { RoleMapper } from "../../infraestructure/mappers/role.mapper";



const emptyRole: Role = {
    id: '',
    nombre: 'Nuevo Rol',
    descripcion: '',
    estatus: 1,
};



export const getRoleById = async (id: string):Promise<Role> => {

    if (id === 'new') return emptyRole;

    try {
        const { data } = await cdlcmtzEatsApi.get<TesloRole>(`/roles/get-role/${id}`);
        console.log(data);

        return RoleMapper.tesloRoleToEntity(data);

    } catch (error) {
        console.log(error);
        throw new Error("Error al traer el rol.");
    }
}
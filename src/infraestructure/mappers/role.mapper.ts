import { Role } from "../../domain/entities/role";
import { TesloRole } from "../interfaces/teslo-role.response";




export class RoleMapper {

    static tesloRoleToEntity( tesloRole: TesloRole ):Role {

        return {
            id: tesloRole.id,
            nombre: tesloRole.nombre,
            descripcion: tesloRole.descripcion,
            estatus: true,
        };
    }
}
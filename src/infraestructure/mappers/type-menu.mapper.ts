import { TypeMenu } from "../../domain/entities/type-menu";
import { TesloTypeMenu } from "../interfaces/teslo-menu-type.response";





export class TypeMenuMapper {

    static tesloTypeMenuToEntity( tesloTypeMenu: TesloTypeMenu ):TypeMenu {

        return {
            id: tesloTypeMenu.id,
            nombre: tesloTypeMenu.nombre_menu,
            descripcion: tesloTypeMenu.descripcion_menu,
            id_empresa: tesloTypeMenu.id_empresa,
            estatus: true,
        };
    }
}
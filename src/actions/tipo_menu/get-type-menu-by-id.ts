import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { TypeMenu } from "../../domain/entities/type-menu";
import { TesloTypeMenu } from "../../infraestructure/interfaces/teslo-menu-type.response";
import { TypeMenuMapper } from "../../infraestructure/mappers/type-menu.mapper";



const emptyTypeMenu: TypeMenu = {
    id: '',
    nombre: 'Nuevo Tipo Menu',
    descripcion: '',
    id_empresa: '',
    estatus: true,
};



export const getTypeMenuById = async (id: string):Promise<TypeMenu> => {

    if (id === 'new') return emptyTypeMenu;

    try {
        const { data } = await cdlcmtzEatsApi.get<TesloTypeMenu>(`/menu/get-menu/${id}`);

        return TypeMenuMapper.tesloTypeMenuToEntity(data);

    } catch (error) {
        console.log(error);
        throw new Error("Error al actualizar el tipo de menu");
    }
}
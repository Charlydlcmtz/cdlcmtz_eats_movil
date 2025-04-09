import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { TypeMenu } from "../../domain/entities/type-menu";
import { TesloTypeMenu } from "../../infraestructure/interfaces/teslo-menu-type.response";
import { TypeMenuMapper } from "../../infraestructure/mappers/type-menu.mapper";





export const getTypeMenus = async ():Promise<TypeMenu[]> => {

    try {
        const { data } = await cdlcmtzEatsApi.post<TesloTypeMenu[]>(`/menu-type/list-menu-type`);

        if (!data || !Array.isArray(data)) {
            throw new Error("La respuesta del backend no es válida");
        }

        const typeMenus = data.map(TypeMenuMapper.tesloTypeMenuToEntity);

        return typeMenus;

    } catch (error) {
        console.log(error);
        throw new Error("Error al traer tipos de menu");
    }
}
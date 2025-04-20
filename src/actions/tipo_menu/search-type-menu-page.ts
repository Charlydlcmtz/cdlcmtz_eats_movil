import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { TypeMenu } from "../../domain/entities/type-menu";
import { TesloTypeMenu } from "../../infraestructure/interfaces/teslo-menu-type.response";
import { TypeMenuMapper } from "../../infraestructure/mappers/type-menu.mapper";



export const searchTypeMenuByPage = async (search: string): Promise<TypeMenu[]> => {
    try {
        const { data } = await cdlcmtzEatsApi.get<TesloTypeMenu[]>(`/menu/search-menu/${search}`);
        const typeMenu = data.map( TypeMenuMapper.tesloTypeMenuToEntity );
        return typeMenu;

    } catch (error) {
        console.log(error);
        throw new Error("Error al buscar el tipo de menu");
    }

}
import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { Food } from "../../domain/entities/food";
import { TesloFood } from "../../infraestructure/interfaces/teslo-food.response";
import { FoodMapper } from "../../infraestructure/mappers/food.mapper";


export const getAvailableMenus = async (): Promise<Food[]> => {
    try {
        const { data } = await cdlcmtzEatsApi.post<TesloFood[]>(`/menu/list-food`);

        if (!data || !Array.isArray(data)) {
            throw new Error("La respuesta del backend no es válida");
        }

        const menu = data.map(FoodMapper.tesloFoodToEntity);

        return menu;

    } catch (error) {
        console.error("Error al obtener el menú disponible:", error);
        throw new Error("Error al traer el menu");
    }
}

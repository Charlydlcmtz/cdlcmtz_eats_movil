import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import type { Menu } from "../../domain/entities/food";
import type { TesloFood } from "../../infraestructure/interfaces/teslo-food.response";
import { FoodMapper } from '../../infraestructure/mappers/food.mapper';

export const searchFoodByPage = async (search: string): Promise<Menu[]> => {
    try {
        const { data } = await cdlcmtzEatsApi.get<TesloFood[]>(`/menu/search-food/${search}`);

        const foods = data.map( FoodMapper.tesloFoodToEntity );
        return foods;

    } catch (error) {
        console.log(error);
        throw new Error("Error al buscar la comida");
    }
};
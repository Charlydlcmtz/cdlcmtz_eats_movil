import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import type { Menu } from "../../domain/entities/food";
import type { TesloFood } from "../../infraestructure/interfaces/teslo-food.response";
import { FoodMapper } from '../../infraestructure/mappers/food.mapper';

export const getFoodByPage = async (page: number, limit: number = 20): Promise<Menu[]> => {
    try {
        const { data } = await cdlcmtzEatsApi.post<TesloFood[]>(`/menu/list-food`);

        const foods = data.map( FoodMapper.tesloFoodToEntity );
        return foods;

    } catch (error) {
        console.log(error);
        throw new Error("Error getting foods");
    };
};
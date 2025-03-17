import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import type { Food } from "../../domain/entities/food";
import type { TesloFood } from "../../infraestructure/interfaces/teslo-food.response";
import { FoodMapper } from '../../infraestructure/mappers/food.mapper';

export const getFoodByPage = async (page: number, limit: number = 20): Promise<Food[]> => {
    try {
        const { data } = await cdlcmtzEatsApi.post<TesloFood[]>(`/menu/list-food`);

        const foods = data.map( FoodMapper.tesloFoodToEntity );
        console.log(foods[0]);
        return foods;

    } catch (error) {
        console.log(error);
        throw new Error("Error getting foods");
    }

}
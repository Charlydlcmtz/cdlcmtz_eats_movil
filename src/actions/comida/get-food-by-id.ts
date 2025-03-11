import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { Food } from "../../domain/entities/food"
import { TesloFood } from "../../infraestructure/interfaces/teslo-food.response"
import { FoodMapper } from "../../infraestructure/mappers/food.mapper";





export const getFoodById = async (id: string):Promise<Food> => {
    

    try {
        
        const { data } = await cdlcmtzEatsApi.get<TesloFood>(`/menu/food/${id}`);

        return FoodMapper.tesloFoodToEntity(data);

    } catch (error) {
        console.log(error);
        throw new Error(`Error getting food by id; ${id}`);
    }
    
}

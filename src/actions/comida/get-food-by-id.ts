import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { Food } from "../../domain/entities/food"
import { TesloFood } from "../../infraestructure/interfaces/teslo-food.response"
import { FoodMapper } from "../../infraestructure/mappers/food.mapper";


const emptyFood: Food = {
    id: '',
    platillo: 'Nuevo Platillo',
    descripcion: '',
    costo: 0,
    calorias: '',
    img_comida: '',
    estatus: 1,
}



export const getFoodById = async (id: string):Promise<Food> => {

    if (id === 'new') return emptyFood;

    try {
        const { data } = await cdlcmtzEatsApi.get<TesloFood>(`/menu/food/${id}`);

        return FoodMapper.tesloFoodToEntity(data);

    } catch (error) {
        console.log(error);
        throw new Error("Error al actualizar la comida");
    }
}
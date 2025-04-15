import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { Food } from "../../domain/entities/food"
import { TesloFood } from "../../infraestructure/interfaces/teslo-food.response"
import { FoodMapper } from "../../infraestructure/mappers/food.mapper";


const emptyFood: Food = {
    id: '',
    platillo: 'Nuevo Platillo',
    descripcion: '',
    costo: '0',
    calorias: '',
    img_comida: '',
    inicio_fecha_platillo: new Date(),
    fin_fecha_platillo: new Date(),
    empresa: {
        id: '',
        nombre: '',
        rfc: '',
        telefono: '',
        correo: '',
        icon: '',
        colors: '',
        estatus: true,
    },
    tipo_menu: {
        id: '',
        nombre_menu: '',
        descripcion_menu: '',
        id_empresa: '',
        estatus: true,
    },
    estatus: 1,
    pivot: {
        id: '',
        pedido_id: 0,
        menu_id: 0,
        cantidad: 0,
    },
};

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
import type { Food } from "../../domain/entities/food";
import type { TesloFood } from "../interfaces/teslo-food.response";




export class FoodMapper {

    static tesloFoodToEntity( tesloFood: TesloFood ):Food {
        
        return {
            id: tesloFood.id,
            platillo: tesloFood.platillo,
            descripcion: tesloFood.descripcion,
            costo: tesloFood.costo,
            calorias: tesloFood.calorias,
            img_comida: `http://192.168.0.17/api_cdlcmtz_eats/public/comida/${tesloFood.img_comida}`,
            inicio_fecha_platillo: tesloFood.inicio_fecha_platillo,
            fin_fecha_platillo: tesloFood.fin_fecha_platillo,
            empresa: tesloFood.empresa,
            tipo_menu: tesloFood.tipo_menu,
            estatus: tesloFood.estatus,
            pivot: tesloFood.pivot
        }

    }

}
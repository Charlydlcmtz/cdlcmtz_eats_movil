import { isAxiosError } from "axios";
import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { Food } from "../../domain/entities/food";



export const updateCreateFood = ( food: Partial<Food> ) => {


    food.costo = Number(food.costo);

    if ( food.id ) {
        return updateFood(food);
    }

    throw new Error("Creación no esta implementada");

}

//TODO revisar si viene el usuario
const updateFood = async (food: Partial<Food>) => {
    console.log({food});
    const { id, img_comida, ... rest } = food;

    try {
        const checkedImages = prepareImages(img_comida);
        console.log({ checkedImages });

        const { data } = await cdlcmtzEatsApi.post(`/menu/food-update/${id}`, {
            img_comida: checkedImages,
            ... rest
        })

        return data;

    } catch (error) {

        if ( isAxiosError(error) ) {
            console.log(error.response?.data);
        }

        throw new Error("Error al actualizar la comida");
    }
}


const prepareImages = ( images: string | undefined ) => {
    // TODO revisar los files
    
    return images;
}
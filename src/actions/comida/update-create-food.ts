import { isAxiosError } from "axios";
import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { Food } from "../../domain/entities/food";



export const updateCreateFood = ( food: Partial<Food> ) => {

    food.costo = isNaN(Number(food.costo)) ? 0 : Number(food.costo);

    if ( food.id && food.id === 'new') {
        return updateFood(food);
    }

    return createFood( food );

};

const prepareImages = ( images: string | undefined ) => {
    // TODO revisar los files
    return images;
};

//TODO revisar si viene el usuario
const updateFood = async (food: Partial<Food>) => {
    const { id, img_comida, ... rest } = food;

    try {
        const checkedImages = prepareImages(img_comida);

        const { data } = await cdlcmtzEatsApi.post(`/menu/food-update/${id}`, {
            img_comida: checkedImages,
            ... rest,
        });

        return data;

    } catch (error) {
        if (isAxiosError(error)) {
            console.error("❌ Error en la petición:", {
                status: error.response?.status,
                data: error.response?.data,  // ← Esto mostrará el mensaje del backend
                headers: error.response?.headers,
            });
        } else {
            console.error("❌ Error inesperado:", error);
        }
    
        throw new Error("Error al actualizar la comida");
    }
};

const createFood = async(food: Partial<Food>) => {
    const { id, img_comida, ... rest } = food;

    try {
        const checkedImages = prepareImages(img_comida);

        const { data } = await cdlcmtzEatsApi.post(`/menu/food-add/${id}`, {
            img_comida: checkedImages,
            ... rest,
        });

        return data;

    } catch (error) {
        if (isAxiosError(error)) {
            console.error("❌ Error en la petición:", {
                status: error.response?.status,
                data: error.response?.data,  // ← Esto mostrará el mensaje del backend
                headers: error.response?.headers,
            });
        } else {
            console.error("❌ Error inesperado:", error);
        }
        throw new Error("Error al actualizar la comida");
    }
}
import { isAxiosError } from "axios";
import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { Food } from "../../domain/entities/food";



export const updateCreateFood = ( food: Partial<Food> ) => {

    food.costo = isNaN(Number(food.costo)) ? 0 : Number(food.costo);

    if ( food.id && food.id !== 'new') {
        return updateFood(food);
    }

    return createFood( food );

};

const prepareImages = async( images: string ) => {
    // TODO revisar los files
    if (!images.includes("file://")) {
        return images;
    }

    // Si la imagen es nueva (viene del dispositivo), la subimos
    const uploadedImage = await uploadImage(images);
    return uploadedImage;
};

//luego lo implemento
const uploadImage = async (image: string) => {
    const formData = new FormData();
    formData.append("img_comida_file", {
        uri: image,
        type: 'image/jpeg',
        name: image.split('/').pop(),
    });

    const { data } = await cdlcmtzEatsApi.post<{ image: string }>('/menu/food-file', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data.image;
}

//TODO revisar si viene el usuario
const updateFood = async (food: Partial<Food>) => {
    const { id, img_comida, ... rest } = food;

    if (!img_comida) {
        throw new Error("No se proporcionó ninguna imagen");
    }

    try {
        const checkedImages = await prepareImages(img_comida);

        const { data } = await cdlcmtzEatsApi.post(`/menu/food-update-movil/${id}`, {
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
    const { img_comida, ... rest } = food;

    try {

        if (!img_comida) {
            throw new Error("No se proporcionó ninguna imagen");
        }

        const checkedImages = await prepareImages(img_comida);

        const { data } = await cdlcmtzEatsApi.post(`/menu/food-add/`, {
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
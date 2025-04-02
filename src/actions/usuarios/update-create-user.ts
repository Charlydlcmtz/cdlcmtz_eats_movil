import { isAxiosError } from "axios";
import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { User } from "../../domain/entities/user";



export const updateCreateUser = ( user: Partial<User> ) => {

    if ( user.id && user.id !== 'new') {
        return updateUser(user);
    }

    return createUser( user );

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
    formData.append("img_user_file", {
        uri: image,
        type: 'image/jpeg',
        name: image.split('/').pop(),
    });

    const { data } = await cdlcmtzEatsApi.post<{ img: string }>('/usuarios/user-file', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data.img;
}

//TODO revisar si viene el usuario
const updateUser = async (user: Partial<User>) => {
    const { id, img_user, ... rest } = user;

    if (!img_user) {
        throw new Error("No se proporcionó ninguna imagen");
    }

    try {
        const checkedImages = await prepareImages(img_user);

        const { data } = await cdlcmtzEatsApi.post(`/usuarios/usuario-update-movil/${id}`, {
            img_user: checkedImages,
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
        throw new Error("Error al actualizar el usuario");
    }
};

const createUser = async(user: Partial<User>) => {
    const { img_user, ... rest } = user;

    try {

        if (!img_user) {
            throw new Error("No se proporcionó ninguna imagen");
        }

        const checkedImages = await prepareImages(img_user);

        const { data } = await cdlcmtzEatsApi.post(`usuarios/usuario-add-movil`, {
            img_user: checkedImages,
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
        throw new Error("Error al actualizar el usuario");
    }
}
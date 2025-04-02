
import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";

export const prepareImages = async( img: string, tipo_usuario: string ) => {
    try {
        // TODO revisar los files
        if (!img.includes("file://")) {
            return img;
        }

        // Si la imagen es nueva (viene del dispositivo), la subimos
        const uploadedImage = await uploadImage(img, tipo_usuario);
        console.log('✅ Imagen subida, path:', uploadedImage);
        return uploadedImage;   
    } catch (error) {
        console.log('❌ Error al subir imagen:', error);
        return null;
    }
};

//luego lo implemento
const uploadImage = async (img: string, tipo_usuario: string) => {
    const formData = new FormData();

    if (tipo_usuario === 'usuario') {
        formData.append("img_user_file", {
            uri: img,
            type: 'image/jpeg',
            name: img.split('/').pop(),
        });
        const { data } = await cdlcmtzEatsApi.post<{ img: string }>('/usuarios/user-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data.img;
    }else{
        formData.append("img_icon_file", {
            uri: img,
            type: 'image/jpeg',
            name: img.split('/').pop(),
        });
        const { data } = await cdlcmtzEatsApi.post<{ img: string }>('/empresa/comany-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data.img;
    }
}

import { isAxiosError } from "axios";
import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { Empresa } from "../../domain/entities/company";



export const updateCreateCompany = ( company: Partial<Empresa> ) => {

    if ( company.id && company.id !== 'new') {
        return updateCompany(company);
    }

    return createCompany( company );

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
    formData.append("icon_file", {
        uri: image,
        type: 'image/jpeg',
        name: image.split('/').pop(),
    });

    const { data } = await cdlcmtzEatsApi.post<{ img: string }>('/empresa/company-file', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data.img;
}

//TODO revisar si viene la empresa
const updateCompany = async (company: Partial<Empresa>) => {
    const { id, icon, ... rest } = company;

    if (!icon) {
        throw new Error("No se proporcionó ninguna imagen");
    }

    try {
        const checkedImages = await prepareImages(icon);

        const { data } = await cdlcmtzEatsApi.post(`/empresas/empresa-update-movil/${id}`, {
            icon: checkedImages,
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
        throw new Error("Error al actualizar la empresa");
    }
};

const createCompany = async(company: Partial<Empresa>) => {
    const { icon, ... rest } = company;

    try {

        if (!icon) {
            throw new Error("No se proporcionó ninguna imagen");
        }

        const checkedImages = await prepareImages(icon);

        const { data } = await cdlcmtzEatsApi.post(`/empresa/register-company-movil`, {
            icon: checkedImages,
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
        throw new Error("Error al crear la empresa");
    }
}
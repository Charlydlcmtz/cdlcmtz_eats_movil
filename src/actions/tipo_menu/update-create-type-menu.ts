import { isAxiosError } from "axios";
import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { TypeMenu } from "../../domain/entities/type-menu";



export const updateCreateTypeMenu = ( typeMenu: Partial<TypeMenu> ) => {

    if ( typeMenu.id && typeMenu.id !== 'new') {
        return updateTypeMenu(typeMenu);
    }

    return createTypeMenu( typeMenu );

};

//TODO revisar si viene la empresa
const updateTypeMenu = async (typeMenu: Partial<TypeMenu>) => {
    const { id, ... rest } = typeMenu;

    try {

        const { data } = await cdlcmtzEatsApi.post(`/menu/menu-type-update/${id}`, {
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

const createTypeMenu = async(typeMenu: Partial<TypeMenu>) => {
    const { ... rest } = typeMenu;

    try {

        const { data } = await cdlcmtzEatsApi.post(`/menu-type/menu-add`, {
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
        throw new Error("Error al crear tipo de menu");
    }
}
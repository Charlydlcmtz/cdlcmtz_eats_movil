import { isAxiosError } from "axios";
import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { Role } from "../../domain/entities/role";



export const updateCreateRole = ( role: Partial<Role> ) => {

    if ( role.id && role.id !== 'new') {
        return updateRole(role);
    }

    return createRole( role );

};

//TODO revisar si viene la empresa
const updateRole = async (role: Partial<Role>) => {
    const { id, ... rest } = role;

    try {

        const { data } = await cdlcmtzEatsApi.post(`/roles/role-update/${id}`, {
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
        throw new Error("Error al actualizar un rol");
    }
};

const createRole = async(role: Partial<Role>) => {
    const { ... rest } = role;

    try {
        const { data } = await cdlcmtzEatsApi.post(`/roles/role-add`, {
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
        throw new Error("Error al crear rol");
    }
}
import { isAxiosError } from "axios";
import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { Order } from "../../domain/entities/order";



export const updateOrderG = ( order: Partial<Order> ) => {

    return updateOrder(order);

};

//TODO revisar si viene la empresa
const updateOrder = async (order: Partial<Order>) => {
    const { id, ... rest } = order;

    try {

        const { data } = await cdlcmtzEatsApi.post(`/menu/pedido-update/${id}`, {
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
        throw new Error("Error al actualizar la orden.");
    }
};
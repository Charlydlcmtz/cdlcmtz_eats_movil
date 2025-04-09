import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { Order } from "../../domain/entities/order";
import { TesloOrder } from "../../infraestructure/interfaces/teslo-order.response";
import { OrderMapper } from "../../infraestructure/mappers/order.mapper";





export const getOders = async ():Promise<Order[]> => {

    try {
        const { data } = await cdlcmtzEatsApi.post<TesloOrder[]>(`/menu/list-pedidos`);

        if (!data || !Array.isArray(data)) {
            throw new Error("La respuesta del backend no es válida");
        }

        const orders = data.map(OrderMapper.tesloOrderToEntity);

        return orders;

    } catch (error) {
        console.log(error);
        throw new Error("Error al traer las ordenes");
    }
}
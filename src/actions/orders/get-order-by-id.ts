import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { Order } from "../../domain/entities/order";
import { TesloOrder } from "../../infraestructure/interfaces/teslo-order.response";
import { OrderMapper } from "../../infraestructure/mappers/order.mapper";





export const getOrderById = async (id: string):Promise<Order> => {
    console.log(id);
    try {
        const { data } = await cdlcmtzEatsApi.get<TesloOrder>(`/menu/get-pedido/${id}`);

        return OrderMapper.tesloOrderToEntity(data);

    } catch (error) {
        console.log(error);
        throw new Error("Error al traer la orden");
    }
}
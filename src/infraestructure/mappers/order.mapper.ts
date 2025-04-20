import { Order } from "../../domain/entities/order";
import { TesloOrder } from "../interfaces/teslo-order.response";





export class OrderMapper {

    static tesloOrderToEntity( tesloOrder: TesloOrder ):Order {

        return {
            id: tesloOrder.id,
            food: tesloOrder.menu,
            descripcion: tesloOrder.descripcion,
            cantidad: tesloOrder.cantidad,
            empresa: tesloOrder.empresa,
            usuario: tesloOrder.usuario,
            estatus: tesloOrder.estatus,
        };
    }
}
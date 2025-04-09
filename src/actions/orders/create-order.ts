import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";




export const createOrder = async (order: { platillos: string, descripcion?: string }) => {
    try {
      const { data } = await cdlcmtzEatsApi.post(`/menu/create-order`, order);
      return data;
    } catch (error) {
      // manejo de errores...
      throw new Error("Error al levantar orden");
    }
  };

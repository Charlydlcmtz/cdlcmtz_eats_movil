import { isAxiosError } from "axios";
import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { CartItem } from "../../presentation/context/CartContext";




export const createOrder = async (
  platillos: CartItem[],
  descripcion: string,
  numero_tarjeta: string,
  cvv: string
) => {
  try {
    const formattedPlatillos = platillos.map(p => ({
      comida: { id: p.comida.id },
      cantidad: p.cantidad,
    }));

    const payload = {
      platillos: JSON.stringify(formattedPlatillos),
      descripcion,
      numero_tarjeta,
      cvv,
    };

    const { data } = await cdlcmtzEatsApi.post('/menu/create-order', payload);
    return data;

  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ Error al enviar pedido:", error.response?.data);
      throw new Error(error.response?.data?.mensaje || "Error desconocido");
    }
    throw new Error("Error desconocido al enviar pedido");
  }
};
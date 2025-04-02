import { TesloEmpresa } from "./teslo-empresa.response";
import { TesloMenuType } from "./teslo-menu-type.response";
import { TesloPivot } from "./teslo-pivot.response";

export interface TesloFood {
    id: string;
    platillo: string;
    descripcion: string;
    costo: number;
    calorias: string;
    img_comida: string;
    inicio_fecha_platillo: Date;
    fin_fecha_platillo: Date;
    empresa: TesloEmpresa;
    tipo_menu: TesloMenuType;
    estatus: number;
    pivot: TesloPivot;
}
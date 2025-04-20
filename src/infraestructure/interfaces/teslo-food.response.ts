
import { TesloCompany } from "./teslo-company.response";
import { TesloTypeMenu } from "./teslo-menu-type.response";
import { TesloPivot } from "./teslo-pivot.response";

export interface TesloFood {
    id: string;
    platillo: string;
    descripcion: string;
    costo: string;
    calorias: string;
    img_comida: string;
    inicio_fecha_platillo: Date;
    fin_fecha_platillo: Date;
    empresa: TesloCompany;
    tipo_menu: TesloTypeMenu;
    estatus: number;
    pivot: TesloPivot;
}
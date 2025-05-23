
import { TesloCompany } from "../../infraestructure/interfaces/teslo-company.response";
import { TesloTypeMenu } from "../../infraestructure/interfaces/teslo-menu-type.response";
import { TesloPivot } from "../../infraestructure/interfaces/teslo-pivot.response";


export interface Menu {
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
    id_tipo_menu: number;
    estatus: number;
    pivot: TesloPivot;
}
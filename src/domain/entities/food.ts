import { TesloEmpresa } from "../../infraestructure/interfaces/teslo-empresa.response";
import { TesloMenuType } from "../../infraestructure/interfaces/teslo-menu-type.response";
import { TesloPivot } from "../../infraestructure/interfaces/teslo-pivot.response";


export interface Food {
    id: number;
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
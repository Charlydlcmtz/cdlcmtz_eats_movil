import { Company } from "./company";
import { Estatus } from "./estatus";
import { Food } from "./food";
import { User } from "./user";

export interface Order {
    id: string;
    food: Food[];
    descripcion: string;
    cantidad: number;
    empresa: Company;
    usuario: User;
    estatus: Estatus;
  }
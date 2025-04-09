import { Company } from "../../domain/entities/company";
import { Estatus } from "../../domain/entities/estatus";
import { Food } from "../../domain/entities/food";
import { User } from "../../domain/entities/user";


export interface TesloOrder {
    id: string;
    food: Food[];
    descripcion: string;
    cantidad: number;
    empresa: Company;
    usuario: User;
    estatus: Estatus;
  }
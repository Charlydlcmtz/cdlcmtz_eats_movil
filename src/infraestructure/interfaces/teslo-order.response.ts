import { Empresa } from "../../domain/entities/company";
import { Estatus } from "../../domain/entities/estatus";
import { Menu } from "../../domain/entities/food";
import { User } from "../../domain/entities/user";


export interface TesloOrder {
    id: string;
    menu: Menu;
    descripcion: string;
    cantidad: number;
    empresa: Empresa;
    usuario: User;
    estatus: Estatus;
  }
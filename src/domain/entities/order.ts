import { Empresa } from "./company";
import { Estatus } from "./estatus";
import { Menu } from "./food";

import { User } from "./user";

export interface Order {
    id: string;
    food: Menu;
    descripcion: string;
    cantidad: number;
    empresa: Empresa;
    usuario: User;
    estatus: Estatus;
  }
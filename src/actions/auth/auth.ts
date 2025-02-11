import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { User } from "../../domain/entities/user";
import type { AuthResponse } from "../../infraestructure/interfaces/auth.responses";


const returnUserToken = ( data: AuthResponse ) => {
    
    const user: User = {
        id: data.id,
        username: data.username,
        no_empleado: data.no_empleado,
        img_user: data.img_user,
        correo: data.correo,
        telefono: data.telefono,
        id_empresa: data.id_empresa,
        role: data.role,
    }
    
    return {
        user: user,
        token: data.token
    }
}

export const authLogin = async(correo: string, password: string) => {

    correo = correo.toLocaleLowerCase();

    try {
        const { data } = await cdlcmtzEatsApi.post<AuthResponse>('/login', {
            correo,
            password,
        });

        return returnUserToken(data);
    }catch(error){
        console.log(error);
        return null;
    }
};
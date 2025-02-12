import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { User } from "../../domain/entities/user";
import type { AuthResponse } from "../../infraestructure/interfaces/auth.responses";


const returnUserToken = ( data: AuthResponse ) => {
    
    const user: User = {
        id: data.user.id,
        username: data.user.username,
        no_empleado: data.user.no_empleado,
        img_user: data.user.img_user,
        correo: data.user.correo,
        telefono: data.user.telefono,
        id_empresa: data.user.id_empresa,
        role: data.user.role,
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

export const authCheckStatus = async () => {
    try {
        const { data } = await cdlcmtzEatsApi.get<AuthResponse>('/check-token');
        return returnUserToken(data);
    } catch (error) {
        console.log({error});
        return null;
    }
}
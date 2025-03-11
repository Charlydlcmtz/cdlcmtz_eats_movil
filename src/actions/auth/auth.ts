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

    console.log(correo);
    console.log(password);

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

export const authRegister = async(nombre: string, username: string, apellido_p: string, apellido_m: string, telefono: string, no_empleado: string, 
    correo: string, password: string , password_confirm: string) => {
    
    nombre = nombre.toLocaleLowerCase();
    username = username.toLocaleLowerCase();
    apellido_p = apellido_p.toLocaleLowerCase();
    apellido_m = apellido_m.toLocaleLowerCase();
    correo = correo.toLocaleLowerCase();

    try {

        if (password !== password_confirm) {
            throw new Error(`Las contraseñas no son iguales.`);
        }

        const { data } = await cdlcmtzEatsApi.post<AuthResponse>('/register', {
            nombre,
            username,
            apellido_p,
            apellido_m,
            telefono,
            no_empleado,
            correo,
            password,
        });

        // console.log(data);
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
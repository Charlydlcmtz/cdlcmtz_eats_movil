import { create } from "zustand";
import { User } from "../../../domain/entities/user";
import { AuthStatus } from "../../../infraestructure/interfaces/auth.status";
import { authCheckStatus, authForgotPassword, authLogin, authRegister } from "../../../actions/auth/auth";
import { StoragerAdapter } from '../../../config/adapters/storage-adapter';

export interface AuthState {
    status: AuthStatus
    token?: string;
    user?: User;

    login: (correo: string, password: string) => Promise<boolean>;
    register: (payload: any) => Promise<boolean>;
    forgotPassword: (correo: string, tipo_app: string) => Promise<{ mensaje: string; estatus: string; codigo: number }>;
    checkStatus: () => Promise<void>
    logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()( (set, get) => ({
    status: 'checking',
    token: undefined,
    user: undefined,

    login: async (correo: string, password: string) => {
        const resp = await authLogin(correo, password);
        if (!resp) {
            set({ status: 'unauthenticated', token: undefined, user: undefined });
            return false;
        }

        //TODO: save token and user in storage
        await StoragerAdapter.setItem('token', resp.token);

        set({ status: 'authenticated', token: resp.token, user: resp.user });
        return true;
    },

    register: async (payload: any) => {
        const resp = await authRegister(payload);

        if (!resp) {
            set({ status: 'unauthenticated', token: undefined, user: undefined });
            return false;
        }

        //TODO: save token and user in storage
        await StoragerAdapter.setItem('token', resp.token);

        set({ status: 'authenticated', token: resp.token, user: resp.user });
        return true;
    },

    forgotPassword: async (correo: string, tipo_app: string): Promise<{ mensaje: string; estatus: string; codigo: number }> => {
        const resp = await authForgotPassword(correo, tipo_app);
        if (!resp) {
            return { mensaje: 'Error al enviar correo',
                estatus: 'error',
                codigo: 400,
            };
        }
        return resp;
    },

    checkStatus: async () => {
        const token = await StoragerAdapter.getItem('token');

        if (!token) {
            set({ status: 'unauthenticated', token: undefined, user: undefined });
            return;
        }

        const resp = await authCheckStatus(token); // aquí va el token

        if (!resp) {
            await StoragerAdapter.removeItem('token');
            set({ status: 'unauthenticated', token: undefined, user: undefined });
            return;
        }

        set({ status: 'authenticated', token: resp.token, user: resp.user });
    },

    logout: async () => {
        await StoragerAdapter.removeItem('token');
        set({ status: 'unauthenticated', token: undefined, user: undefined});
    },
}));

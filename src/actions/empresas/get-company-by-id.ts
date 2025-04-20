import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { Empresa } from "../../domain/entities/company";
import { TesloCompany } from "../../infraestructure/interfaces/teslo-company.response";
import { CompanyMapper } from "../../infraestructure/mappers/company.mapper";



const emptyCompany: Empresa = {
    id: '',
    nombre: 'Nuevo Empresa',
    rfc: '',
    telefono: '',
    correo: '',
    icon: '',
    colors: '',
    estatus: true,
}



export const getCompanyById = async (id: string):Promise<Empresa> => {

    if (id === 'new') return emptyCompany;

    try {
        const { data } = await cdlcmtzEatsApi.get<TesloCompany>(`/empresas/get-empresa/${id}`);

        return CompanyMapper.tesloCompanyToEntity(data);

    } catch (error) {
        console.log(error);
        throw new Error("Error al actualizar la empresa");
    }
}
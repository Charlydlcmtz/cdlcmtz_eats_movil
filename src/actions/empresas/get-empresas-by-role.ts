import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { Empresa } from "../../domain/entities/company";
import { TesloCompany } from '../../infraestructure/interfaces/teslo-company.response';
import { CompanyMapper } from "../../infraestructure/mappers/company.mapper";





export const getCompanys = async ():Promise<Empresa[]> => {

    try {
        const { data } = await cdlcmtzEatsApi.post<TesloCompany[]>(`/empresa/list-empresas`);

        if (!data || !Array.isArray(data)) {
            throw new Error("La respuesta del backend no es válida");
        }

        const companies = data.map(CompanyMapper.tesloCompanyToEntity);

        return companies;

    } catch (error) {
        console.log(error);
        throw new Error("Error al traer empresas");
    }
}
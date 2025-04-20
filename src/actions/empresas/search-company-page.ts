import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi";
import { Empresa } from "../../domain/entities/company";
import { TesloCompany } from "../../infraestructure/interfaces/teslo-company.response";
import { CompanyMapper } from "../../infraestructure/mappers/company.mapper";


export const searchCompanyByPage = async (search: string): Promise<Empresa[]> => {
    try {
        const { data } = await cdlcmtzEatsApi.get<TesloCompany[]>(`/empresas/search-empresa/${search}`);
        const companies = data.map( CompanyMapper.tesloCompanyToEntity );
        return companies;

    } catch (error) {
        console.log(error);
        throw new Error("Error al buscar empresa");
    }

}
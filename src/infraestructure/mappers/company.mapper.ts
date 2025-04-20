import { Company } from "../../domain/entities/company";
import { TesloCompany } from "../interfaces/teslo-company.response";




export class CompanyMapper {

    static tesloCompanyToEntity( tesloCompany: TesloCompany ):Company {

        return {
            id: tesloCompany.id,
            nombre: tesloCompany.nombre,
            rfc: tesloCompany.rfc,
            telefono: tesloCompany.telefono,
            correo: tesloCompany.correo,
            icon: `http://192.168.0.16/api_cdlcmtz_eats/public/empresa/${tesloCompany.icon}`,
            colors: tesloCompany.colors,
            estatus: true,
        };
    }
}
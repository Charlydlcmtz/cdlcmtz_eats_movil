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
            icon: tesloCompany.icon,
            colors: tesloCompany.colors,
            estatus: true,
        };
    }
}
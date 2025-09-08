import { Employe } from "./employe";

export class Entreprise {
    id: number;
    name: string;
    raisonSocial: string;
    employes:Employe[];
}
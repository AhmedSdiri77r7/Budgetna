import { Employe } from "./employe";


export class Contrat{
    reference:number;
    dateDebut:Date;
    typeContrat:string;
    salaire:number;
    employe:Employe;
}
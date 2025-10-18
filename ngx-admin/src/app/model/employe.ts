import { Direction } from "./direction";
import { Entreprise } from "./entreprise";

export class Employe {
  [x: string]: any;
  getAllEmployes(): import("rxjs").ObservableInput<unknown> {
    throw new Error('Method not implemented.');
  }
  getRecentUsers(): import("rxjs").ObservableInput<unknown> {
    throw new Error('Method not implemented.');
  }
  id: number;
  prenom: string;
  nom: string;
  email: string;
  password: string;
  passwordHash: string; // propriété pour stocker le mot de passe crypté
  role: string;
  direction: string;
  actif: boolean;
}

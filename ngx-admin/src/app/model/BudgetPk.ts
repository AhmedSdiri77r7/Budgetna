export class BudgetPk {
  constructor(
    public idBudgetInitial: number,
    public idEmploye: number,
    public dateDebut: Date,
    public dateFin: Date,
    public libelle?: string, // Optional pour rétrocompatibilité
  ) {}
}

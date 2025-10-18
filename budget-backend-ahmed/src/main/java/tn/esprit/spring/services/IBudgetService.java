package tn.esprit.spring.services;

import java.util.Date;
import java.util.List;

import tn.esprit.spring.entities.Budget;
import tn.esprit.spring.entities.BudgetRevise;
import tn.esprit.spring.entities.Employe;
import tn.esprit.spring.entities.BudgetInitial;



public interface IBudgetService {
	
	public int ajouterBudgetInitial(BudgetInitial budgetinitial);
	public void affecterBudgetInitialADirection(int budgetinitialId, int depId);
	public void ajouterBudget(int idBudgetInitial, int idEmploye, String Libelle, Date dateDebut, Date dateFin, String token);
	public void validerBudget(int idBudgetInitial, int idEmploye,String Libelle, Date dateDebut, Date dateFin, int validateurId);
	public List<Budget> findAllBudgetByEmployeJPQL(int idEmploye);
	public List<Employe> getAllEmployeByBudgetInitial(int budgetinitialId);
	
	public List<BudgetInitial> getBudgetInitial();
	  public List<Budget> getAllbd(String token);
	public List<BudgetRevise> getBudgetRevise();

	public BudgetInitial getBudgetInitialById(int budgetInitialId);

	public void deleteBudgetInitialById(int idbudgetInitial);

	public List<Budget> getBudgetsByBudgetInitialAndDate(Employe idEmploye, BudgetInitial budgetInitial,String Libelle,
	Date dateDebut, Date dateFin);

	public int ajouterBudgetRevise(BudgetRevise budgetrevise);

    public void affecterBudgetReviseADirection(int budgetReviseId, int depId);

	public BudgetRevise getBudgetReviseById(int idbudgetRevise);
}

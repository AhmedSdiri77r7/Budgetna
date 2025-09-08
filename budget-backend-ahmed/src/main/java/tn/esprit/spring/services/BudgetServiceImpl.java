package tn.esprit.spring.services;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tn.esprit.spring.entities.*;
import tn.esprit.spring.repository.*;
import tn.esprit.spring.security.jwt.JwtUtils;

@Service
public class BudgetServiceImpl implements IBudgetService {


	@Autowired
	BudgetInitialRepository budgetinitialRepository;
	@Autowired
	DirectionRepository deptRepoistory;
	@Autowired
	BudgetRepository budgetRepository;
	@Autowired
	EmployeRepository employeRepository;
	@Autowired
	BudgetInitialRepository budgetInitialRepository;
	@Autowired
	BudgetReviseRepository budgetreviseRepository;

	@Autowired
	JwtUtils jwtUtils;

	public int ajouterBudgetInitial(BudgetInitial budgetinitial) {
		budgetInitialRepository.save(budgetinitial);
		return budgetinitial.getId();
	}
	public int ajouterBudgetRevise(BudgetRevise budgetrevise) {
		budgetreviseRepository.save(budgetrevise);
		return budgetrevise.getId();
	}

	public void affecterBudgetInitialADirection(int budgetinitialId, int depId) {
		BudgetInitial budgetinitial = budgetinitialRepository.findById(budgetinitialId).get();
		Direction dep = deptRepoistory.findById(depId).get();
		//budgetinitial.setDirection(dep);
		dep.setBudgetInitial(budgetinitial);
		budgetinitialRepository.save(budgetinitial);

	}


	public void affecterBudgetReviseADirection(int budgetreviseId, int depId) {
		BudgetRevise budgetrevise = budgetreviseRepository.findById(budgetreviseId).get();
		Direction dep = deptRepoistory.findById(depId).get();
		//budgetinitial.setDirection(dep);
		dep.setBudgetRevise(budgetrevise);
		budgetreviseRepository.save(budgetrevise);

	} 
	public void ajouterBudget(int idBudgetInitial, int idEmploye,String Libelle, Date dateDebut, Date dateFin,String token) {
		String name = jwtUtils.getUserNameFromJwtToken(token);
		System.out.println(name);

		BudgetPK budgetPK = new BudgetPK();
		budgetPK.setDateDebut(dateDebut);
		budgetPK.setDateFin(dateFin);
		budgetPK.setIdEmploye(idEmploye);
		budgetPK.setIdBudgetInitial(idBudgetInitial);
		budgetPK.setLibelle(Libelle);


		Budget budget = new Budget();
		budget.setBudgetPK(budgetPK);
		budget.setValide(false); //par defaut non valide
		budget.setIduser(name);
		budgetRepository.save(budget);

	}


	public void validerBudget(int idBudgetInitial, int idEmploye,String Libelle, Date dateDebut, Date dateFin, int validateurId) {
		System.out.println("In valider Budget");
		Employe validateur = employeRepository.findById(validateurId).get();
		BudgetInitial budgetInitial = budgetinitialRepository.findById(idBudgetInitial).get();
		//verifier s'il est un chef de departement (interet des enum)
		if(!validateur.getRole().equals(Role.CHEF_DEPARTEMENT)){
			System.out.println("l'employe doit etre chef de direction pour valider budget !");
			return;
		}
		//verifier s'il est le chef de departement de la mission en question
		/*boolean chefDeLaBudgetInitial = false;
		Direction dep=validateur.getDirection();*/

		/*if(dep.getId() == budgetInitial.getDirection().getId()){
			chefDeLaBudgetInitial = true;
		}*/

		/*if(!chefDeLaBudgetInitial){
			System.out.println("l'employe doit etre chef de departement de la mission en question");
			return;
		}*/

		BudgetPK budgetPK = new BudgetPK(idBudgetInitial, idEmploye,Libelle, dateDebut, dateFin);
		Budget budget =budgetRepository.findByBudgetPK(budgetPK);
		budget.setValide(true);
        budgetRepository.save(budget);
		//Comment Lire une date de la base de données
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		//System.out.println("dateDebut : " + dateFormat.format(budget.getBudgetPK().getDateDebut()));

	}


	public List<Budget> findAllBudgetByEmployeJPQL(int idEmploye) {
		return budgetRepository.findAllBudgetByEmployeJPQL(idEmploye);

	}


	public List<Employe> getAllEmployeByBudgetInitial(int budgetinitialId) {
		//return budgetRepository.getAllEmployeByBudgetInitial(budgetinitialId);
		return null;
	}



	public List<BudgetInitial> getBudgetInitial(){
		return (List<BudgetInitial>) budgetInitialRepository.findAll();
	}
	public List<BudgetRevise> getBudgetRevise(){
		return (List<BudgetRevise>) budgetreviseRepository.findAll();
	}

	public BudgetInitial getBudgetInitialById(int BudgetInitialId) {
		return budgetInitialRepository.findById(BudgetInitialId).get();
	}
	public BudgetRevise getBudgetReviseById(int BudgetReviseId) {
		return budgetreviseRepository.findById(BudgetReviseId).get();
	}
	@Transactional
	public void deleteBudgetInitialById(int idbudgetInitial) {
		budgetInitialRepository.delete(budgetInitialRepository.findById(idbudgetInitial).get());
	}
	public List<Budget> getBudgetsByBudgetInitialAndDate(Employe employe, BudgetInitial budgetInitial,String Libelle ,Date dateDebut,
			Date dateFin) {
		return budgetRepository.getBudgetsByBudgetInitialAndDate(employe, budgetInitial,Libelle, dateDebut, dateFin);

	}
	@Override
	public List<Budget> getAllbd(String token){
		String name=jwtUtils.getUserNameFromJwtToken(token);
		return  budgetRepository.findByIduser(name);
	}

}

package tn.esprit.spring.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import tn.esprit.spring.entities.Contrat;
import tn.esprit.spring.entities.Direction;
import tn.esprit.spring.entities.Employe;
import tn.esprit.spring.entities.Entreprise;
import tn.esprit.spring.entities.BudgetInitial;
import tn.esprit.spring.entities.Budget;
import tn.esprit.spring.repository.ContratRepository;

import tn.esprit.spring.repository.DirectionRepository;
import tn.esprit.spring.repository.EmployeRepository;
import tn.esprit.spring.repository.BudgetRepository;


@Service
public class EmployeServiceImpl implements IEmployeService {


	@Autowired
	EmployeRepository employeRepository;
	@Autowired
	DirectionRepository deptRepoistory;
	@Autowired
	ContratRepository contratRepoistory;

	//@Autowired
	BudgetRepository budgetRepository;


	@Override
	public Employe authenticate(String login, String password) {
		return employeRepository.getEmployeByEmailAndPassword(login, password);
	}

	@Override
	public List<Employe> getEmployeByDirection(int id) {
		Direction direction = deptRepoistory.findById(id).get();
		return employeRepository.getEmployeByDirection(direction);
	}

	@Override
	public List<Contrat> getAllContrat() {
		return (List<Contrat>) contratRepoistory.findAll();
	}

	@Override
	public Contrat getContratById(int id) {
		return contratRepoistory.findById(id).orElse(null);
	}

	@Override
	public int addOrUpdateEmploye(Employe employe) {
		employeRepository.save(employe);
		return employe.getId();
	}

	@Override
	public void ajouterEtAffecterContratAEmploye(int idEmploye, Contrat contrat) {

		Employe employeManagedEntity = employeRepository.findById(idEmploye).get();

		contrat.setEmploye(employeManagedEntity);
		contratRepoistory.save(contrat);
	}

	@Override
	public void ajouterEmployeEtAffecterDirection(Employe employe, int idDirection) {
		Direction direction=deptRepoistory.findById(idDirection).orElse(null);
		employe.setDirection(direction);
		employeRepository.save(employe);
	}

	@Override
	public Employe getEmployeById(int id) {
		return employeRepository.findById(id).orElse(null);
	}

	public int ajouterEmploye(Employe employe) {
		employeRepository.save(employe);
		return employe.getId();
	}

	public void mettreAjourEmailByEmployeId(String email, int employeId) {
		Employe employe = employeRepository.findById(employeId).get();
		employe.setEmail(email);
		employeRepository.save(employe);

	}

	@Transactional
	public void affecterEmployeADirection(int employeId, int depId) {
		Direction depManagedEntity = deptRepoistory.findById(depId).get();
		Employe employeManagedEntity = employeRepository.findById(employeId).get();


		employeManagedEntity.setDirection(depManagedEntity);

			employeRepository.save(employeManagedEntity);

	}/*
	@Transactional
	public void desaffecterEmployeDuDirection(int employeId, int depId)
	{
		Direction dep = deptRepoistory.findById(depId).get();

		int employeNb = dep.getEmployes().size();
		for(int index = 0; index < employeNb; index++){
			if(dep.getEmploye().get(index).getId() == employeId){
				dep.getEmploye().remove(index);
				break;//a revoir
			}
		}
	}*/

	public int ajouterContrat(Contrat contrat) {
		contratRepoistory.save(contrat);
		return contrat.getReference();
	}

	public void affecterContratAEmploye(int contratId, int employeId) {
		Contrat contratManagedEntity = contratRepoistory.findById(contratId).get();
		Employe employeManagedEntity = employeRepository.findById(employeId).get();

		contratManagedEntity.setEmploye(employeManagedEntity);
		contratRepoistory.save(contratManagedEntity);

	}




	public void deleteEmployeById(int employeId)
	{
		Employe employe = employeRepository.findById(employeId).get();

		//Desaffecter l'employe de tous les departements
		//c'est le bout master qui permet de mettre a jour
		//la table d'association
		Direction dep = employe.getDirection();
		//dep.getEmploye().remove(employe);


		employeRepository.delete(employe);
	}

	public void deleteContratById(int contratId) {
		Contrat contratManagedEntity = contratRepoistory.findById(contratId).get();
		contratRepoistory.delete(contratManagedEntity);

	}

	public int getNombreEmployeJPQL() {
		return employeRepository.countemp();
	}

	public List<String> getAllEmployeNamesJPQL() {
		return employeRepository.employeNames();

	}

	public List<Employe> getAllEmployeByEntreprise(Entreprise entreprise) {
		return employeRepository.getAllEmployeByEntreprisec(entreprise);
	}

	public void mettreAjourEmailByEmployeIdJPQL(String email, int employeId) {
		employeRepository.mettreAjourEmailByEmployeIdJPQL(email, employeId);

	}
	public void deleteAllContratJPQL() {
         employeRepository.deleteAllContratJPQL();
	}

	public float getSalaireByEmployeIdJPQL(int employeId) {
		return employeRepository.getSalaireByEmployeIdJPQL(employeId);
	}

	public Double getSalaireMoyenByDirectionId(int directionId) {
		return employeRepository.getSalaireMoyenByDirectionId(directionId);
	}



	public List<Employe> getAllEmployes() {
				return (List<Employe>) employeRepository.findAll();
	}


	@Override
	public Employe getUserByEmail(String email){
		System.out.println(""+employeRepository.getEmployeByEmail(email));
		return employeRepository.getEmployeByEmail(email);
	}


}

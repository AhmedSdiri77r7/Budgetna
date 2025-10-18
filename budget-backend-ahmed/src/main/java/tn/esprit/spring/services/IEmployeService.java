package tn.esprit.spring.services;

import java.util.Date;
import java.util.List;

import tn.esprit.spring.entities.*;


public interface IEmployeService {
	
	public int ajouterEmploye(Employe employe);
	public void mettreAjourEmailByEmployeId(String email, int employeId);
	public void affecterEmployeADirection(int employeId, int depId);
	/*public void desaffecterEmployeDuDirection(int employeId, int depId);*/
	public int ajouterContrat(Contrat contrat);
	public void affecterContratAEmploye(int contratId, int employeId);

	public void deleteEmployeById(int employeId);
	public void deleteContratById(int contratId);
	public int getNombreEmployeJPQL();
	public List<String> getAllEmployeNamesJPQL();
	public List<Employe> getAllEmployeByEntreprise(Entreprise entreprise);
	public void mettreAjourEmailByEmployeIdJPQL(String email, int employeId);
	public void deleteAllContratJPQL();
	public float getSalaireByEmployeIdJPQL(int employeId);
	public Double getSalaireMoyenByDirectionId(int directionId);
	public List<Employe> getAllEmployes();

	public Employe authenticate(String login, String password);
	List<Contrat> getAllContrat();
	Contrat getContratById(int id);
	int addOrUpdateEmploye(Employe employe);
	void ajouterEtAffecterContratAEmploye(int idEmploye,Contrat contrat);
	void ajouterEmployeEtAffecterDirection(Employe employe,int idDirection);
	Employe getEmployeById(int id);

	public List<Employe> getEmployeByDirection(int id);

	public Employe getUserByEmail(String email);
	
}

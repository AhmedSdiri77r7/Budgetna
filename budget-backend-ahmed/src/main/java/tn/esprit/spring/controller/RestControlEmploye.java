package tn.esprit.spring.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import tn.esprit.spring.entities.Contrat;
import tn.esprit.spring.entities.Employe;
import tn.esprit.spring.entities.Entreprise;
import tn.esprit.spring.entities.BudgetInitial;
import tn.esprit.spring.entities.Budget;
import tn.esprit.spring.services.IContratService;
import tn.esprit.spring.services.IEmployeService;
import tn.esprit.spring.services.IBudgetService;
import tn.esprit.spring.services.IEntrepriseService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class RestControlEmploye {


	@Autowired
	IEmployeService iemployeservice;
	@Autowired
	IEntrepriseService ientrepriseservice;
	@Autowired
	IContratService icontratservice;
	@Autowired
	IBudgetService ibudgetservice;


	// http://localhost:8081/SpringMVC/servlet/ajouterEmployer
	//{"id":1,"nom":"Boughdiri", "prenom":"khaled", "email":"Khaled.kallel@ssiiconsulting.tn", "isActif":true, "role":"INGENIEUR"}

	@PostMapping("/ajouterEmployer")
	@ResponseBody
	public Employe ajouterEmploye(@RequestBody Employe employe) {
		iemployeservice.ajouterEmploye(employe);
		return employe;
	}



	// Modifier email : http://localhost:8081/SpringMVC/servlet/modifyEmail/1/newemail
	@PutMapping(value = "/modifyEmail/{id}/{newemail}")
	@ResponseBody
	public void mettreAjourEmailByEmployeId(@PathVariable("newemail") String email, @PathVariable("id") int employeId) {
		iemployeservice.mettreAjourEmailByEmployeId(email, employeId);

	}

	// http://localhost:8081/SpringMVC/servlet/affecterEmployeADirection/1/1
	@PutMapping(value = "/affecterEmployeADirection/{idemp}/{iddept}")
	public void affecterEmployeADirection(@PathVariable("idemp") int employeId, @PathVariable("iddept") int depId) {
		iemployeservice.affecterEmployeADirection(employeId, depId);

	}
	/*
	// http://localhost:8081/SpringMVC/servlet/desaffecterEmployeDuDirection/1/1
	@PutMapping(value = "/desaffecterEmployeDuDirection/{idemp}/{iddept}")
	public void desaffecterEmployeDuDirection(@PathVariable("idemp")int employeId, @PathVariable("iddept")int depId)
	{
		iemployeservice.desaffecterEmployeDuDirection(employeId, depId);
	}*/

	// http://localhost:8081/SpringMVC/servlet/ajouterContrat
	//{"reference":6,"dateDebut":"2020-03-01","salaire":2000,"typeContrat":"CDD"}
	@PostMapping("/ajouterContrat")
	@ResponseBody
	public int ajouterContrat(@RequestBody Contrat contrat) {
		iemployeservice.ajouterContrat(contrat);
		return contrat.getReference();
	}

	// http://localhost:8081/SpringMVC/servlet/affecterContratAEmploye/6/1
	@PutMapping(value = "/affecterContratAEmploye/{idcontrat}/{idemp}")
	public void affecterContratAEmploye(@PathVariable("idcontrat") int contratId, @PathVariable("idemp") int employeId) {
		iemployeservice.affecterContratAEmploye(contratId, employeId);
	}

	@PostMapping("/ajouterEtAffecterContratAEmploye/{idEmploye}")
	public void ajouterEtAffecterContratAEmploye(@PathVariable int idEmploye, @RequestBody Contrat contrat) {
		iemployeservice.ajouterEtAffecterContratAEmploye(idEmploye, contrat);
	}

	@PostMapping("/ajouterEmployeEtAffecterDirection/{idDirection}")
	public void ajouterEtAffecterContratAEmploye(@PathVariable int idDirection, @RequestBody Employe employe) {
		iemployeservice.ajouterEmployeEtAffecterDirection(employe, idDirection);
	}


	// URL : http://localhost:8081/SpringMVC/servlet/deleteEmployeById/1
	@DeleteMapping("/deleteEmployeById/{idemp}")
	@ResponseBody
	public void deleteEmployeById(@PathVariable("idemp") int employeId) {
		iemployeservice.deleteEmployeById(employeId);

	}

	// URL : http://localhost:8081/SpringMVC/servlet/deleteContratById/2
	@DeleteMapping("/deleteContratById/{idcontrat}")
	@ResponseBody
	public void deleteContratById(@PathVariable("idcontrat") int contratId) {
		iemployeservice.deleteContratById(contratId);
	}


	// URL : http://localhost:8081/SpringMVC/servlet/getNombreEmployeJPQL
	@GetMapping(value = "/getNombreEmployeJPQL")
	@ResponseBody
	public int getNombreEmployeJPQL() {

		return iemployeservice.getNombreEmployeJPQL();
	}

	// URL : http://localhost:8081/SpringMVC/servlet/getAllEmployeNamesJPQL
	@GetMapping(value = "/getAllEmployeNamesJPQL")
	@ResponseBody
	public List<String> getAllEmployeNamesJPQL() {

		return iemployeservice.getAllEmployeNamesJPQL();
	}

	// URL : http://localhost:8081/SpringMVC/servlet/getAllEmployeByEntreprise/1
	@GetMapping(value = "/getAllEmployeByEntreprise/{identreprise}")
	@ResponseBody
	public List<Employe> getAllEmployeByEntreprise(@PathVariable("identreprise") int identreprise) {
		Entreprise entreprise = ientrepriseservice.getEntrepriseById(identreprise);
		return iemployeservice.getAllEmployeByEntreprise(entreprise);
	}

	// Modifier email : http://localhost:8081/SpringMVC/servlet/mettreAjourEmailByEmployeIdJPQL/2/newemail
	@PutMapping(value = "/mettreAjourEmailByEmployeIdJPQL/{id}/{newemail}")
	@ResponseBody
	public void mettreAjourEmailByEmployeIdJPQL(@PathVariable("newemail") String email, @PathVariable("id") int employeId) {
		iemployeservice.mettreAjourEmailByEmployeIdJPQL(email, employeId);

	}

	// URL : http://localhost:8081/SpringMVC/servlet/deleteAllContratJPQL
	@DeleteMapping("/deleteAllContratJPQL")
	@ResponseBody
	public void deleteAllContratJPQL() {
		iemployeservice.deleteAllContratJPQL();

	}

	// URL : http://localhost:8081/SpringMVC/servlet/getSalaireByEmployeIdJPQL/2
	@GetMapping(value = "/getSalaireByEmployeIdJPQL/{idemp}")
	@ResponseBody
	public float getSalaireByEmployeIdJPQL(@PathVariable("idemp") int employeId) {
		return iemployeservice.getSalaireByEmployeIdJPQL(employeId);
	}

	// URL : http://localhost:8081/SpringMVC/servlet/getSalaireMoyenByDirectionId/2
	@GetMapping(value = "/getSalaireMoyenByDirectionId/{iddept}")
	@ResponseBody
	public Double getSalaireMoyenByDirectionId(@PathVariable("iddept") int directionId) {
		return iemployeservice.getSalaireMoyenByDirectionId(directionId);
	}








	// URL : http://localhost:8081/SpringMVC/servlet/getAllEmployes
	@GetMapping(value = "/getAllEmployes")
    @ResponseBody
	public List<Employe> getAllEmployes() {
		
		return iemployeservice.getAllEmployes();
	}
	@GetMapping("/getAllContrats")
	@ResponseBody
	public List<Contrat> getAllContrat(){
		return iemployeservice.getAllContrat();
	}
	@GetMapping("/getcontratById/{id}")
	@ResponseBody
	public Contrat getContratById(@PathVariable int id){
		return iemployeservice.getContratById(id);
	}
	@GetMapping("/getemployeById/{id}")
	@ResponseBody
	public Employe getEmployeById(@PathVariable int id){
		return iemployeservice.getEmployeById(id);
	}

	@GetMapping("/getEmployeByDirection/{id}")
	public List<Employe> getEmployerByDirection(@PathVariable int id,@RequestHeader("Authorization") String authorizationHeader)
	{
		System.out.println("authorization : "+authorizationHeader);
		return iemployeservice.getEmployeByDirection(id);
	}

	@GetMapping("/getEmployeByEmail/{email}")
	@ResponseBody
	public Employe getEmployeByEmail(@PathVariable("email") String email) {return iemployeservice.getUserByEmail(email);}
	
}

package tn.esprit.spring.controller;

import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import tn.esprit.spring.entities.Budget;
import tn.esprit.spring.entities.BudgetRevise;
import tn.esprit.spring.entities.Employe;
import tn.esprit.spring.entities.BudgetInitial;
import tn.esprit.spring.repository.BudgetRepository;
import tn.esprit.spring.repository.EmployeRepository;
import tn.esprit.spring.services.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureException;
import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class RestControlBudget {
	private static final Logger logger = LoggerFactory.getLogger(RestControlBudget.class);

	@Autowired
	IEmployeService iemployeservice;
	@Autowired
	IEntrepriseService ientrepriseservice;

	@Autowired
	IContratService icontratservice;


	@Autowired
	IBudgetService ibudgetservice;
	@Autowired
	BudgetRepository budgetRepository;
	@Autowired
	EmployeRepository employeRepository;
	@Autowired
	BudgetServiceImpl budgetService;

	// http://localhost:8081/SpringMVC/servlet/ajouterBudgetInitial
	//{"id":4,"name":"mabudgetinitial", "description":"c ma budgetinitial"}
	@PostMapping("/ajouterBudgetInitial")
	@ResponseBody
	public int ajouterBudgetInitial(@RequestBody BudgetInitial budgetinitial) {
		ibudgetservice.ajouterBudgetInitial(budgetinitial);
		return budgetinitial.getId();
	}
	@PostMapping("/ajouterBudgetRevise")
	@ResponseBody
	public int ajouterBudgetRevise(@RequestBody BudgetRevise budgetrevise) {
		ibudgetservice.ajouterBudgetRevise(budgetrevise);
		return budgetrevise.getId();
	}
	@GetMapping("/oauth/test")
	public String test() {
		return "Public Content.";
	}

	@GetMapping("/test")
	public String tests() {
		return "Test 2";
	}

	// http://localhost:8081/SpringMVC/servlet/affecterBudgetInitialADirection/4/4
	@PutMapping(value = "/affecterBudgetInitialADirection/{idBudgetInitial}/{iddept}")
	public void affecterBudgetInitialADirection(@PathVariable("idBudgetInitial") int budgetInitialId, @PathVariable("iddept") int depId) {
		ibudgetservice.affecterBudgetInitialADirection(budgetInitialId, depId);

	}




	@PutMapping(value = "/affecterBudgetReviseADirection/{idBudgetRevise}/{iddept}")
	public void affecterBudgetReviseADirection(@PathVariable("idBudgetRevise") int budgetReviseId, @PathVariable("iddept") int depId) {
		ibudgetservice.affecterBudgetReviseADirection(budgetReviseId, depId);

	}


	@PostMapping("/ajouterBudget/{idBudgetInitial}/{idEmploye}/{Libelle}/{dateDebut}/{dateFin}/{token}")
	@ResponseBody
	public void ajouterBudget(@PathVariable("idBudgetInitial") int idBudgetInitial,
							  @PathVariable("idEmploye") int idEmploye,
							  @PathVariable("Libelle") String Libelle,
							  @PathVariable("dateDebut") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateDebut,
							  @PathVariable("dateFin") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateFin, @PathVariable("token") String token
	)
	{


		ibudgetservice.ajouterBudget(idBudgetInitial,idEmploye,Libelle, dateDebut, dateFin,token);


	}




	@PutMapping("/validerBudget/{idBudgetInitial}/{idEmploye}/{Libelle}/{valId}/{dateDebut}/{dateFin}")
	public void validerBudget(@PathVariable("idBudgetInitial") int idBudgetInitial,
							  @PathVariable("idEmploye") int idEmploye,
							  @PathVariable("Libelle") String Libelle,
							  @PathVariable("valId") int validateurId,
							  @PathVariable("dateDebut") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateDebut,
							  @PathVariable("dateFin") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateFin) {
		ibudgetservice.validerBudget(idBudgetInitial, idEmploye,Libelle, dateDebut, dateFin, validateurId);
	}





	
	// URL : http://localhost:8081/SpringMVC/servlet/findAllBudgetInitialByEmployeJPQL/1
    @GetMapping(value = "findAllBudgetByEmployeJPQL/{idEmploye}")
    @ResponseBody
	public List<Budget> findAllBudgetByEmployeJPQL(@PathVariable("idEmploye") int idEmploye) {


		return ibudgetservice.findAllBudgetByEmployeJPQL(idEmploye);
	}

    // URL : http://localhost:8081/SpringMVC/servlet/getAllEmployeByBudgetInitial/1
    @GetMapping(value = "getAllEmployeByBudgetInitial/{idBudgetInitial}")
    @ResponseBody
	public List<Employe> getAllEmployeByBudgetInitial(@PathVariable("idBudgetInitial") int budgetinitialId,@RequestHeader("Authorization") String authorizationHeader) {
		System.out.println("authorization : "+authorizationHeader);
		return ibudgetservice.getAllEmployeByBudgetInitial(budgetinitialId);
	}
	 // URL : http://localhost:8081/SpringMVC/servlet/getBudgetInitial
	@GetMapping(value = "/getBudgetInitial")
   @ResponseBody
	public List<BudgetInitial> getBudgetInitial() {

		return ibudgetservice.getBudgetInitial();
	}


	@GetMapping(value = "/getBudgetRevise")
	@ResponseBody
	public List<BudgetRevise> getBudgetRevise() {

		return ibudgetservice.getBudgetRevise();
	}


    // http://localhost:8081/SpringMVC/servlet/getBudgetInitialById/1
    @GetMapping(value = "getBudgetInitialById/{idbudgetInitial}")
    @ResponseBody
	public BudgetInitial getBudgetInitialById(@PathVariable("idbudgetInitial") int budgetinitialId) {

		return ibudgetservice.getBudgetInitialById(budgetinitialId);
	}

	@GetMapping(value = "getBudgetReviseById/{idbudgetRevise}")
	@ResponseBody
	public BudgetRevise getBudgetReviseById(@PathVariable("idbudgetRevise") int budgetReviseId) {

		return ibudgetservice.getBudgetReviseById(budgetReviseId);
	}


    // URL : http://localhost:8081/SpringMVC/servlet/deleteBudgetInitialById/3
    @DeleteMapping("/deleteBudgetInitialById/{idbudgetInitial}") 
	@ResponseBody 
	public void deleteBudgetInitialById(@PathVariable("idbudgetInitial") int idbudgetInitial) {
		System.out.println("*********************************************************************");
		ibudgetservice.deleteBudgetInitialById(idbudgetInitial);

	}


	// URL : http://localhost:8081/SpringMVC/servlet/getBudgetsByBudgetInitialAndDate
	@GetMapping(value = "/getBudgetsByBudgetInitialAndDate")
	@ResponseBody
	public List<Budget> getBudgetsByBudgetInitialAndDate(
			@RequestParam("emp") Employe employe,
			@RequestParam("bi") BudgetInitial budgetInitial,
			@RequestParam("lib") String Libelle,
			@RequestParam("dateD") @DateTimeFormat(pattern = "yyyy-MM-dd")  Date dateDebut,
			@RequestParam("dateF")  @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateFin)  {

		return budgetRepository.getBudgetsByBudgetInitialAndDate(employe, budgetInitial,Libelle, dateDebut, dateFin);
	}
    private int extractEmployeeId(String authorizationHeader) {
        // Extract the employee ID from the authorizationHeader or perform any necessary authentication logic
        // For example, if the authorizationHeader contains a JWT token, you can decode and extract the employee ID from it
        // Return the extracted employee ID as an integer
        return 0;
    }
	@GetMapping("/bd/{token}")
	List<Budget> getAllBudgetByUser( @PathVariable("token") String token){
	return  ibudgetservice.getAllbd(token);
	}
}


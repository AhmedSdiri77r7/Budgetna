package tn.esprit.spring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import tn.esprit.spring.entities.Direction;
import tn.esprit.spring.entities.Entreprise;
import tn.esprit.spring.services.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class RestControlEntreprise {

	@Autowired
	IEmployeService iemployeservice;
	@Autowired
	IDirectionService idepteservice;
	@Autowired
	IEntrepriseService ientrepriseservice;
	@Autowired
	IContratService iContratService;
	@Autowired
	IBudgetService ibudgetservice;
	
	// Ajouter Entreprise : http://localhost:8081/SpringMVC/servlet/ajouterEntreprise
	//{"id":1,"name":"Telecom","raisonSocial":"Cite El Ghazela"}

	@PostMapping("/ajouterEntreprise")
	@ResponseBody
	public int ajouterEntreprise(@RequestBody Entreprise ssiiConsulting) {
		ientrepriseservice.ajouterEntreprise(ssiiConsulting);
		return ssiiConsulting.getId();
	}
	@GetMapping("/getallentreprise")
	public List<Entreprise> getAllEntreprise(){
		return ientrepriseservice.getAllEntreprise();
	}
	
	// http://localhost:8081/SpringMVC/servlet/affecterDirectionAEntreprise/1/1
    @PutMapping(value = "/affecterDirectionAEntreprise/{iddept}/{identreprise}") 
	public void affecterDirectionAEntreprise(@PathVariable("iddept")int depId, @PathVariable("identreprise")int entrepriseId) {
		ientrepriseservice.affecterDirectionAEntreprise(depId, entrepriseId);
	}
    
    // http://localhost:8081/SpringMVC/servlet/deleteEntrepriseById/1
    @DeleteMapping("/deleteEntrepriseById/{identreprise}") 
	@ResponseBody 
	public void deleteEntrepriseById(@PathVariable("identreprise")int entrepriseId)
	{
		ientrepriseservice.deleteEntrepriseById(entrepriseId);
	}
    
    // http://localhost:8081/SpringMVC/servlet/getEntrepriseById/1
    @GetMapping(value = "getEntrepriseById/{identreprise}")
    @ResponseBody
	public Entreprise getEntrepriseById(@PathVariable("identreprise") int entrepriseId) {

		return ientrepriseservice.getEntrepriseById(entrepriseId);
	}
    
    // http://localhost:8081/SpringMVC/servlet/ajouterDirection
 	//{"id":1,"name":"informatique"}

 	@PostMapping("/ajouterDirection")
 	@ResponseBody
	public int ajouterDirection(@RequestBody Direction dep) {
		return ientrepriseservice.ajouterDirection(dep);
	}
	
 	 //  URL : http://localhost:8081/SpringMVC/servlet/getAllDirectiosnNamesByEntreprise/3
    @GetMapping(value = "getAllDirectiosnNamesByEntreprise/{identreprise}")
    @ResponseBody
	public List<String> getAllDirectionsNamesByEntreprise(@PathVariable("identreprise") int entrepriseId) {
		return ientrepriseservice.getAllDirectionsNamesByEntreprise(entrepriseId);
	}

    // URL : http://localhost:8081/SpringMVC/servlet/deleteDirectionById/3
    @DeleteMapping("/deleteDirectionById/{iddept}") 
	@ResponseBody 
	public void deleteDirectionById(@PathVariable("iddept") int depId) {
		System.out.println("*********************************************************************");
		ientrepriseservice.deleteDirectionById(depId);

	}
	@GetMapping("/getAllDirections")
	@ResponseBody
	public List<Direction> getAllDirections(){
		return ientrepriseservice.getAllDirections();
	}
	@PostMapping("ajouterEtAffecterDirectionAEntreprise/{id}")
	@ResponseBody
	public void ajouterEtAffecterDirectionAEntreprise(@RequestBody Direction direction,@PathVariable int id){
		System.out.println("********************************************************");
		System.out.println(direction);
		ientrepriseservice.ajouterEtAffecterDirectionAEntreprise(direction,id);
	}
	@GetMapping("getDirectionById/{iddept}")
	@ResponseBody
	public Direction getDirectionById(@PathVariable("iddept") int depId){
		return idepteservice.getDirectionById(depId);
	}
}

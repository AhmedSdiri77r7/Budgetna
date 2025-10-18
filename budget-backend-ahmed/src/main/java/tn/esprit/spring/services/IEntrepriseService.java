package tn.esprit.spring.services;

import java.util.List;


import tn.esprit.spring.entities.Direction;
import tn.esprit.spring.entities.Entreprise;

public interface IEntrepriseService {
	
	public int ajouterEntreprise(Entreprise entreprise);
	public int ajouterDirection(Direction dep);
	void affecterDirectionAEntreprise(int depId, int entrepriseId);
	List<String> getAllDirectionsNamesByEntreprise(int entrepriseId);
	public void deleteEntrepriseById(int entrepriseId);
	public void deleteDirectionById(int depId);
	public Entreprise getEntrepriseById(int entrepriseId);
	List<Entreprise> getAllEntreprise();
	List<Direction> getAllDirections();
	void ajouterEtAffecterDirectionAEntreprise(Direction direction,int idEntreprise);

}

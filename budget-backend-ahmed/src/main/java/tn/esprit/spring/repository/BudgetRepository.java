package tn.esprit.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import tn.esprit.spring.entities.Budget;
import tn.esprit.spring.entities.BudgetPK;

@Repository
public interface BudgetRepository extends CrudRepository<Budget, Integer> {

	// Récupérer tous les budgets d'un employé
	@Query("SELECT b FROM Budget b WHERE b.employe.id = :idEmploye")
	List<Budget> findAllBudgetByEmployeJPQL(@Param("idEmploye") int idEmploye);

	// Récupérer tous les budgets d'un département (via idDirection)
	@Query("SELECT b FROM Budget b JOIN b.employe e WHERE e.direction.id = :idDirection")
	List<Budget> findAllBudgetsByDirection(@Param("idDirection") int idDirection);

	// Récupérer tous les employés associés à un budget initial
	@Query("SELECT DISTINCT b.employe FROM Budget b WHERE b.budgetInitial.id = :budgetinitialId")
	List<tn.esprit.spring.entities.Employe> findAllByBudgetInitialId(@Param("budgetinitialId") int budgetinitialId);

	// Récupérer un budget via sa clé primaire composite
	Budget findByBudgetPK(BudgetPK budgetPK);

	// Récupérer tous les budgets liés à un utilisateur
	List<Budget> findByIduser(String iduser);

	// Déjà existante
	@Query("Select t from Budget t "
			+ "where t.budgetInitial=:bi and "
			+ "t.employe=:emp and "
			+ "t.budgetPK.libelle=:lib and "
			+ "t.budgetPK.dateDebut<=:dateD and "
			+ "t.budgetPK.dateFin<=:dateF")
	List<Budget> getBudgetsByBudgetInitialAndDate(@Param("emp") tn.esprit.spring.entities.Employe employe,
												  @Param("bi") tn.esprit.spring.entities.BudgetInitial budgetinitial,
												  @Param("lib") String Libelle,
												  @Param("dateD") java.util.Date dateDebut,
												  @Param("dateF") java.util.Date dateFin);
}

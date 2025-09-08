package tn.esprit.spring.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import tn.esprit.spring.entities.Employe;
import tn.esprit.spring.entities.BudgetInitial;
import tn.esprit.spring.entities.Budget;
import tn.esprit.spring.entities.BudgetPK;
@Repository
public interface BudgetRepository extends CrudRepository<Budget, Integer>{

	@Query("SELECT b FROM Budget b WHERE b.employe.id = :idEmploye")
public List<Budget> findAllBudgetByEmployeJPQL(@Param("idEmploye") int idEmploye);

	/*@Query("select DISTINCT e from Employe e "
				+ "join e.budgets t "
				+ "join t.budgetinitial m "
				+ "where m.id=:biId")
	public List<Employe> getAllEmployeByBudgetInitial(@Param("biId")int budgetinitialId);*/


	@Query("Select t from Budget t "
				+ "where t.budgetInitial=:bi and "
			+ "t.employe=:emp and "
			+ "t.budgetPK.libelle=:lib and "

				+ "t.budgetPK.dateDebut<=:dateD and "
				+ "t.budgetPK.dateFin<=:dateF")
	public List<Budget> getBudgetsByBudgetInitialAndDate(@Param("emp")Employe employe, @Param("bi")BudgetInitial budgetinitial,@Param("lib")String Libelle, @Param("dateD")Date dateDebut,@Param("dateF")Date dateFin);
public Budget findByBudgetPK(BudgetPK budgetPK);
List<Budget> findByIduser(String iduser);
}

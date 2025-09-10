package tn.esprit.spring.entities;

import lombok.Data;

import java.io.Serializable;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity @Data
public class Budget implements Serializable{

	private static final long serialVersionUID = 3876346912862238239L;

	@EmbeddedId
	private BudgetPK budgetPK;

	//idMission est a la fois primary key et foreign key
	@ManyToOne
    @JoinColumn(name = "idBudgetInitial", referencedColumnName = "id", insertable=false, updatable=false)
	private BudgetInitial budgetInitial;

	//idEmploye est a la fois primary key et foreign key

	@ManyToOne
    @JoinColumn(name = "idEmploye", referencedColumnName = "id", insertable=false, updatable=false)
	private Employe employe;
	private  String iduser;

	public Budget() {
	}

	public Budget(BudgetPK budgetPK, BudgetInitial budgetInitial, Employe employe, boolean isValide) {
		this.budgetPK = budgetPK;
		this.budgetInitial = budgetInitial;
		this.employe = employe;
		this.isValide = isValide;
	}

	private boolean isValide;


	public boolean isValide() {
		return isValide;
	}

	public void setValide(boolean isValide) {
		this.isValide = isValide;
	}

	public BudgetPK getBudgetPK() {
		return budgetPK;
	}

	public void setBudgetPK(BudgetPK budgetPK) {
		this.budgetPK = budgetPK;
	}



	public BudgetInitial getBudgetInitial() {
		return budgetInitial;
	}

	public void setBudgetInitial(BudgetInitial budgetInitial) {
		this.budgetInitial = budgetInitial;
	}

	public Employe getEmploye() {
		return employe;
	}

	public void setEmploye(Employe employe) {
		this.employe = employe;
	}


}

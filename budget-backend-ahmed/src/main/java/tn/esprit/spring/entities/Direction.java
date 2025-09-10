package tn.esprit.spring.entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Direction implements Serializable {

	private static final long serialVersionUID = -357738161698377833L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	private String name;

	/*@OneToOne
	@JoinColumn(name = "idEmploye")
	private Employe employe;


	public Employe getEmploye() {
		return employe;
	}

	public void setEmploye(Employe employe) {
		this.employe = employe;
	}


*/
	@OneToOne(cascade = CascadeType.ALL)
	private BudgetInitial budgetInitial ;

	@OneToOne(cascade = CascadeType.ALL)
	private BudgetRevise budgetRevise;

	@ManyToOne
	private Entreprise entreprise;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BudgetRevise getBudgetRevise() {
		return budgetRevise;
	}

	public void setBudgetRevise(BudgetRevise budgetRevise) {
		this.budgetRevise = budgetRevise;
	}

	public Entreprise getEntreprise() {
		return entreprise;
	}

	public void setEntreprise(Entreprise entreprise) {
		this.entreprise = entreprise;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public BudgetInitial getBudgetInitial() {
		return budgetInitial;
	}

	public void setBudgetInitial(BudgetInitial budgetInitial) {
		this.budgetInitial = budgetInitial;
	}
}

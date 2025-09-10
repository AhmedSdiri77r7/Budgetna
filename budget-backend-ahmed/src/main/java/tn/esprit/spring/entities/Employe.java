package tn.esprit.spring.entities;

import java.io.Serializable;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@ToString(exclude = "direction")
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Employe implements Serializable {
	
	private static final long serialVersionUID = -1396669830860400871L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	private String prenom;
	
	private String nom;
	
	//@Column(unique=true)
	private String email;
	private String password;
	private boolean isActif;
	
	@Enumerated(EnumType.STRING)
	//@NotNull
	private Role role;







	@OneToOne
	@JoinColumn(name = "idDirection")
	private Direction direction;

/*@OneToOne
	@JsonIgnore
@JoinColumn(name = "idEmploye")
	private Contrat contrat;*/

	/*@OneToMany(mappedBy="employe",
			cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
			fetch=FetchType.LAZY)
	private List<BudgetInitial> budgetInitials ;
*/

	/*@OneToMany(mappedBy="employe",
			cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
			fetch=FetchType.LAZY)
	private List<Budget> budgets ;*/



	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getPrenom() {
		return prenom;
	}

	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean isActif() {
		return isActif;
	}

	public void setActif(boolean isActif) {
		this.isActif = isActif;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public Direction getDirection() {
		return direction;
	}

	public void setDirection(Direction direction) {
		this.direction = direction;
	}

	/*public Contrat getContrat() {
		return contrat;
	}

	public void setContrat(Contrat contrat) {
		this.contrat = contrat;
	}
*/
	public static long getSerialversionuid() {
		return serialVersionUID;
	}


	public Employe(String nom, String prenom, String email, String password, Role role) {
		this.prenom = prenom;
		this.nom = nom;
		this.email = email;
		this.password = password;
		this.role = role;
	}




	/*public List<BudgetInitial> getBudgetInitials() {
		return budgetInitials;
	}

	public void setBudgetInitials(List<BudgetInitial> budgetInitials) {
		this.budgetInitials = budgetInitials;
	}*/
}

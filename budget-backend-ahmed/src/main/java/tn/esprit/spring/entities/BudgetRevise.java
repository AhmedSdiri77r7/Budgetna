package tn.esprit.spring.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BudgetRevise {
	
	private static final long serialVersionUID = -3046278688391172322L;

	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private int id;

	private String name;

	private String description;
	private float tauxBudget;







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



	public String getDescription() {
		return description;
	}



	public void setDescription(String description) {
		this.description = description;
	}



	public float getTauxBudget() {
		return tauxBudget;
	}



	public void setTauxBudget(float tauxBudget) {
		this.tauxBudget = tauxBudget;
	}







	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	



	
	

}

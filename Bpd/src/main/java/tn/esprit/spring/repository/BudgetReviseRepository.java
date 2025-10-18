package tn.esprit.spring.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


import tn.esprit.spring.entities.BudgetRevise;

@Repository
public interface BudgetReviseRepository extends CrudRepository<BudgetRevise, Integer> {

}

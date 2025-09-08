package tn.esprit.spring.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


import tn.esprit.spring.entities.Direction;
@Repository
public interface DirectionRepository extends CrudRepository<Direction, Integer>{

}

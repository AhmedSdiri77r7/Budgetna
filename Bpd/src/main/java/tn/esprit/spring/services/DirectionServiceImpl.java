package tn.esprit.spring.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tn.esprit.spring.entities.Direction;
import tn.esprit.spring.repository.DirectionRepository;

@Service
public class DirectionServiceImpl implements IDirectionService {


	@Autowired
	DirectionRepository deptRepoistory;


	public List<Direction> getAllDirections() {
		return (List<Direction>) deptRepoistory.findAll();
	}
	public Direction getDirectionById(int depId) {
		return deptRepoistory.findById(depId).orElse(null);
	}
}

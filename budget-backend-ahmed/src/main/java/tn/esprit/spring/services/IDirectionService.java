package tn.esprit.spring.services;

import java.util.List;

import tn.esprit.spring.entities.Direction;


public interface IDirectionService {
	
	
	public List<Direction> getAllDirections();


	public Direction getDirectionById(int depId);
	
	

	
}

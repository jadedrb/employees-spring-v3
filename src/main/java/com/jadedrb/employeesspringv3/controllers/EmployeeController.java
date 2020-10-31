package com.jadedrb.employeesspringv3.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jadedrb.employeesspringv3.ResourceNotFoundException;
import com.jadedrb.employeesspringv3.models.Employee;
import com.jadedrb.employeesspringv3.repositories.EmployeeRepository;

@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class EmployeeController {

	@Autowired
	private EmployeeRepository employeeRepository;
	
	
	
	// GET : RETRIEVE ALL EmployeeS
	@GetMapping("/employees")
	public List<Employee> getAllemployees(Model model) {
		System.out.println("GET employees (all)");
		return this.employeeRepository.findAll();
	}
	
	
	
	// POST : CREATE NEW EXAMPLE
	@PostMapping("/employees")
	public Employee createOrSaveExample(@Valid @RequestBody Employee newEmployee) {
		System.out.println("POST employee");
		return this.employeeRepository.save(newEmployee);
	}
	
	
	
	// GET : RETRIEVE EXAMPLE BY ID
	@GetMapping("/employees/{id}")
	public ResponseEntity<Employee> getEmployeeById(@PathVariable(value = "id") Long employeeId) 
		throws ResourceNotFoundException {
		
			Employee employee = employeeRepository.findById(employeeId)
					.orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
			
			System.out.println("GET employee " + employeeId);
			return ResponseEntity.ok().body(employee);
	}
	
	
	
	// PUT : UPDATE EXAMPLE DETAILS
	@PutMapping("/employees/{id}")
	public ResponseEntity<Employee> updateEmployee(@PathVariable(value = "id") Long employeeId, 
			@Valid @RequestBody Employee employeeDetails) throws ResourceNotFoundException {
		
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
		
		employee.setEmail(employeeDetails.getEmail());
		employee.setFirstName(employeeDetails.getFirstName());
		employee.setLastName(employeeDetails.getLastName());
		employee.setJobTitle(employeeDetails.getJobTitle());
		
		final Employee updatedEmployee = employeeRepository.save(employee);
		System.out.println("UPDATE employee " + employeeId);
		return ResponseEntity.ok(updatedEmployee);
	}

	
	
	// DELETE : DELETE Employee BY ID
	@DeleteMapping("/employees/{id}")
	public Map<String, Boolean> deleteEmployee(@PathVariable(value = "id") Long employeeId)
		throws ResourceNotFoundException {
		
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
		
		employeeRepository.delete(employee);
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		System.out.println("DELETE employee " + employeeId);
		return response;
	}
	
}


package com.jadedrb.employeesspringv3.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jadedrb.employeesspringv3.models.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}

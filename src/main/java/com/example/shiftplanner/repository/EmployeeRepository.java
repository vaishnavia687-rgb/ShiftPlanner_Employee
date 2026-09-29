package com.example.shiftplanner.repository;

import com.example.shiftplanner.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}

package com.example.shiftplanner.service;

import com.example.shiftplanner.entity.Employee;
import com.example.shiftplanner.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // CREATE
    public Employee addEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    // READ
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // UPDATE
    public Employee updateEmployee(Long id, Employee employeeDetails) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));

        employee.setName(employeeDetails.getName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setRole(employeeDetails.getRole());

        return employeeRepository.save(employee);
    }

    // DELETE
    public void deleteEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));

        employeeRepository.delete(employee);
    }
}
package com.example.shiftplanner.service;

import com.example.shiftplanner.entity.Employee;
import com.example.shiftplanner.repository.EmployeeRepository;
import com.example.shiftplanner.repository.RosterRepository;
import com.example.shiftplanner.repository.SwapRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final RosterRepository rosterRepository;
    private final SwapRequestRepository swapRequestRepository;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            RosterRepository rosterRepository,
            SwapRequestRepository swapRequestRepository) {

        this.employeeRepository = employeeRepository;
        this.rosterRepository = rosterRepository;
        this.swapRequestRepository = swapRequestRepository;
    }

    // CREATE
    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    // GET ALL
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // UPDATE
    public Employee updateEmployee(Long id, Employee employee) {

        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        existingEmployee.setName(employee.getName());
        existingEmployee.setEmail(employee.getEmail());
        existingEmployee.setRole(employee.getRole());

        return employeeRepository.save(existingEmployee);
    }

    // DELETE
    public void deleteEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // 1. Delete swap requests involving this employee
        swapRequestRepository.findAll().stream()
                .filter(request ->
                        (request.getRequester() != null &&
                                request.getRequester().getId().equals(id))
                                ||
                                (request.getColleague() != null &&
                                        request.getColleague().getId().equals(id))
                )
                .forEach(swapRequestRepository::delete);

        // 2. Delete roster records of this employee
        rosterRepository.findAll().stream()
                .filter(roster ->
                        roster.getEmployee() != null &&
                                roster.getEmployee().getId().equals(id)
                )
                .forEach(rosterRepository::delete);

        // 3. Finally delete employee
        employeeRepository.delete(employee);
    }
}


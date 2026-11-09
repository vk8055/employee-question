package com.example.server.employees;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping()
    public List<EmployeeDto> getEmployees() {
        List<Employee> employees = employeeRepository.findAll(); // TODO: should this return all employees, or only active ones?
        return employees.stream()
                .map(employee -> new EmployeeDto(
                        employee.getId(),
                        employee.getName(),
                        employee.getDepartment(),
                        employee.getTitle()))
                .toList();
    }

}

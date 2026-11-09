package com.example.server.employees;

import java.util.UUID;

public record EmployeeDto(
        UUID id,
        String name,
        String department,
        String title) {

}

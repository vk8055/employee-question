# Team Directory

## Overview

This is a full-stack application built with Spring Boot, React 19 and a PostgreSQL database.
It shows a company team directory. The directory must only display employees who are currently
**active**.

## The task

The `GET /api/employees` endpoint currently returns **every** employee, including people who have
left the company (inactive). As a result, the directory shows employees who should no longer appear.

Fix the backend so the endpoint returns **only employees who are active**.

The seed data contains five employees: three are active and two are inactive. When the fix is
correct, the endpoint and the directory show three employees.

## Running the application

The backend and frontend start automatically; terminals open and show their logs. Once the React
application is up, a browser tab opens on the directory.

- Backend check: open `http://localhost:9000/api/employees`.
- Restart backend: run `mvn spring-boot:run` in the `server` folder.
- Restart frontend: run `npm run dev` in the `app` folder.

## Running the tests

Use the "Run tests" button, or run them manually:

- Frontend: `npm test` in the `app` folder.
- Backend: `mvn test` in the `server` folder.

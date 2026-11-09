# Sample question: Team Directory (active-employees filter)

A self-contained Project question for the Spring + React + PostgreSQL stack. Same required structure
(`app/`, `server/`, `scripts/runtests.mjs`), a fresh domain. Used to validate the author -> candidate
-> grading flow on a clean, brand-new question.

## The task given to the candidate
`GET /api/employees` must return only employees who are **active**. The seed data has 3 active and 2
inactive employees, so a correct answer returns 3.

## The deliberate defect (candidate starting state)
`server/src/main/java/com/example/server/employees/EmployeeController.java` calls
`employeeRepository.findAll()` (returns all 5).

- Backend test (`server/src/test/java/com/example/server/EmployeeControllerTest.java`) expects 3
  active employees, so it **fails** in this state. This is the candidate's starting point.
- Frontend test (`app/src/tests/employee.test.tsx`) checks the employee card renders its fields and
  **passes** regardless.

## The fix (correct solution)
In `EmployeeController.getEmployees()`, replace:

```java
List<Employee> employees = employeeRepository.findAll();
```

with:

```java
List<Employee> employees = employeeRepository.findByActiveTrue();
```

With this change both tests pass.

## How to use it as an author
1. In the author IDE, clone or copy this project into `/workspace/project` (keep the `app`, `server`
   and `scripts` folders and their names).
2. Apply the fix above, then press **Run tests**: both suites should pass. This proves the tests are
   valid.
3. Revert the fix (put `findAll()` back) so the backend test fails again. That is the candidate
   starting state.
4. Press **Sync**: each test becomes a scoring criterion. Save the question.
5. As a candidate, apply the fix and submit. Grading should award the backend criterion once the
   endpoint returns only active employees.

## Report locations (defaults, unchanged)
- Frontend JUnit: `app/junit-reports/junit.xml`
- Backend JUnit: `server/target/surefire-reports/`
- Entry point: `node scripts/runtests.mjs`

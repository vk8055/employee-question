import { useEffect, useState } from 'react'
import styles from './App.module.css'
import Employee from './Employee';
import type { EmployeeDto } from './types';

function App() {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);

  useEffect(() => {
    fetch("/api/employees")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);

  return (
    <div>
      <div>
        <h1>Team Directory</h1>
        <div>Number of active employees: {employees.length}</div>
        <main className={styles.main}>
          {employees.map((employee) => (
            <Employee key={employee.id} employee={employee} />
          ))}
        </main>
      </div>
    </div>
  )
}

export default App

import styles from './employee.module.css'
import type { EmployeeDto } from "./types";

interface EmployeeProps {
    employee: EmployeeDto
};

export function Employee({ employee }: EmployeeProps) {
    return (
        <div className={styles.employee}>
            <h2 className={styles.name}>{employee.name}</h2>
            <small>{employee.department}</small>
            <div>{employee.title}</div>
        </div>
    );
};

export default Employee;

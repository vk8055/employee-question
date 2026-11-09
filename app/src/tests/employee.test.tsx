import { render, screen } from '@testing-library/react';
import { Employee } from '../Employee';

const employee = {
    id: 'id',
    name: 'Ava Patel',
    department: 'Engineering',
    title: 'Senior Engineer',
}

test('Shows employee data with all the expected fields', async () => {
    render(<Employee employee={employee} />);
    expect(await screen.findByText(employee.name)).toBeInTheDocument();
    expect(await screen.findByText(employee.department)).toBeInTheDocument();
    expect(await screen.findByText(employee.title)).toBeInTheDocument();
});

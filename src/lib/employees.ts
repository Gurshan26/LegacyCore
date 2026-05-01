import type { EmploymentType } from '@/types/payroll';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  employmentType: EmploymentType;
  hourlyRate: number;
  hoursThisPeriod: number;
  annualLeaveBalance: number;
  sickLeaveBalance: number;
  ytdGross: number;
}

export const EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Priya Sharma',
    role: 'Senior Systems Analyst',
    department: 'Technology',
    employmentType: 'F',
    hourlyRate: 85.0,
    hoursThisPeriod: 80,
    annualLeaveBalance: 45.5,
    sickLeaveBalance: 18.0,
    ytdGross: 110500.0,
  },
  {
    id: 'EMP-002',
    name: 'James Okonkwo',
    role: 'COBOL Developer',
    department: 'Core Banking',
    employmentType: 'F',
    hourlyRate: 92.5,
    hoursThisPeriod: 76,
    annualLeaveBalance: 62.0,
    sickLeaveBalance: 0.0,
    ytdGross: 143350.0,
  },
  {
    id: 'EMP-003',
    name: 'Sarah Liu',
    role: 'Project Coordinator',
    department: 'Operations',
    employmentType: 'P',
    hourlyRate: 55.0,
    hoursThisPeriod: 60,
    annualLeaveBalance: 28.0,
    sickLeaveBalance: 12.0,
    ytdGross: 42900.0,
  },
  {
    id: 'EMP-004',
    name: 'Marcus Thompson',
    role: 'Business Analyst',
    department: 'Strategy',
    employmentType: 'F',
    hourlyRate: 78.0,
    hoursThisPeriod: 84,
    annualLeaveBalance: 38.5,
    sickLeaveBalance: 22.0,
    ytdGross: 95940.0,
  },
  {
    id: 'EMP-005',
    name: 'Anika Patel',
    role: 'Data Entry Operator',
    department: 'Finance',
    employmentType: 'C',
    hourlyRate: 34.5,
    hoursThisPeriod: 45,
    annualLeaveBalance: 0.0,
    sickLeaveBalance: 0.0,
    ytdGross: 18630.0,
  },
  {
    id: 'EMP-006',
    name: 'Robert Chen',
    role: 'Infrastructure Lead',
    department: 'Technology',
    employmentType: 'F',
    hourlyRate: 110.0,
    hoursThisPeriod: 76,
    annualLeaveBalance: 95.0,
    sickLeaveBalance: 38.0,
    ytdGross: 206800.0,
  },
  {
    id: 'EMP-007',
    name: 'Fatima Al-Hassan',
    role: 'Compliance Officer',
    department: 'Legal',
    employmentType: 'F',
    hourlyRate: 88.0,
    hoursThisPeriod: 79,
    annualLeaveBalance: 15.5,
    sickLeaveBalance: 5.0,
    ytdGross: 136400.0,
  },
  {
    id: 'EMP-008',
    name: 'Dylan Murray',
    role: 'Graduate Developer',
    department: 'Technology',
    employmentType: 'F',
    hourlyRate: 45.0,
    hoursThisPeriod: 76,
    annualLeaveBalance: 8.0,
    sickLeaveBalance: 10.0,
    ytdGross: 34650.0,
  },
];

export function getEmployeeById(id: string): Employee | undefined {
  return EMPLOYEES.find((e) => e.id === id);
}

export function getEmployeesByDepartment(department: string): Employee[] {
  return EMPLOYEES.filter((e) => e.department === department);
}

export function getDepartments(): string[] {
  return [...new Set(EMPLOYEES.map((e) => e.department))];
}

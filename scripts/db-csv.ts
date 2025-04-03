import { prisma } from '../src/lib/prisma';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import fs from 'fs';
import path from 'path';
import { Region, Status, ApplicationType } from '@prisma/client';

// CSV file paths
const CSV_DIR = path.join(process.cwd(), 'data');
const EMPLOYEES_CSV = path.join(CSV_DIR, 'employees.csv');
const APPLICATIONS_CSV = path.join(CSV_DIR, 'applications.csv');

// Create CSV directory if it doesn't exist
if (!fs.existsSync(CSV_DIR)) {
  fs.mkdirSync(CSV_DIR, { recursive: true });
}

async function exportToCSV() {
  try {
    console.log('Exporting data to CSV...');

    // Export employee data
    const employees = await prisma.employee.findMany();
    const employeesCsv = stringify(employees, {
      header: true,
      columns: [
        'id',
        'name',
        'emailPersonal',
        'emailCompany',
        'region',
        'department',
        'position',
        'joiningDate',
        'terminationDate',
        'status',
        'createdAt',
        'updatedAt'
      ]
    });
    fs.writeFileSync(EMPLOYEES_CSV, employeesCsv);

    // Export application data
    const applications = await prisma.application.findMany();
    const applicationsCsv = stringify(applications, {
      header: true,
      columns: [
        'id',
        'name',
        'description',
        'type',
        'isRequired',
        'regions',
        'createdAt',
        'updatedAt'
      ]
    });
    fs.writeFileSync(APPLICATIONS_CSV, applicationsCsv);

    console.log('Export completed successfully');
  } catch (error) {
    console.error('Export failed:', error);
  }
}

async function importFromCSV() {
  try {
    console.log('Importing data from CSV...');

    // Import employee data
    if (fs.existsSync(EMPLOYEES_CSV)) {
      const employeesCsv = fs.readFileSync(EMPLOYEES_CSV, 'utf-8');
      const employees = parse(employeesCsv, {
        columns: true,
        skip_empty_lines: true
      });

      for (const employee of employees) {
        await prisma.employee.upsert({
          where: { id: employee.id },
          update: {
            name: employee.name,
            emailPersonal: employee.emailPersonal,
            emailCompany: employee.emailCompany,
            region: employee.region as Region,
            department: employee.department,
            position: employee.position,
            joiningDate: new Date(employee.joiningDate),
            terminationDate: employee.terminationDate ? new Date(employee.terminationDate) : null,
            status: employee.status as Status,
            updatedAt: new Date()
          },
          create: {
            id: employee.id,
            name: employee.name,
            emailPersonal: employee.emailPersonal,
            emailCompany: employee.emailCompany,
            region: employee.region as Region,
            department: employee.department,
            position: employee.position,
            joiningDate: new Date(employee.joiningDate),
            terminationDate: employee.terminationDate ? new Date(employee.terminationDate) : null,
            status: employee.status as Status,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
    }

    // Import application data
    if (fs.existsSync(APPLICATIONS_CSV)) {
      const applicationsCsv = fs.readFileSync(APPLICATIONS_CSV, 'utf-8');
      const applications = parse(applicationsCsv, {
        columns: true,
        skip_empty_lines: true
      });

      for (const application of applications) {
        await prisma.application.upsert({
          where: { id: application.id },
          update: {
            name: application.name,
            description: application.description,
            type: application.type as ApplicationType,
            isRequired: application.isRequired === 'true',
            regions: application.regions ? JSON.parse(application.regions) : [],
            updatedAt: new Date()
          },
          create: {
            id: application.id,
            name: application.name,
            description: application.description,
            type: application.type as ApplicationType,
            isRequired: application.isRequired === 'true',
            regions: application.regions ? JSON.parse(application.regions) : [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
    }

    console.log('Import completed successfully');
  } catch (error) {
    console.error('Import failed:', error);
  }
}

// Handle command line arguments
const command = process.argv[2];

async function main() {
  try {
    switch (command) {
      case 'export':
        await exportToCSV();
        break;
      case 'import':
        await importFromCSV();
        break;
      default:
        console.log('Please specify a command: export or import');
        process.exit(1);
    }
  } catch (error) {
    console.error('Operation failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 
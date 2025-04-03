import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stringify } from 'csv-stringify/sync';
import JSZip from 'jszip';

export async function POST() {
  try {
    // Fetch data from database
    const [employees, applications] = await Promise.all([
      prisma.employee.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.application.findMany({
        orderBy: { name: 'asc' },
      }),
    ]);

    // Convert to CSV
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
      ],
    });

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
      ],
    });

    // Create a zip file containing both CSVs
    const zip = new JSZip();
    zip.file('employees.csv', employeesCsv);
    zip.file('applications.csv', applicationsCsv);
    
    const zipContent = await zip.generateAsync({ type: 'uint8array' });

    // Return the zip file
    return new NextResponse(zipContent, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=data-export.zip',
      },
    });
  } catch (error) {
    console.error('Export failed:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
} 
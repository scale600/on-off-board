import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parse } from 'csv-parse/sync';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileContent = await file.text();
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Determine file type based on content
    const isEmployeeData = records[0]?.emailPersonal !== undefined;
    
    if (isEmployeeData) {
      // Import employee data
      for (const record of records) {
        await prisma.employee.upsert({
          where: { id: record.id },
          update: {
            name: record.name,
            emailPersonal: record.emailPersonal,
            emailCompany: record.emailCompany,
            region: record.region,
            department: record.department,
            position: record.position,
            joiningDate: new Date(record.joiningDate),
            terminationDate: record.terminationDate ? new Date(record.terminationDate) : null,
            status: record.status,
            updatedAt: new Date(),
          },
          create: {
            id: record.id,
            name: record.name,
            emailPersonal: record.emailPersonal,
            emailCompany: record.emailCompany,
            region: record.region,
            department: record.department,
            position: record.position,
            joiningDate: new Date(record.joiningDate),
            terminationDate: record.terminationDate ? new Date(record.terminationDate) : null,
            status: record.status,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    } else {
      // Import application data
      for (const record of records) {
        await prisma.application.upsert({
          where: { id: record.id },
          update: {
            name: record.name,
            description: record.description,
            type: record.type,
            isRequired: record.isRequired === 'true',
            regions: record.regions ? JSON.parse(record.regions) : [],
            updatedAt: new Date(),
          },
          create: {
            id: record.id,
            name: record.name,
            description: record.description,
            type: record.type,
            isRequired: record.isRequired === 'true',
            regions: record.regions ? JSON.parse(record.regions) : [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Import failed:', error);
    return NextResponse.json(
      { error: 'Failed to import data' },
      { status: 500 }
    );
  }
} 